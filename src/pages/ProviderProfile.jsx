import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Row, Col, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiPlus, BiTrash, BiBarChartAlt2, BiPackage, BiStar, BiUserCircle } from 'react-icons/bi'; // BiStar importé

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProfileHeader from '../components/profile/ProfileHeader';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';

const ProviderProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [provider, setProvider] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [reviews, setReviews] = useState([]); // État pour les avis
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États formulaires
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({ title: '', price: '', category: 'Divers', description: '' });
  const [imageFiles, setImageFiles] = useState(null);

  // États pour la notation
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isOwner = user && parseInt(user.id) === parseInt(id);

  const fetchProviderData = async () => {
      try {
        // 1. Profil (renvoie maintenant averageRating calculé)
        const resUser = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
        setProvider(resUser.data);

        // 2. Services
        const resServices = await axios.get('http://localhost:5000/api/services');
        const myServices = resServices.data.filter(s => s.providerId === parseInt(id));
        setProviderServices(myServices);

        // 3. Avis
        const resReviews = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(resReviews.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le profil.");
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchProviderData();
  }, [id]);

  const handleContact = () => {
      if (!user) { navigate('/login'); } 
      else { navigate('/messagerie', { state: { startChatWith: id } }); }
  };

  // --- SOUMISSION D'UN AVIS ---
  const handleSubmitReview = async (e) => {
      e.preventDefault();
      if (!user) return navigate('/login');
      if (newRating === 0) return alert("Veuillez sélectionner une note.");

      setSubmittingReview(true);
      try {
          await axios.post('http://localhost:5000/api/reviews', {
              targetUserId: id,
              reviewerId: user.id,
              rating: newRating,
              comment: newComment
          });
          
          // Reset et recharge
          setNewRating(0);
          setNewComment('');
          alert("Merci pour votre avis !");
          fetchProviderData(); // Recharge tout pour mettre à jour la moyenne dans le header
      } catch (err) {
          console.error(err);
          alert(err.response?.data?.message || "Erreur lors de l'envoi de l'avis");
      } finally {
          setSubmittingReview(false);
      }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append('title', newService.title);
        formData.append('price', newService.price);
        formData.append('category', newService.category);
        formData.append('description', newService.description);
        formData.append('providerId', user.id);
        
        if (imageFiles && imageFiles.length > 0) {
            Array.from(imageFiles).forEach(file => { formData.append('images', file); });
        }

        await axios.post('http://localhost:5000/api/services', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        fetchProviderData();
        setShowAddModal(false);
        setNewService({ title: '', price: '', category: 'Divers', description: '' });
        setImageFiles(null);
        alert("Annonce publiée !");
    } catch (err) { alert("Erreur lors de la création"); }
  };

  const handleDeleteService = (serviceId) => {
    if(window.confirm("Supprimer cet article ?")) {
        setProviderServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center"><Spinner animation="border" /></div>;
  if (error || !provider) return <div className="text-center mt-5"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="fade-in">
      <Navigation />
      
      <ProfileHeader 
        type="provider"
        name={provider.name}
        location="Kribi, Cameroun"
        rating={provider.averageRating} // La note vient maintenant du backend
        avatar={provider.avatar}
        isOwner={isOwner}
        onContact={handleContact}
      />

      <Container className="py-4">
        <Tabs defaultActiveKey="services" className="mb-4 custom-tabs">
            
            {isOwner && (
                <Tab eventKey="dashboard" title={<span><BiBarChartAlt2 className="me-1"/> Tableau de bord</span>}>
                    {/* ... (Code Dashboard inchangé) ... */}
                    <Row className="g-4 mb-4">
                        <Col md={4}>
                            <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                                <h6 className="text-muted text-uppercase small">Total Services</h6>
                                <h2 className="fw-bold text-primary mb-0">{providerServices.length}</h2>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-warning">
                                <h6 className="text-muted text-uppercase small">Note Moyenne</h6>
                                <h2 className="fw-bold text-warning mb-0">{provider.averageRating || '-'} / 5</h2>
                            </div>
                        </Col>
                    </Row>
                    <div className="bg-white p-4 rounded shadow-sm">
                        <Button variant="primary" className="btn-kribi" onClick={() => setShowAddModal(true)}>
                            <BiPlus className="me-1"/> Publier une nouvelle annonce
                        </Button>
                    </div>
                </Tab>
            )}

            <Tab eventKey="services" title="Nos Articles & Services">
                {/* ... (Code Services inchangé) ... */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Catalogue</h4>
                    {isOwner && <Button size="sm" variant="success" onClick={() => setShowAddModal(true)}><BiPlus /> Ajouter</Button>}
                </div>
                <Row className="g-4">
                    {providerServices.length > 0 ? providerServices.map(service => (
                        <Col key={service.id} md={4}>
                            <div className="position-relative h-100">
                                <ServiceCard data={service} onClick={() => {}} />
                                {isOwner && (
                                    <Button variant="danger" size="sm" className="position-absolute top-0 start-0 m-2 shadow" onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }}>
                                        <BiTrash />
                                    </Button>
                                )}
                            </div>
                        </Col>
                    )) : (
                        <Col md={12}><p className="text-center text-muted py-5">Aucun service publié.</p></Col>
                    )}
                </Row>
            </Tab>

            {/* ONGLET AVIS CLIENTS */}
            <Tab eventKey="reviews" title={`Avis Clients (${reviews.length})`}>
                <Row>
                    <Col md={8}>
                        {/* FORMULAIRE D'AVIS (Visible si Visiteur Connecté) */}
                        {!isOwner && user && (
                            <div className="bg-white p-4 rounded shadow-sm mb-4 border-start border-4 border-warning">
                                <h5 className="fw-bold mb-3">Laissez votre avis</h5>
                                <Form onSubmit={handleSubmitReview}>
                                    <div className="mb-3">
                                        <label className="form-label d-block">Votre note :</label>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <BiStar 
                                                key={star} 
                                                size={30} 
                                                className={`cursor-pointer me-1 ${star <= newRating ? 'text-warning fill-current' : 'text-muted'}`}
                                                style={{ fill: star <= newRating ? 'currentColor' : 'none', cursor: 'pointer' }}
                                                onClick={() => setNewRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <Form.Group className="mb-3">
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3} 
                                            placeholder="Partagez votre expérience..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="btn-kribi" disabled={submittingReview}>
                                        {submittingReview ? 'Envoi...' : 'Publier mon avis'}
                                    </Button>
                                </Form>
                            </div>
                        )}

                        {/* LISTE DES AVIS */}
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white p-4 rounded shadow-sm mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            {review.reviewer.avatar ? (
                                                <img src={review.reviewer.avatar} className="rounded-circle me-2" width="40" height="40" alt=""/>
                                            ) : (
                                                <BiUserCircle size={40} className="text-secondary me-2"/>
                                            )}
                                            <div>
                                                <span className="fw-bold d-block">{review.reviewer.name}</span>
                                                <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                        <div className="text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <BiStar key={i} style={{ fill: i < review.rating ? 'currentColor' : 'none' }} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-secondary mb-0">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted p-4 bg-white rounded">Soyez le premier à laisser un avis !</p>
                        )}
                    </Col>
                </Row>
            </Tab>

            <Tab eventKey="about" title="À propos">
                <div className="bg-white p-4 rounded shadow-sm">
                    <h4>Contact</h4>
                    <p>Email: {provider.email}</p>
                    <p>Membre depuis le: {new Date(provider.createdAt).toLocaleDateString()}</p>
                </div>
            </Tab>
        </Tabs>
      </Container>
      
      {/* MODAL AJOUT (Inchangé) */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Ajouter un Service</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateService}>
            <Modal.Body>
                <Form.Group className="mb-3"><Form.Label>Titre</Form.Label><Form.Control type="text" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Prix</Form.Label><Form.Control type="text" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} /></Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Catégorie</Form.Label>
                    <Form.Select value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
                        <option>Divers</option><option>Immobilier</option><option>Alimentation</option><option>Transport</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Images</Form.Label>
                    <Form.Control type="file" accept="image/*" multiple onChange={e => setImageFiles(e.target.files)} />
                </Form.Group>
                <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} /></Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button variant="primary" type="submit" className="btn-kribi">Publier</Button>
            </Modal.Footer>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default ProviderProfile;