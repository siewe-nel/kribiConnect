import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { BiUserCircle, BiMessageDetail, BiStar, BiMap } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const ProviderCard = ({ data }) => {
  const navigate = useNavigate();
  const { id, name, avatar, averageRating, reviewCount, email } = data;

  const handleContact = (e) => {
    e.stopPropagation();
    // Redirection vers la messagerie avec l'ID du fournisseur pour démarrer le chat
    navigate('/messagerie', { state: { startChatWith: id } });
  };

  const handleViewProfile = () => {
    navigate(`/fournisseur/${id}`);
  };

  return (
    <Card className="h-100 border-0 shadow-sm hover-scale transition-all text-center p-3" onClick={handleViewProfile} style={{cursor: 'pointer'}}>
      <div className="mx-auto mt-3 mb-3 position-relative">
        {avatar ? (
            <img 
                src={avatar} 
                alt={name} 
                className="rounded-circle border border-4 border-light shadow-sm object-fit-cover"
                width="100" height="100"
            />
        ) : (
            <BiUserCircle size={100} className="text-secondary" />
        )}
        {averageRating && (
            <div className="position-absolute bottom-0 end-0 bg-white px-2 py-1 rounded-pill shadow-sm border d-flex align-items-center text-warning small">
                <BiStar className="fill-current"/> 
                <span className="text-dark fw-bold ms-1">{averageRating}</span>
            </div>
        )}
      </div>
      
      <Card.Body className="p-0">
        <h5 className="fw-bold text-dark mb-1">{name}</h5>
        <p className="text-muted small mb-3"><BiMap className="me-1"/>Kribi, Cameroun</p>
        
        <div className="d-grid gap-2">
            <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={handleContact}>
                <BiMessageDetail className="me-1" /> Discuter
            </Button>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0 pt-3 pb-0 text-muted small">
        {reviewCount > 0 ? `${reviewCount} avis clients` : "Nouveau fournisseur"}
      </Card.Footer>
    </Card>
  );
};

export default ProviderCard;