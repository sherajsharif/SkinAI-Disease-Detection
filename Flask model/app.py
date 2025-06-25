from flask import Flask, request, jsonify, g
from flask_cors import CORS
import numpy as np
import os
import tempfile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import logging
from PIL import Image
import imghdr
import cv2
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db
import pandas as pd
from flask import url_for

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# --- Database setup ---
DATABASE = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Initialize database
with app.app_context():
    init_db()

# --- Auth Routes ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    db = get_db()
    try:
        db.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, generate_password_hash(password)),
        )
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username or email already exists'}), 409

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()

    if user is None:
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid username or password'}), 401

    return jsonify({
        'message': 'Login successful',
        'user': {'id': user['id'], 'username': user['username']}
    }), 200

# Define allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def detect_skin(image_path):
    """
    Detect if the image likely contains skin using color thresholds
    Returns: (bool, percentage of skin-like pixels)
    """
    try:
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            return False, 0
        
        # Convert to HSV color space
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Define skin color range in HSV
        lower_threshold = np.array([0, 20, 70], dtype=np.uint8)
        upper_threshold = np.array([20, 150, 255], dtype=np.uint8)
        
        # Create binary mask for skin color
        skin_mask = cv2.inRange(hsv, lower_threshold, upper_threshold)
        
        # Calculate percentage of skin pixels
        total_pixels = skin_mask.size
        skin_pixels = np.count_nonzero(skin_mask)
        skin_percentage = (skin_pixels / total_pixels) * 100
        
        # Return True if at least 10% of the image contains skin-like pixels
        return skin_percentage >= 10, skin_percentage
    except Exception as e:
        logger.error(f"Error in skin detection: {str(e)}")
        return False, 0

def validate_image(file_path):
    """Validate that the file is a proper image file"""
    try:
        # Try to open the image with PIL
        with Image.open(file_path) as img:
            # Check if the file is actually an image
            img.verify()
            
            # Get image format
            format = img.format.lower() if img.format else None
            if format not in ['png', 'jpeg', 'webp']:
                return False, f"Unsupported image format: {format}"
            
            # Check image dimensions
            if img.size[0] < 32 or img.size[1] < 32:
                return False, "Image dimensions too small (minimum 32x32)"
            
            if img.size[0] > 4096 or img.size[1] > 4096:
                return False, "Image dimensions too large (maximum 4096x4096)"
            
            # Check for skin presence
            has_skin, skin_percentage = detect_skin(file_path)
            if not has_skin:
                return False, (
        "No significant skin area detected. "
        "Please upload or capture a clear photo of the affected skin area. "
        f"(Found only {skin_percentage:.1f}% skin-like pixels)"
    )
            
            return True, "Valid image"
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"

MODEL_PATH = os.path.join('model', 'skin_disease_model.h5')
try:
    logger.info(f"Loading model from {MODEL_PATH}")
    model = load_model(MODEL_PATH)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

# Update this list to match your model's class order
CLASS_NAMES = [
    'BA-cellulitis',
    'BA-impetigo',
    'FU-athlete-foot',
    'FU-nail-fungus',
    'FU-ringworm',
    'PA-cutaneous-larva-migrans',
    'VI-chickenpox',
    'VI-shingles'
]

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        logger.error("No file part in request")
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        logger.error(f"Invalid file type: {file.filename}")
        return jsonify({'error': 'Invalid file type. Allowed types: PNG, JPG, JPEG, WEBP'}), 400
    
    try:
        logger.info(f"Processing file: {file.filename}")
        
        # Save the file temporarily
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, file.filename)
        file.save(temp_path)
        
        # Validate the image
        is_valid, message = validate_image(temp_path)
        if not is_valid:
            logger.error(f"Invalid image: {message}")
            os.remove(temp_path)
            os.rmdir(temp_dir)
            return jsonify({'error': f'Invalid image: {message}'}), 400
        
        # Load and preprocess the image
        img = image.load_img(temp_path, target_size=(128, 128))
        logger.info("Image loaded successfully")
        
        # Clean up the temporary file
        os.remove(temp_path)
        os.rmdir(temp_dir)
        
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = x / 255.0
        logger.info("Image preprocessed successfully")
        
        # Make prediction
        preds = model.predict(x)
        logger.info("Prediction made successfully")
        
        pred_class_idx = int(np.argmax(preds, axis=1)[0])
        confidence = float(np.max(preds))
        
        # Increased confidence threshold to 70%
        if confidence < 0.7:  # Increased from 0.5 to 0.7
            return jsonify({
                'error': 'Unable to detect a skin disease with sufficient confidence',
                'confidence': confidence
            }), 400
            
        pred_class = CLASS_NAMES[pred_class_idx]
        
        logger.info(f"Prediction results - Class: {pred_class}, Confidence: {confidence}")
        
        return jsonify({
            'class': pred_class,
            'confidence': confidence,
            'class_idx': pred_class_idx
        })
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'details': str(e)
        }), 500

@app.route('/dbtest', methods=['GET'])
def dbtest():
    db = get_db()
    try:
        cur = db.execute('SELECT COUNT(*) as user_count FROM users')
        row = cur.fetchone()
        return jsonify({'user_count': row['user_count']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    df = pd.read_excel('data/disease.xlsx')
    if 'index' in df.columns:
        df = df.drop(columns=['index'])
    diseases = df.to_dict(orient='records')
    # Only use url_for if not a full URL
    for disease in diseases:
        image_filename = disease.get('image')
        if image_filename and not str(image_filename).startswith('http'):
            disease['image'] = url_for('static', filename=f'uploads/{image_filename}', _external=True)
        # If it starts with http, leave as is
    return jsonify(diseases)

@app.route('/api/disease_info', methods=['GET'])
def get_disease_info():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Missing disease name'}), 400
    df = pd.read_excel('data/disease.xlsx')
    disease_row = df[df['disease_name'].str.lower().str.contains(name.lower())]
    if disease_row.empty:
        return jsonify({'error': 'Disease not found'}), 404
    disease_info = disease_row.iloc[0].to_dict()
    image_filename = disease_info.get('image')
    if image_filename and not str(image_filename).startswith('http'):
        disease_info['image'] = url_for('static', filename=f'uploads/{image_filename}', _external=True)
    return jsonify({'disease': disease_info})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 