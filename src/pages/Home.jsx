import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom'; // Import pour la redirection
import Navigation from '../components/Navigation';
import ServiceCard from '../components/ServiceCard';
import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // État pour la barre de recherche du Hero
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  // --- APPEL API (Services récents) ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('https://kribi-connect-backend.vercel.app/api/services?limit=4');
        setServices(response.data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Erreur API :", error);
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // --- HANDLER RECHERCHE ---
  const handleSearch = (e) => {
    e.preventDefault(); // Empêche le rechargement de page si c'est un formulaire
    if (heroSearch.trim()) {
      // Redirection vers la page articles avec le paramètre 'q'
      navigate(`/articles?q=${encodeURIComponent(heroSearch)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSearch(e);
    }
  };

  // --- HANDLERS MODAL ---
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="full-page-container fade-in">
      <Navigation />
      
      <div className="main-content">
        {/* Hero Section */}
        <div 
            className="hero-section text-center px-3 d-flex align-items-center justify-content-center"
            style={{ 
                width: '100%', 
                minHeight: '60vh', 
                background: "linear-gradient(rgba(0, 66, 116, 0.7), rgba(0, 30, 60, 0.8)), url('https://images.unsplash.com/photo-1589923158776-0f5f88a34903?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat"
            }}
        >
          <div style={{ maxWidth: '800px' }} className="text-white">
            <h1 className="display-3 fw-bold mb-4 text-shadow">Connectez-vous aux opportunités de Kribi</h1>
            <p className="lead mb-5 fs-4">La plateforme numéro 1 pour les services et articles locaux.</p>
            
            {/* Barre de recherche connectée */}
            <div className="bg-white p-2 rounded-pill shadow-lg d-flex mx-auto hover-scale" style={{ maxWidth: '600px' }}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-0 ps-3">
                    <BiSearch size={24} className="text-primary"/>
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher un plombier, du poisson, un hôtel..." 
                  className="border-0 shadow-none fs-5"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                    className="btn-primary rounded-pill px-4 fw-bold btn-animate"
                    onClick={handleSearch}
                >
                    Rechercher
                </Button>
              </InputGroup>
            </div>
          </div>
        </div>

        {/* Section Contenu Dynamique */}
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 className="fw-bold text-dark mb-1">Les dernières annonces</h2>
                <p className="text-muted">Découvrez ce qui vient d'être publié à Kribi</p>
            </div>
            <Button variant="outline-primary" className="rounded-pill px-4 hover-scale btn-animate" href="/articles">
                Voir tout
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p>Chargement des offres...</p>
            </div>
          ) : (
            <Row className="g-4">
              {services.length > 0 ? services.map(service => (
                <Col key={service.id} md={3} sm={6}>
                  <div className="hover-scale h-100">
                      <ServiceCard data={service} onClick={handleCardClick} />
                  </div>
                </Col>
              )) : (
                <p className="text-center text-muted col-12">Aucune annonce pour le moment.</p>
              )}
            </Row>
          )}
        </Container>
      </div>
      
      <ProductModal show={showModal} onHide={handleCloseModal} product={selectedProduct} />
      <Footer />
    </div>
  );
};

export default Home;