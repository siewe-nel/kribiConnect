import React from 'react';
import { Nav } from 'react-bootstrap';
import { BiGridAlt, BiUser, BiPackage, BiStore, BiCog } from 'react-icons/bi';

const AdminSidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end" style={{ width: '280px', minHeight: '100vh' }}>
      <a href="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span className="fs-4 fw-bold text-kribi">AdminPanel</span>
      </a>
      <hr />
      <Nav className="flex-column mb-auto">
        <Nav.Item>
          <Nav.Link href="/admin" className="nav-link link-dark active bg-light mb-2">
            <BiGridAlt className="bi me-2" /> Tableau de bord
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/admin/users" className="nav-link link-secondary mb-2">
            <BiUser className="bi me-2" /> Utilisateurs
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/admin/articles" className="nav-link link-secondary mb-2">
            <BiPackage className="bi me-2" /> Articles
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/admin/providers" className="nav-link link-secondary mb-2">
            <BiStore className="bi me-2" /> Fournisseurs
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center link-dark text-decoration-none">
            <BiCog className="me-2" /> Paramètres
        </a>
      </div>
    </div>
  );
};

export default AdminSidebar;