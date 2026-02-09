import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table, Badge, Button, Modal, Form, Spinner, Row, Col, Card } from 'react-bootstrap';

/**
 * Composants d'icônes SVG personnalisés pour remplacer react-icons/bi
 * évite les erreurs de résolution de modules.
 */
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconPackage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.28"></line><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line><path d="M12 22.08l-7.5-4.33a2 2 0 0 1-1-1.73V7.4a2 2 0 0 1 1-1.73L12 1.34l7.5 4.33a2 2 0 0 1 1 1.73v8.62a2 2 0 0 1-1 1.73L12 22.08z"></path></svg>;
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconLogOut = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconPencil = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const IconChart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;

// --- CONFIGURATION HEADERS ---
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// --- 1. COMPOSANT SIDEBAR ---
const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path) ? 'bg-danger text-white' : 'text-white-50 hover-white';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white shadow" style={{ width: '260px', minHeight: '100vh', position: 'fixed' }}>
            <div className="d-flex align-items-center mb-4 px-2">
                <div className="text-danger me-2"><IconShield /></div>
                <span className="fs-4 fw-bold">AdminPanel</span>
            </div>
            <hr className="border-secondary mt-0"/>
            
            <ul className="nav nav-pills flex-column mb-auto gap-2">
                <li className="nav-item">
                    <Link to="/admin/dashboard" className={`nav-link d-flex align-items-center ${isActive('/admin/dashboard')}`}>
                        <span className="me-2"><IconChart /></span> Vue d'ensemble
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/clients" className={`nav-link d-flex align-items-center ${isActive('/admin/clients')}`}>
                        <span className="me-2"><IconUser /></span> Gestion Clients
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/providers" className={`nav-link d-flex align-items-center ${isActive('/admin/providers')}`}>
                        <span className="me-2"><IconStore /></span> Gestion Fournisseurs
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/admins" className={`nav-link d-flex align-items-center ${isActive('/admin/admins')}`}>
                        <span className="me-2"><IconShield /></span> Gestion Admins
                    </Link>
                </li>
            </ul>
            
            <hr className="border-secondary"/>
            <Button variant="outline-light" onClick={handleLogout} className="w-100 d-flex align-items-center justify-content-center">
                <span className="me-2"><IconLogOut /></span> Déconnexion
            </Button>
        </div>
    );
};

// --- 2. STATS CARD ---
const StatCard = ({ title, count, icon, color }) => (
    <Card className={`border-0 shadow-sm border-start border-4 border-${color} h-100`}>
        <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
                <p className="text-muted text-uppercase small mb-1 fw-bold">{title}</p>
                <h2 className="fw-bold mb-0 text-dark">{count}</h2>
            </div>
            <div className={`p-3 rounded-circle bg-${color} bg-opacity-10 text-${color}`}>
                {icon}
            </div>
        </Card.Body>
    </Card>
);

// --- 3. USER MANAGER ---
const UserManager = ({ role, title, icon }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: role });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://kribi-connect-backend.vercel.app/api/admin/users/${role}`, getAuthHeader());
            setUsers(res.data);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: role }));
        fetchUsers();
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`https://kribi-connect-backend.vercel.app/api/admin/users/${editId}`, formData, getAuthHeader());
            } else {
                await axios.post('https://kribi-connect-backend.vercel.app/api/admin/users', formData, getAuthHeader());
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            alert("Erreur: Session expirée ou droits insuffisants");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Supprimer cet utilisateur définitivement ?")) {
            try {
                await axios.delete(`https://kribi-connect-backend.vercel.app/api/admin/users/${id}`, getAuthHeader());
                fetchUsers();
            } catch (err) { alert("Erreur suppression"); }
        }
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark d-flex align-items-center">
                    <span className="me-2 text-primary">{icon}</span> Gestion des {title}
                </h3>
                <Button variant="primary" onClick={() => { setFormData({name:'', email:'', password:'', role:role}); setIsEditing(false); setShowModal(true); }}>
                    <IconPlus /> Nouveau {title}
                </Button>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
                {loading ? <div className="text-center p-5"><Spinner animation="border" /></div> : (
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td><img src={u.avatar || 'https://via.placeholder.com/35'} className="rounded-circle" width="35" height="35" alt=""/></td>
                                    <td className="fw-bold">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td className="text-end">
                                        <Button variant="light" size="sm" className="me-2" onClick={() => { setFormData({name: u.name, email: u.email, role: u.role}); setEditId(u.id); setIsEditing(true); setShowModal(true); }}><IconPencil/></Button>
                                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(u.id)}><IconTrash/></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton> {isEditing ? 'Modifier' : 'Ajouter'} {title} </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </Form.Group>
                        {!isEditing && (
                            <Form.Group className="mb-3">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary" type="submit">{isEditing ? 'Sauvegarder' : 'Créer'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

// --- 4. DASHBOARD STATS ---
const DashboardStats = () => {
    const [stats, setStats] = useState({ totalUsers: 0, services: 0, providers: 0, admins: 0, clients: 0 });
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('https://kribi-connect-backend.vercel.app/api/admin/stats', getAuthHeader())
            .then(res => setStats(res.data))
            .catch(err => {
                if (err.response?.status === 401) navigate('/admin/login');
            });
    }, []);

    return (
        <div className="fade-in">
            <h3 className="fw-bold mb-4">Vue d'ensemble Statistiques</h3>
            <Row className="g-4">
                <Col md={3}><StatCard title="Clients" count={stats.clients} icon={<IconUser />} color="primary" /></Col>
                <Col md={3}><StatCard title="Fournisseurs" count={stats.providers} icon={<IconStore />} color="warning" /></Col>
                <Col md={3}><StatCard title="Services" count={stats.services} icon={<IconPackage />} color="success" /></Col>
                <Col md={3}><StatCard title="Admins" count={stats.admins} icon={<IconShield />} color="danger" /></Col>
            </Row>
        </div>
    );
};

// --- 5. LAYOUT PRINCIPAL ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userStr) {
      navigate('/admin/login');
    } else {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        navigate('/admin/login');
      }
    }
    setChecking(false);
  }, [navigate]);

  if (checking) return null;

  return (
    <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-5" style={{ marginLeft: '260px' }}>
            <Routes>
                <Route path="dashboard" element={<DashboardStats />} />
                <Route path="clients" element={<UserManager role="client" title="Client" icon={<IconUser />} />} />
                <Route path="providers" element={<UserManager role="provider" title="Fournisseur" icon={<IconStore />} />} />
                <Route path="admins" element={<UserManager role="admin" title="Administrateur" icon={<IconShield />} />} />
                <Route path="*" element={<DashboardStats />} />
            </Routes>
        </div>
    </div>
  );
};

export default AdminDashboard;