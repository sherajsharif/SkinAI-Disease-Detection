import pandas as pd
from flask import request, jsonify, url_for, current_app

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    df = pd.read_excel('data/disease.xlsx')
    # Remove index column if present
    if 'index' in df.columns:
        df = df.drop(columns=['index'])
    diseases = df.to_dict(orient='records')
    # Update image field to be a full URL
    for disease in diseases:
        image_filename = disease.get('image')
        if image_filename and not str(image_filename).startswith('http'):
            disease['image'] = url_for('static', filename=f'uploads/{image_filename}', _external=True)
    return jsonify(diseases)

@app.route('/api/disease_info', methods=['GET'])
def get_disease_info():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Missing disease name'}), 400
    # Load disease info
    df = pd.read_excel('data/disease.xlsx')
    disease_row = df[df['disease_name'].str.lower().str.contains(name.lower())]
    if disease_row.empty:
        return jsonify({'error': 'Disease not found'}), 404
    disease_info = disease_row.iloc[0].to_dict()
    # Update image field to be a full URL
    image_filename = disease_info.get('image')
    if image_filename and not str(image_filename).startswith('http'):
        disease_info['image'] = url_for('static', filename=f'uploads/{image_filename}', _external=True)
    # Load medicine info
    mf = pd.read_excel('data/medicine.xlsx')
    # Try to match by disease name (case-insensitive, partial match)
    meds = mf[mf['Disease name'].str.lower().str.contains(name.lower())]
    medicine_list = meds.to_dict(orient='records')
    return jsonify({
        'disease': disease_info,
        'medicines': medicine_list
    })

@app.route('/api/medicines', methods=['GET'])
def get_medicines():
    mf = pd.read_excel('data/medicine.xlsx')
    medicines = mf.to_dict(orient='records')
    return jsonify(medicines) 