import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Table, Badge, Spinner, Alert, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BiTrash, BiShoppingBag, BiCart, BiPencil } from 'react-icons/bi';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProfileHeader from '../components/profile/ProfileHeader';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ClientProfile = () => {
  const { user, loading: authLoading, logout, login } = useAuth(); // login utilisé pour mettre à jour le contexte après modif
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('cart');
  
  // États pour la modification de profil
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [updating, setUpdating] = useState(false);

  // Initialisation des données d'édition
  useEffect(() => {
    if (user) {
        setEditData({ name: user.name, email: user.email });
    }
  }, [user]);

  // Gestion de l'onglet actif via URL
  useEffect(() => {
    if (location.state && location.state.activeTab) {
        setActiveTab(location.state.activeTab);
    }
  }, [location]);

  if (authLoading) return <div className="vh-100 d-flex align-items-center justify-content-center"><Spinner animation="border" /></div>;
  if (!user) return <div className="text-center mt-5"><Alert variant="warning">Veuillez vous connecter.</Alert></div>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Commande factice
  const handleCheckout = () => {
      if(cartItems.length === 0) return;
      alert(`Commande validée pour un total de ${getCartTotal().toLocaleString()} FCFA ! \n(Simulation)`);
      clearCart();
  };

  // --- GESTION MODIFICATION PROFIL ---
  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setUpdating(true);
      try {
          // Appel à la nouvelle route backend
          const res = await axios.put(`http://localhost:5000/api/auth/user/${user.id}`, editData);
          
          // Mise à jour du contexte local (pour que le header change tout de suite)
          // On garde le token actuel (récupéré du localStorage)
          const currentToken = localStorage.getItem('kribi_token');
          login(res.data.user, currentToken); 
          
          setShowEditModal(false);
          alert("Profil mis à jour avec succès !");
      } catch (err) {
          console.error(err);
          alert("Erreur lors de la mise à jour.");
      } finally {
          setUpdating(false);
      }
  };

  return (
    <div className="fade-in">
      <Navigation />
      
      {/* HEADER : Pas d'étoiles car type="client" */}
      <ProfileHeader 
        type="client"
        name={user.name}
        location="Kribi, Cameroun"
        avatar={user.avatar}
        isOwner={true} 
        onEdit={() => setShowEditModal(true)} // Ouvre la modale
      />

      <Container className="py-4">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 custom-tabs">
            
            {/* ONGLET PANIER */}
            <Tab eventKey="cart" title={<span><BiCart className="me-1"/> Mon Panier ({cartItems.length})</span>}>
                <div className="bg-white p-4 rounded shadow-sm">
                    {cartItems.length > 0 ? (
                        <>
                            <Table hover responsive className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Produit</th>
                                        <th>Prix</th>
                                        <th>Fournisseur</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => {
                                        // Sécurisation de l'image pour éviter ERR_NAME_NOT_RESOLVED
                                        // Si item.image n'est pas une URL valide, on utilise un placeholder
                                        const safeImage = (item.image && item.image.startsWith('http')) 
                                            ? item.image 
                                            : "https://placehold.co/50x50?text=Img";

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img 
                                                            src={safeImage} 
                                                            className="rounded me-3 object-fit-cover" 
                                                            width="50" height="50" 
                                                            alt="produit"
                                                            onError={(e) => {e.target.src = "https://placehold.co/50x50?text=Err"}}
                                                        />
                                                        <div>
                                                            <span className="fw-bold d-block">{item.title}</span>
                                                            <Badge bg="light" text="dark" className="fw-normal border">{item.category}</Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-primary">{item.price}</td>
                                                <td className="text-muted small">
                                                    {typeof item.provider === 'object' ? item.provider.name : item.provider}
                                                </td>
                                                <td className="text-end">
                                                    <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(index)}>
                                                        <BiTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                            
                            <Row className="mt-4 pt-3 border-top">
                                <Col md={6} className="text-muted d-flex align-items-center">
                                    <Button variant="link" className="text-danger p-0 text-decoration-none" onClick={clearCart}>
                                        Vider le panier
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex justify-content-end align-items-center mb-3">
                                        <span className="fs-5 me-3">Total :</span>
                                        <span className="fs-3 fw-bold text-dark">{getCartTotal().toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="d-grid">
                                        <Button variant="primary" size="lg" className="btn-kribi fw-bold" onClick={handleCheckout}>
                                            Commander
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <BiShoppingBag size={64} className="text-muted mb-3 opacity-50"/>
                            <h4 className="text-muted">Votre panier est vide</h4>
                            <p className="text-muted mb-4">Découvrez nos offres et remplissez-le !</p>
                            <Button variant="outline-primary" onClick={() => navigate('/articles')}>Voir les articles</Button>
                        </div>
                    )}
                </div>
            </Tab>

            {/* ONGLET PARAMÈTRES */}
            <Tab eventKey="settings" title="Paramètres">
                <div className="bg-white p-4 rounded shadow-sm" style={{maxWidth: '600px'}}>
                    <h5 className="mb-4 border-bottom pb-2">Mes informations</h5>
                    <Row className="mb-3">
                        <Col sm={4} className="text-muted">Nom complet</Col>
                        <Col sm={8} className="fw-bold">{user.name}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={4} className="text-muted">Email</Col>
                        <Col sm={8}>{user.email}</Col>
                    </Row>
                    <Row className="mb-4">
                        <Col sm={4} className="text-muted">Rôle</Col>
                        <Col sm={8}><Badge bg="info">{user.role}</Badge></Col>
                    </Row>
                    
                    <div className="d-flex gap-2">
                        <Button variant="primary" size="sm" className="btn-kribi" onClick={() => setShowEditModal(true)}>
                            <BiPencil className="me-1"/> Modifier mes infos
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                            Se déconnecter
                        </Button>
                    </div>
                </div>
            </Tab>
        </Tabs>
      </Container>

      {/* MODALE DE MODIFICATION */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Modifier mon profil</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProfile}>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Nom complet</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={editData.name} 
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={editData.email} 
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        required
                    />
                </Form.Group>
                <Form.Text className="text-muted">
                    La modification de l'avatar n'est pas encore disponible.
                </Form.Text>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>Annuler</Button>
                <Button variant="primary" type="submit" className="btn-kribi" disabled={updating}>
                    {updating ? <Spinner as="span" animation="border" size="sm" /> : 'Sauvegarder'}
                </Button>
            </Modal.Footer>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default ClientProfile;