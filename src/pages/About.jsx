import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { BiTargetLock, BiGroup, BiWorld } from 'react-icons/bi';

const About = () => {
  return (
    <div className="full-page-container fade-in">
      <Navigation />
      
      <div className="main-content">
        {/* Header Section */}
        <div className="bg-primary text-white py-5 text-center">
          <Container>
            <h1 className="display-4 fw-bold mb-3">Notre Mission</h1>
            <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
              Connecter chaque entreprise, chaque artisan et chaque client de Kribi 
              pour dynamiser l'économie locale à travers une plateforme simple et puissante.
            </p>
          </Container>
        </div>

        {/* Section Valeurs */}
        <Container className="py-5">
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm hover-scale p-4">
                <div className="text-primary mb-3 display-4"><BiTargetLock /></div>
                <Card.Title className="fw-bold">Simplicité</Card.Title>
                <Card.Text className="text-muted">
                  Trouver un fournisseur ou proposer un service n'a jamais été aussi simple. 
                  Tout est centralisé pour vous faire gagner du temps.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm hover-scale p-4">
                <div className="text-primary mb-3 display-4"><BiGroup /></div>
                <Card.Title className="fw-bold">Communauté</Card.Title>
                <Card.Text className="text-muted">
                  Nous croyons en la force du réseau local. KribiConnect renforce les liens 
                  entre les acteurs économiques de la cité balnéaire.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm hover-scale p-4">
                <div className="text-primary mb-3 display-4"><BiWorld /></div>
                <Card.Title className="fw-bold">Innovation</Card.Title>
                <Card.Text className="text-muted">
                  Des outils numériques modernes (messagerie temps réel, géolocalisation) 
                  mis au service du commerce traditionnel.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Section Image + Texte */}
        <div className="bg-white py-5">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            alt="Team working" 
                            className="img-fluid rounded shadow-lg hover-scale"
                        />
                    </Col>
                    <Col md={6} className="mt-4 mt-md-0">
                        <h2 className="fw-bold mb-4 text-dark">L'histoire de KribiConnect</h2>
                        <p className="text-secondary">
                            Née du constat que de nombreux talents à Kribi manquaient de visibilité, 
                            notre plateforme a été conçue pour offrir une vitrine digitale accessible à tous.
                        </p>
                        <p className="text-secondary">
                            Que vous soyez une grande entreprise logistique ou un vendeur de poisson frais au port, 
                            KribiConnect est votre partenaire de croissance.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;