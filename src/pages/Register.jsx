import React, { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BiShow, BiHide } from 'react-icons/bi'; // Import des icônes d'oeil

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // États pour les mots de passe et leur visibilité
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset erreur

    // 1. Validation de confirmation
    if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }

    // 2. Validation longueur (optionnel mais recommandé)
    if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light fade-in">
      <Card style={{ width: '450px' }} className="shadow border-0 p-4">
        <h2 className="text-center text-primary fw-bold mb-4">KribiConnect</h2>
        <h4 className="text-center mb-4">Créer un compte</h4>
        
        {error && <Alert variant="danger" className="py-2 text-center small">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* Nom */}
          <Form.Group className="mb-3">
            <Form.Label>Nom complet</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Ex: Jean Dupont" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
                type="email" 
                placeholder="email@exemple.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
          </Form.Group>

          {/* Mot de passe avec Oeil */}
          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <InputGroup>
                <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <BiHide /> : <BiShow />}
                </Button>
            </InputGroup>
          </Form.Group>

          {/* Confirmation Mot de passe */}
          <Form.Group className="mb-3">
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <InputGroup>
                <Form.Control 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className={password && confirmPassword && password !== confirmPassword ? "is-invalid" : ""}
                />
                <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <BiHide /> : <BiShow />}
                </Button>
            </InputGroup>
          </Form.Group>

          {/* Rôle */}
          <Form.Group className="mb-4">
            <Form.Label>Vous êtes ?</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="client">Client (Je cherche des services)</option>
                <option value="provider">Fournisseur (Je propose des services)</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 btn-kribi py-2 fw-bold">S'inscrire</Button>
        </Form>
        
        <div className="text-center mt-3">
          <small>Déjà un compte ? <Link to="/login" className="fw-bold text-decoration-none">Se connecter</Link></small>
        </div>
      </Card>
    </div>
  );
};

export default Register;