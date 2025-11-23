import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://kribi-connect-backend.vercel.app/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/'); // Redirection vers accueil après login
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Card style={{ width: '400px' }} className="shadow border-0 p-4">
        <h2 className="text-center text-primary fw-bold mb-4">KribiConnect</h2>
        <h4 className="text-center mb-4">Connexion</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control type="password" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 btn-kribi">Se connecter</Button>
        </Form>
        <div className="text-center mt-3">
          <small>Pas encore de compte ? <Link to="/register">S'inscrire</Link></small>
        </div>
      </Card>
    </div>
  );
};

export default Login;