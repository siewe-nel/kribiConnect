import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Icônes SVG intégrées pour éviter les erreurs de dépendances
const IconCart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconMessage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconStore = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconEye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

const ProductModal = ({ show, onHide, product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  // 1. Correction de l'image : Gestion des chemins relatifs du backend
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400?text=KribiConnect";
    if (img.startsWith('http')) return img;
    // Si c'est un chemin relatif type "/uploads/...", on ajoute l'URL du backend
    return `https://kribi-connect-backend.vercel.app${img.startsWith('/') ? '' : '/'}${img}`;
  };

  // Sécurisation du nom fournisseur
  const providerName = typeof product.provider === 'object' && product.provider !== null 
    ? product.provider.name 
    : (product.providerName || "Prestataire Kribi");

  // Récupération de l'ID fournisseur
  const providerId = product.providerId || (typeof product.provider === 'object' ? product.provider.id : null);

  const handleChat = () => {
    onHide();
    navigate('/messagerie', { 
        state: { 
            startChatWith: providerId, 
            productContext: product 
        } 
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header className="border-0 pb-0">
        <div className="ms-auto">
            <Button variant="light" onClick={onHide} className="rounded-circle p-2">
                <IconClose />
            </Button>
        </div>
      </Modal.Header>
      
      <Modal.Body className="px-4 pb-4">
        <Row>
            <Col md={5} className="mb-3 mb-md-0 text-center">
                <img 
                    src={getImageUrl(product.image || product.imageUrl)} 
                    alt={product.title} 
                    className="img-fluid rounded shadow-sm w-100 object-fit-cover"
                    style={{ height: '320px', backgroundColor: '#f8f9fa' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Image+non+disponible"; }}
                />
            </Col>

            <Col md={7}>
                <div className="d-flex flex-wrap align-items-center mb-2 gap-2">
                    <Badge bg="info">{product.category}</Badge>
                    <small className="text-muted d-flex align-items-center">
                        <IconStore /> <span className="ms-1">{providerName}</span>
                    </small>
                    {/* 2. Affichage du nombre de vues */}
                    <small className="text-muted d-flex align-items-center ms-auto">
                        <IconEye /> {product.views || 0} vues
                    </small>
                </div>
                
                <h3 className="fw-bold mb-2">{product.title}</h3>
                
                <h2 className="text-primary fw-bold mb-3">
                    {typeof product.price === 'number' ? `${product.price.toLocaleString()} FCFA` : product.price}
                </h2>
                
                <div className="mb-4">
                    <h6 className="fw-bold text-dark small text-uppercase">Description</h6>
                    <p className="text-secondary">
                        {product.description || "Aucune description détaillée n'a été fournie pour ce service."}
                    </p>
                </div>

                <div className="d-grid gap-2">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="fw-bold d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: '#0056b3', border: 'none' }}
                        onClick={() => { console.log("Ajout au panier", product.id); onHide(); }}
                    >
                        <span className="me-2"><IconCart /></span> Ajouter au panier
                    </Button>
                    
                    <Button 
                        variant="outline-primary" 
                        size="lg" 
                        className="fw-bold d-flex align-items-center justify-content-center"
                        onClick={handleChat}
                    >
                        <span className="me-2"><IconMessage /></span> Contacter le vendeur
                    </Button>
                </div>
            </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;