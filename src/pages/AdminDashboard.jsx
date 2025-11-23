import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table, Badge, Button, Modal, Form, Spinner, Row, Col, Alert, Card } from 'react-bootstrap';
import { BiUser, BiPackage, BiStore, BiShieldQuarter, BiPlus, BiLogOut, BiTrash, BiPencil, BiBarChartAlt2 } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';

// --- 1. COMPOSANT SIDEBAR ---
const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path) ? 'bg-danger text-white' : 'text-white-50 hover-white';

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white shadow" style={{ width: '260px', minHeight: '100vh', position: 'fixed' }}>
            <div className="d-flex align-items-center mb-4 px-2">
                <BiShieldQuarter className="me-2 text-danger" size={28} />
                <span className="fs-4 fw-bold">AdminPanel</span>
            </div>
            <hr className="border-secondary mt-0"/>
            
            <ul className="nav nav-pills flex-column mb-auto gap-2">
                <li className="nav-item">
                    <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard')}`}>
                        <BiBarChartAlt2 className="me-2" /> Vue d'ensemble
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/clients" className={`nav-link ${isActive('/admin/clients')}`}>
                        <BiUser className="me-2" /> Gestion Clients
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/providers" className={`nav-link ${isActive('/admin/providers')}`}>
                        <BiStore className="me-2" /> Gestion Fournisseurs
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/admin/admins" className={`nav-link ${isActive('/admin/admins')}`}>
                        <BiShieldQuarter className="me-2" /> Gestion Admins
                    </Link>
                </li>
            </ul>
            
            <hr className="border-secondary"/>
            <Button variant="outline-light" onClick={() => { logout(); navigate('/admin/login'); }} className="w-100">
                <BiLogOut className="me-2" /> Déconnexion
            </Button>
        </div>
    );
};

// --- 2. COMPOSANT STATS CARD ---
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

// --- 3. GESTIONNAIRE D'UTILISATEURS GÉNÉRIQUE (Tableau CRUD) ---
const UserManager = ({ role, title, icon }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: role });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://kribi-connect-backend.vercel.app/api/admin/users/${role}`);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFormData(prev => ({ ...prev, role: role })); // Reset role when prop changes
        fetchUsers();
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`https://kribi-connect-backend.vercel.app/api/admin/users/${editId}`, formData);
                alert("Modifié avec succès");
            } else {
                await axios.post('https://kribi-connect-backend.vercel.app/api/admin/users', formData);
                alert("Créé avec succès");
            }
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: role });
            setIsEditing(false);
            fetchUsers();
        } catch (error) {
            alert("Erreur lors de l'opération");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Supprimer cet utilisateur définitivement ?")) {
            try {
                await axios.delete(`https://kribi-connect-backend.vercel.app/api/admin/users/${id}`);
                fetchUsers();
            } catch (err) { alert("Erreur suppression"); }
        }
    };

    const openEdit = (user) => {
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setEditId(user.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const openCreate = () => {
        setFormData({ name: '', email: '', password: '', role: role });
        setIsEditing(false);
        setShowModal(true);
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark d-flex align-items-center">
                    {icon} <span className="ms-2">Gestion des {title}</span>
                </h3>
                <Button variant="primary" className="btn-kribi" onClick={openCreate}>
                    <BiPlus className="me-1"/> Nouveau {title}
                </Button>
            </div>

            {/* Stats Rapides pour cette section */}
            <Row className="mb-4">
                <Col md={4}>
                    <div className="bg-white p-3 rounded shadow-sm border-start border-primary border-4">
                        <small className="text-muted">Total {title}</small>
                        <h3 className="fw-bold mb-0">{users.length}</h3>
                    </div>
                </Col>
            </Row>

            <div className="bg-white rounded shadow-sm p-4">
                {loading ? <div className="text-center p-5"><Spinner animation="border" /></div> : (
                    <Table hover responsive>
                        <thead className="bg-light">
                            <tr>
                                <th>Avatar</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Date Inscription</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td><img src={u.avatar} className="rounded-circle" width="35" height="35" alt=""/></td>
                                    <td className="fw-bold">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="text-end">
                                        <Button variant="light" size="sm" className="me-2 text-primary" onClick={() => openEdit(u)}><BiPencil/></Button>
                                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(u.id)}><BiTrash/></Button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan="5" className="text-center py-4">Aucun utilisateur trouvé</td></tr>}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* MODAL CREATE / EDIT */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} un {title}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom complet</Form.Label>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Rôle</Form.Label>
                            <Form.Select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} disabled>
                                <option value="client">Client</option>
                                <option value="provider">Fournisseur</option>
                                <option value="admin">Administrateur</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary" type="submit" className="btn-kribi">{isEditing ? 'Sauvegarder' : 'Créer'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

// --- 4. DASHBOARD GLOBAL (VUE D'ENSEMBLE) ---
const DashboardStats = () => {
    const [stats, setStats] = useState({ totalUsers: 0, services: 0, providers: 0, admins: 0, clients: 0 });
    
    useEffect(() => {
        axios.get('https://kribi-connect-backend.vercel.app/api/admin/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="fade-in">
            <h3 className="fw-bold mb-4">Vue d'ensemble Statistiques</h3>
            <Row className="g-4 mb-4">
                <Col md={3}>
                    <StatCard title="Clients" count={stats.clients} icon={<BiUser size={24}/>} color="primary" />
                </Col>
                <Col md={3}>
                    <StatCard title="Fournisseurs" count={stats.providers} icon={<BiStore size={24}/>} color="warning" />
                </Col>
                <Col md={3}>
                    <StatCard title="Services Publiés" count={stats.services} icon={<BiPackage size={24}/>} color="success" />
                </Col>
                <Col md={3}>
                    <StatCard title="Administrateurs" count={stats.admins} icon={<BiShieldQuarter size={24}/>} color="danger" />
                </Col>
            </Row>

            {/* GRAPHIQUES OU AUTRES WIDGETS ICI */}
            <div className="bg-white p-5 rounded shadow-sm text-center">
                <h5 className="text-muted">Graphiques d'évolution (À venir)</h5>
                <p>Ici s'afficheront les courbes de croissance des inscriptions et des ventes.</p>
            </div>
        </div>
    );
};

// --- 5. LAYOUT PRINCIPAL ---
const AdminDashboard = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-5" style={{ marginLeft: '260px' }}>
            <Routes>
                <Route path="dashboard" element={<DashboardStats />} />
                <Route path="clients" element={<UserManager role="client" title="Client" icon={<BiUser size={28}/>} />} />
                <Route path="providers" element={<UserManager role="provider" title="Fournisseur" icon={<BiStore size={28}/>} />} />
                <Route path="admins" element={<UserManager role="admin" title="Administrateur" icon={<BiShieldQuarter size={28}/>} />} />
                
                {/* Redirection par défaut */}
                <Route path="*" element={<DashboardStats />} />
            </Routes>
        </div>
    </div>
  );
};

export default AdminDashboard;