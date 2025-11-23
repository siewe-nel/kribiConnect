import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BiShieldQuarter } from 'react-icons/bi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // On utilise la même route de login, mais on vérifie le rôle APRÈS
      const res = await axios.post('https://kribi-connect-backend.vercel.app/api/auth/login', { email, password });
      
      const userData = res.data.user;

      if (userData.role !== 'admin') {
        setError("Accès refusé. Ce compte n'a pas les droits d'administrateur.");
        return;
      }

      // Si c'est un admin, on connecte et on redirige vers le dashboard
      login(userData, res.data.token);
      navigate('/admin/dashboard'); 

    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <Container style={{ maxWidth: '400px' }}>
        <Card className="shadow-lg border-0">
            <Card.Header className="bg-white text-center py-4 border-0">
                <BiShieldQuarter size={50} className="text-danger mb-2" />
                <h3 className="fw-bold text-dark">Administration</h3>
                <p className="text-muted small mb-0">Accès réservé au personnel autorisé</p>
            </Card.Header>
            <Card.Body className="p-4">
                {error && <Alert variant="danger" className="small">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Identifiant Admin</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="admin@kribiconnect.cm"
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Button variant="danger" type="submit" className="w-100 fw-bold">
                    Accéder au Console
                </Button>
                </Form>
            </Card.Body>
            <Card.Footer className="text-center bg-light py-3 border-0">
                <small className="text-muted">KribiConnect Secure System</small>
            </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default AdminLogin;