import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Icône de bouclier personnalisée en SVG pour remplacer BiShieldQuarter
 * Cela évite l'erreur "Could not resolve react-icons/bi"
 */
const ShieldIcon = ({ size = 50, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Note: Si AuthContext n'est pas résolu, nous gérons le stockage localement ici
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Optionnel: Déclenchement d'un événement pour mettre à jour le reste de l'app
    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setError('');

    try {
      setLoading(true);
      const res = await axios.post('https://kribi-connect-backend.vercel.app/api/auth/login', { 
        email, 
        password 
      });
      
      const userData = res.data.user;
      const token = res.data.token;

      // Vérification stricte du rôle administrateur
      if (userData.role !== 'admin') {
        setError("Accès refusé. Ce compte n'a pas les droits d'administrateur.");
        setLoading(false);
        return;
      }

      // Sauvegarde des données de session
      handleLoginSuccess(userData, token);
      
      // Redirection vers le tableau de bord
      navigate('/admin/dashboard'); 
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <Container style={{ maxWidth: '400px' }}>
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-white text-center py-4 border-0">
            <ShieldIcon size={50} className="text-danger mb-2 mx-auto" />
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
                  disabled={loading}
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
                  disabled={loading}
                  placeholder="••••••••"
                />
              </Form.Group>

              <Button 
                variant="danger" 
                type="submit" 
                className="w-100 fw-bold py-2"
                disabled={loading}
              >
                {loading ? "Vérification..." : "Accéder au Console"}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center bg-light py-3 border-0">
            <small className="text-muted">KribiConnect Secure System v2.0</small>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default AdminLogin;