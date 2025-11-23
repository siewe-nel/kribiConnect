import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h4 className="text-kribi mb-3">Kribiconnect</h4>
            <p className="small text-secondary">
              La première plateforme de connexion B2B et B2C à Kribi.
              Trouvez services, articles et fournisseurs locaux.
            </p>
          </Col>
          <Col md={4}>
            <h5>Liens Rapides</h5>
            <ul className="list-unstyled text-secondary">
              <li><a href="/articles" className="text-decoration-none text-secondary">Services</a></li>
              <li><a href="/fournisseurs" className="text-decoration-none text-secondary">Fournisseurs</a></li>
              <li><a href="/contact" className="text-decoration-none text-secondary">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p className="small text-secondary">support@kribiconnect.cm</p>
            <p className="small text-secondary">+237 600 00 00 00</p>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <p className="text-center small text-secondary mb-0">© 2023 Kribiconnect. Tous droits réservés.</p>
      </Container>
    </footer>
  );
};

export default Footer;