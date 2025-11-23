import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { BiPencil, BiStar, BiUserCircle, BiMessageDetail } from 'react-icons/bi';

const ProfileHeader = ({ type, name, location, avatar, banner, rating, isOwner, onContact, onEdit }) => {
  return (
    <div className="mb-5">
        {/* Banner */}
        <div 
            style={{ 
                height: '250px', 
                background: banner ? `url(${banner}) center/cover` : 'linear-gradient(to right, #0088cc, #005580)',
                backgroundPosition: 'center',
                borderRadius: '0 0 0 0'
            }} 
        />
        
        <Container className="position-relative" style={{ marginTop: '-60px' }}>
            <Card className="border-0 shadow rounded-lg p-4">
                <Row className="align-items-end">
                    <Col md={2} className="text-center text-md-start">
                        {/* Avatar avec Fallback */}
                        <div className="position-relative d-inline-block">
                            {avatar ? (
                                <img 
                                    src={avatar} 
                                    alt="Profile" 
                                    className="rounded-circle border border-4 border-white shadow bg-white"
                                    width="140" 
                                    height="140" 
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="rounded-circle border border-4 border-white shadow bg-white d-flex align-items-center justify-content-center" style={{width: 140, height: 140}}>
                                    <BiUserCircle size={100} className="text-secondary" />
                                </div>
                            )}
                        </div>
                    </Col>
                    
                    <Col md={6} className="text-center text-md-start mt-3 mt-md-0">
                        <h2 className="fw-bold mb-1">{name}</h2>
                        <p className="text-muted mb-2">{location}</p>
                        
                        {/* CONDITION : ETOILES UNIQUEMENT POUR LES FOURNISSEURS */}
                        {type === 'provider' && (
                            <div className="d-flex align-items-center justify-content-center justify-content-md-start text-warning">
                                <BiStar className="fill-current" />
                                <span className="text-dark fw-bold ms-1">{rating || "N/A"} / 5</span>
                            </div>
                        )}
                    </Col>
                    
                    <Col md={4} className="text-center text-md-end mt-3 mt-md-0">
                        <div className="d-flex justify-content-md-end justify-content-center gap-2">
                            
                            {isOwner ? (
                                // CAS 1 : C'est MON profil -> Bouton Modifier
                                <Button 
                                    variant="outline-primary" 
                                    className="rounded-pill btn-animate"
                                    onClick={onEdit} // <--- Déclenche la modale
                                >
                                    <BiPencil className="me-1" /> Modifier mon profil
                                </Button>
                            ) : (
                                // CAS 2 : Je suis un VISITEUR
                                type === 'provider' && (
                                    <Button 
                                        className="btn-kribi rounded-pill btn-animate px-4"
                                        onClick={onContact}
                                    >
                                        <BiMessageDetail className="me-2" />
                                        Contacter
                                    </Button>
                                )
                            )}
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container>
    </div>
  );
};

export default ProfileHeader;