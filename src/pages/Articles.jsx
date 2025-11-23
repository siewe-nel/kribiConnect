import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { BiPlusCircle, BiSearch, BiX } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import ProviderCard from '../components/ProviderCard'; // Import Nouveau composant
import FilterSidebar from '../components/FilterSidebar';
import ProductModal from '../components/ProductModal';

const Articles = () => {
  const ITEMS_PER_PAGE = 9;
  const location = useLocation();

  // Data
  const [allData, setAllData] = useState([]); // Contient services ET fournisseurs
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  
  // Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchType, setSearchType] = useState('all'); // 'all', 'service', 'provider'
  const [sortOption, setSortOption] = useState('recent');

  // 1. Initialisation URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) setSearchTerm(query);
  }, [location.search]);

  // 2. Chargement Données (Services + Fournisseurs)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // On lance les deux requêtes en parallèle
        const [resServices, resProviders] = await Promise.all([
            axios.get('http://localhost:5000/api/services'),
            axios.get('http://localhost:5000/api/auth/providers')
        ]);

        // On ajoute un tag 'type' pour les distinguer
        const services = resServices.data.map(s => ({ ...s, dataType: 'service' }));
        const providers = resProviders.data.map(p => ({ ...p, dataType: 'provider' }));

        // On combine tout (ou on stocke séparément, ici combiné pour le tri global)
        setAllData([...services, ...providers]);
      } catch (error) {
        console.error("Erreur récupération", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. Logique de Filtrage Unifiée
  const getFilteredData = () => {
    let filtered = allData;

    // Filtre Type (Service vs Fournisseur)
    if (searchType !== 'all') {
        filtered = filtered.filter(item => item.dataType === searchType);
    }

    // Filtre Recherche Texte
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(item => {
            if (item.dataType === 'service') {
                return item.title.toLowerCase().includes(lowerTerm) || 
                       (item.description && item.description.toLowerCase().includes(lowerTerm));
            } else {
                // Pour un fournisseur, on cherche sur le nom
                return item.name.toLowerCase().includes(lowerTerm);
            }
        });
    }

    // Filtre Catégories (S'applique surtout aux services)
    if (selectedCategories.length > 0) {
        // On garde les fournisseurs si on ne filtre pas strictement par catégorie, 
        // ou on décide que les catégories ne s'appliquent qu'aux services.
        // Ici : Si on filtre par catégorie, on ne montre que les services correspondants.
        filtered = filtered.filter(item => 
            item.dataType === 'service' && selectedCategories.includes(item.category)
        );
    }

    // Tri
    filtered.sort((a, b) => {
        // On priorise les dates de création (si dispo) ou ID
        // Note: Les fournisseurs et services ont tous les deux 'createdAt' et 'id'
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  const displayedData = filteredData.slice(0, visibleCount);

  // Handlers
  const handleShowMore = () => setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  
  const handleCardClick = (item) => {
    if (item.dataType === 'service') {
        setSelectedProduct(item);
        setShowModal(true);
    } else {
        // Si c'est un fournisseur, le clic est géré dans ProviderCard (navigation)
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="full-page-container fade-in">
      <Navigation />
      
      <div className="main-content bg-light">
        <div className="bg-white shadow-sm py-5 mb-4 border-bottom">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <h1 className="fw-bold text-dark mb-2">Tout Kribi</h1>
                        <p className="text-muted mb-0">Recherchez des articles, des services ou des professionnels.</p>
                    </Col>
                    <Col md={6} className="mt-3 mt-md-0">
                        <InputGroup size="lg">
                            <InputGroup.Text className="bg-white border-end-0 text-muted"><BiSearch /></InputGroup.Text>
                            <Form.Control 
                                placeholder="Rechercher..."
                                className="border-start-0 border-end-0 shadow-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && <Button variant="white" className="border border-start-0" onClick={() => setSearchTerm('')}><BiX size={20}/></Button>}
                            <Button variant="primary" className="btn-kribi px-4">Go</Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </div>

        <Container className="pb-5">
          <Row>
            <Col md={3} className="d-none d-md-block mb-4">
              <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
                <FilterSidebar 
                    selectedCategories={selectedCategories} 
                    onCategoryChange={setSelectedCategories} 
                    searchType={searchType}
                    onSearchTypeChange={setSearchType}
                />
              </div>
            </Col>

            <Col md={9}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold text-secondary">
                    {loading ? "..." : `${filteredData.length} résultats`}
                  </span>
              </div>

              {loading ? (
                 <div className="text-center py-5"><Spinner animation="border" variant="primary"/></div>
              ) : (
                <>
                  <Row className="g-4">
                      {displayedData.length > 0 ? displayedData.map((item) => (
                          <Col key={`${item.dataType}-${item.id}`} md={4} sm={6}>
                              <div className="animate-item h-100">
                                {item.dataType === 'service' ? (
                                    <ServiceCard data={item} onClick={handleCardClick} />
                                ) : (
                                    <ProviderCard data={item} />
                                )}
                              </div>
                          </Col>
                      )) : (
                          <div className="text-center py-5 col-12 text-muted">Aucun résultat trouvé.</div>
                      )}
                  </Row>

                  {visibleCount < filteredData.length && (
                    <div className="text-center mt-5">
                        <Button onClick={handleShowMore} className="btn-kribi rounded-pill px-5">Voir plus</Button>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <ProductModal show={showModal} onHide={handleCloseModal} product={selectedProduct} />
      <Footer />
    </div>
  );
};

export default Articles;