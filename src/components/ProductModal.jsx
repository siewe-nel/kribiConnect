import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { BiCart, BiMessageDetail, BiX, BiStore } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductModal = ({ show, onHide, product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!product) return null;

  // Sécurisation du nom fournisseur
  const providerName = typeof product.provider === 'object' && product.provider !== null 
    ? product.provider.name 
    : product.provider;

  // Récupération de l'ID fournisseur
  // Le backend envoie 'provider' (objet User) et 'providerId' (int)
  const providerId = product.providerId || (typeof product.provider === 'object' ? product.provider.id : null);

  const handleChat = () => {
    onHide(); // Fermer le modal
    
    // Redirection vers la messagerie avec les infos en "valise" (state)
    navigate('/messagerie', { 
        state: { 
            startChatWith: providerId, // ID du fournisseur
            productContext: product // Infos du produit pour l'aperçu
        } 
    });
  };

  const handleAddToCart = () => {
    addToCart();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" animation={true}>
      <Modal.Header className="border-0 pb-0">
        <div className="ms-auto">
            <Button variant="light" onClick={onHide} className="rounded-circle">
                <BiX size={24}/>
            </Button>
        </div>
      </Modal.Header>
      
      <Modal.Body className="px-4 pb-4">
        <Row>
            <Col md={5} className="mb-3 mb-md-0">
                <img 
                    src={product.image || "https://via.placeholder.com/400"} 
                    alt={product.title} 
                    className="img-fluid rounded shadow-sm w-100 object-fit-cover"
                    style={{ height: '300px' }}
                />
            </Col>

            <Col md={7}>
                <div className="d-flex align-items-center mb-2">
                    <Badge bg="info" className="me-2">{product.category}</Badge>
                    <small className="text-muted d-flex align-items-center">
                        <BiStore className="me-1"/> {providerName}
                    </small>
                </div>
                
                <h3 className="fw-bold mb-3">{product.title}</h3>
                
                <h2 className="text-kribi fw-bold mb-4">{product.price}</h2>
                
                <p className="text-secondary mb-4">
                    {product.description || "Description complète du service ou de l'article ici."}
                </p>

                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" className="btn-kribi btn-animate" onClick={handleAddToCart}>
                        <BiCart className="me-2" /> Ajouter au panier
                    </Button>
                    
                    <Button variant="outline-primary" size="lg" className="btn-animate" onClick={handleChat}>
                        <BiMessageDetail className="me-2" /> Discuter avec le fournisseur
                    </Button>
                </div>
            </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;