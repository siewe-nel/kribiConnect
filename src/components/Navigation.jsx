import React from 'react';
import { Navbar, Container, Nav, Image, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiCart, BiLogOut, BiUserCircle } from 'react-icons/bi'; // Import BiUserCircle
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path ? 'nav-link-active' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    return user.role === 'provider' ? `/fournisseur/${user.id}` : '/client';
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
          KribiConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto fw-bold">
             <Nav.Link as={Link} to="/" className={`mx-2 ${isActive('/')}`}>Accueil</Nav.Link>
             <Nav.Link as={Link} to="/articles" className={`mx-2 ${isActive('/articles')}`}>Articles</Nav.Link>
             <Nav.Link as={Link} to="/messagerie" className={`mx-2 ${isActive('/messagerie')}`}>Messagerie</Nav.Link>
             <Nav.Link as={Link} to="/about" className={`mx-2 ${isActive('/about')}`}>À propos</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-4">
            <div className="position-relative cursor-pointer hover-scale">
                <BiCart size={28} className="text-dark" />
                {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                        {cartCount}
                    </span>
                )}
            </div>

            {user ? (
              <div className="d-flex align-items-center">
                <Link to={getProfileLink()} className="text-decoration-none text-dark d-flex align-items-center hover-scale px-2 py-1 rounded me-2">
                    
                    {/* Condition pour l'avatar ou l'icône */}
                    {user.avatar ? (
                        <Image 
                            src={user.avatar} 
                            roundedCircle 
                            width="40"
                            height="40"
                            className="border border-2 border-light me-2"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <BiUserCircle size={40} className="text-secondary me-2" />
                    )}

                    <div className="d-none d-md-block lh-1 text-start">
                        <span className="fw-bold d-block">{user.name}</span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {user.role === 'provider' ? 'Fournisseur' : 'Client'}
                        </small>
                    </div>
                </Link>
                <Button variant="link" className="text-danger p-0 ms-2" onClick={handleLogout} title="Déconnexion">
                    <BiLogOut size={24} />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline-primary" className="rounded-pill px-4">Connexion</Button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;