import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AIEngine from './components/AIEngine';
import Medicine from './components/Medicine';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import ResultPage from './components/ResultPage';
import Footer from './components/Footer';
import './App.css';

const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
};

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Navbar />
            <div className="App">
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/ai-engine" element={
                            <PrivateRoute>
                                <AIEngine />
                            </PrivateRoute>
                        } />
                        <Route path="/result" element={
                            <PrivateRoute>
                                <ResultPage />
                            </PrivateRoute>
                        } />
                        <Route path="/medicine" element={<Medicine />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App; 