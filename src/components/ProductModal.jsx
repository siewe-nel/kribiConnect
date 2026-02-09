import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Icônes SVG intégrées pour la stabilité
const IconCart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const IconMessage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconStore = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconEye = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

const SVG_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23dee2e6">Image non disponible</text></svg>`;

const ProductModal = ({ show, onHide, product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  // Extraction identique à ServiceCard
  const { title, price, provider, images, category, views, averageRating, description, providerId } = product;

  // Logique d'image identique à ServiceCard
  const mainImage = (images && images.length > 0) ? images[0] : (product.image || SVG_PLACEHOLDER);

  const getImageUrl = (img) => {
    if (!img || img === SVG_PLACEHOLDER) return SVG_PLACEHOLDER;
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    return `https://kribi-connect-backend.vercel.app${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const providerName = typeof provider === 'object' ? provider.name : (product.providerName || "Prestataire Kribi");
  const finalProviderId = providerId || (typeof provider === 'object' ? provider.id : null);

  const handleChat = () => {
    onHide();
    navigate('/messagerie', { 
        state: { 
            startChatWith: finalProviderId, 
            productContext: product 
        } 
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="product-modal">
      <Modal.Header className="border-0 pb-0">
        <div className="ms-auto">
            <Button variant="light" onClick={onHide} className="rounded-circle p-2 shadow-sm">
                <IconClose />
            </Button>
        </div>
      </Modal.Header>
      
      <Modal.Body className="px-4 pb-4">
        <Row>
            <Col md={5} className="mb-3 mb-md-0 text-center">
                <img 
                    src={getImageUrl(mainImage)} 
                    alt={title} 
                    className="img-fluid rounded shadow-sm w-100 object-fit-cover"
                    style={{ height: '350px', backgroundColor: '#f8f9fa' }}
                    onError={(e) => { e.target.src = SVG_PLACEHOLDER; }}
                />
            </Col>

            <Col md={7}>
                <div className="d-flex flex-wrap align-items-center mb-2 gap-2">
                    <Badge bg="primary" className="px-3 py-2">{category || 'Service'}</Badge>
                    {averageRating && (
                        <div className="d-flex align-items-center bg-light px-2 py-1 rounded border">
                            <IconStar />
                            <span className="ms-1 fw-bold small">{averageRating}</span>
                        </div>
                    )}
                    <small className="text-muted d-flex align-items-center ms-auto">
                        <IconEye /> {views || 0} vues
                    </small>
                </div>
                
                <h2 className="fw-bold mb-2 text-dark">{title}</h2>
                
                <div className="d-flex align-items-center mb-3 text-muted">
                    <IconStore /> 
                    <span className="ms-2 fw-medium">{providerName}</span>
                </div>
                
                <h3 className="text-primary fw-bold mb-4" style={{ fontSize: '1.8rem' }}>
                    {price}
                </h3>
                
                <div className="mb-4 p-3 bg-light rounded">
                    <h6 className="fw-bold text-dark small text-uppercase mb-2">À propos de ce service</h6>
                    <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                        {description || "Aucune description détaillée n'est disponible pour le moment."}
                    </p>
                </div>

                <div className="d-grid gap-3">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="fw-bold py-3 shadow-sm border-0"
                        style={{ backgroundColor: '#0056b3' }}
                        onClick={() => onHide()}
                    >
                        <span className="me-2"><IconCart /></span> Ajouter au panier
                    </Button>
                    
                    <Button 
                        variant="outline-dark" 
                        size="lg" 
                        className="fw-bold py-3"
                        onClick={handleChat}
                    >
                        <span className="me-2"><IconMessage /></span> Envoyer un message
                    </Button>
                </div>
            </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;