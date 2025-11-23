import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { BiMap, BiShow, BiStar } from 'react-icons/bi';

const ServiceCard = ({ data, onClick }) => {
  // Le backend renvoie maintenant 'images' (array) et 'averageRating'
  const { title, price, provider, images, category, views, averageRating } = data;
  
  // Image principale : soit la première de la liste images, soit 'image' (fallback), soit placeholder
  const mainImage = (images && images.length > 0) ? images[0] : (data.image || "https://via.placeholder.com/300x200");
  
  const providerName = typeof provider === 'object' ? provider.name : provider;

  return (
    <Card className="h-100 border-0 shadow-sm hover-scale transition-all cursor-pointer" onClick={() => onClick(data)}>
      <div className="position-relative">
        <Card.Img variant="top" src={mainImage} className="object-fit-cover" height="200" />
        <Badge bg="light" text="dark" className="position-absolute top-0 end-0 m-2 shadow-sm">{category}</Badge>
      </div>
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
            <div className="d-flex justify-content-between align-items-start">
                <Card.Title className="fs-6 fw-bold mb-1 text-truncate" style={{maxWidth: '75%'}}>{title}</Card.Title>
                {/* Affichage Note */}
                {averageRating && (
                    <div className="d-flex align-items-center text-warning small">
                        <BiStar className="fill-current" />
                        <span className="ms-1 fw-bold text-dark">{averageRating}</span>
                    </div>
                )}
            </div>
            <Card.Text className="text-muted small mb-2 text-truncate">
                <BiMap className="me-1" /> {providerName}
            </Card.Text>
        </div>
        <div className="mt-3 d-flex justify-content-between align-items-end">
            <h5 className="text-kribi fw-bold mb-0">{price}</h5>
            <small className="text-muted"><BiShow className="me-1"/> {views || 0}</small>
        </div>
      </Card.Body>
    </Card>
  );
};
export default ServiceCard;