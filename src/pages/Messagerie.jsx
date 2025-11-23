import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import ContactList from '../components/messaging/ContactList';
import ChatWindow from '../components/messaging/ChatWindow';
import { useAuth } from '../context/AuthContext';

// Son de notification (URL stable)
const SEND_SOUND_URL = 'https://cdn.freesound.org/previews/566/566436_11306636-lq.mp3'; 

const Messagerie = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // États de la messagerie
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [partnerOnline, setPartnerOnline] = useState(false);

  // États pour le contexte "Nouveau message depuis un produit"
  const [productContext, setProductContext] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');

  const audioRef = useRef(new Audio(SEND_SOUND_URL));

  // --- 1. CHARGEMENT DES CONTACTS ---
  const fetchContacts = async () => {
      if (!user) return;
      try {
          const res = await axios.get(`http://localhost:5000/api/messages/conversations/${user.id}`);
          setContacts(res.data);
      } catch (err) {
          console.error("Erreur chargement contacts", err);
      }
  };

  useEffect(() => {
      fetchContacts();
      const interval = setInterval(fetchContacts, 10000); // Rafraichir la liste toutes les 10s
      return () => clearInterval(interval);
  }, [user]);

  // --- 2. GESTION ARRIVÉE DEPUIS PAGE PRODUIT ---
  useEffect(() => {
    const initChatFromProduct = async () => {
      if (location.state && location.state.startChatWith && user) {
        const targetId = parseInt(location.state.startChatWith);
        const product = location.state.productContext;

        // Vérifie si le contact existe déjà
        const existingContact = contacts.find(c => c.id === targetId);

        if (existingContact) {
            setActiveContactId(targetId);
        } else {
            // Sinon on charge ses infos pour l'ajouter temporairement à la liste
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/user/${targetId}`);
                const newUser = res.data;
                const newContact = {
                    id: newUser.id,
                    name: newUser.name,
                    avatar: newUser.avatar,
                    lastMessage: "Nouvelle conversation",
                    isOnline: false // Sera mis à jour au fetchMessages
                };
                setContacts(prev => [newContact, ...prev]);
                setActiveContactId(targetId);
            } catch (err) {
                console.error("Impossible de charger le contact cible", err);
            }
        }

        if (product) {
            setProductContext(product);
            setInitialMessage(`Bonjour, je suis intéressé par votre article "${product.title}". Est-il toujours disponible ?`);
        }
        
        // Nettoyer l'historique pour éviter de re-déclencher au refresh
        window.history.replaceState({}, document.title);
      }
    };

    if (user) {
        initChatFromProduct();
    }
  }, [location.state, user, contacts.length]); // contacts.length permet de re-vérifier si contacts change

  // --- 3. CHARGEMENT DES MESSAGES D'UNE CONVERSATION ---
  const fetchMessages = async (contactId, isPolling = false) => {
    if(messages.length === 0 && !isPolling) setLoadingMessages(true);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${user.id}/${contactId}`);
      
      // Gestion du format de réponse { messages: [], partnerOnline: bool }
      const data = response.data.messages || response.data;
      const isOnline = response.data.partnerOnline || false;
      
      setPartnerOnline(isOnline);

      const formattedMessages = Array.isArray(data) ? data.map(msg => ({
        id: msg.id,
        text: msg.content,
        isMe: msg.senderId === user.id,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productContext: msg.productContext // Récupération du contexte sauvegardé
      })) : [];
      
      setMessages(prev => {
        // Mise à jour uniquement si changement pour éviter clignotement
        if (JSON.stringify(prev) !== JSON.stringify(formattedMessages)) return formattedMessages;
        return prev;
      });

    } catch (error) {
      console.error("Erreur messagerie", error);
    } finally {
      if(!isPolling) setLoadingMessages(false);
    }
  };

  // Polling des messages actifs
  useEffect(() => {
    if (activeContactId && user) {
      fetchMessages(activeContactId);
      const interval = setInterval(() => fetchMessages(activeContactId, true), 3000); // Toutes les 3s
      return () => clearInterval(interval);
    }
  }, [activeContactId, user]);

  // --- 4. ACTIONS (ENVOI, UPLOAD) ---
  const playSound = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => {});
  };

  const handleSendMessage = async (text) => {
    if (!activeContactId || !user) return;
    try {
        const payload = {
            senderId: user.id,
            receiverId: activeContactId,
            content: text,
            // On joint le contexte produit s'il existe (transformé en JSON string)
            productContext: productContext ? JSON.stringify(productContext) : null
        };

        const response = await axios.post('http://localhost:5000/api/messages', payload);
        playSound();
        
        // Mise à jour Optimiste (on ajoute tout de suite)
        const newMessage = {
            id: response.data.id, // ID réel retourné par le back
            text: response.data.content,
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            productContext: productContext // On l'affiche localement aussi
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Nettoyage après envoi réussi
        setProductContext(null);
        setInitialMessage('');
        fetchContacts(); // Mettre à jour la liste à gauche

    } catch (error) {
        console.error("Erreur envoi", error);
    }
  };

  const handleUploadFile = async (file) => {
    if (!activeContactId || !user) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', user.id);
    formData.append('receiverId', activeContactId);
    formData.append('content', 'Fichier envoyé'); 

    try {
        const response = await axios.post('http://localhost:5000/api/messages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        playSound();
        
        const newMessage = {
            id: response.data.id,
            text: response.data.content, // "FILE:nomfichier.ext"
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
        fetchContacts();

    } catch (error) {
        console.error("Erreur upload", error);
    }
  };

  // Navigation
  const handleContactSelect = (id) => {
      setActiveContactId(id);
      // Si on change de contact, on perd le contexte produit "en attente"
      setProductContext(null); 
      setInitialMessage('');
  };

  const handleBackToList = () => {
      setActiveContactId(null); // Retour liste sur mobile
  };

  return (
    <div className="d-flex flex-column vh-100 bg-white fade-in">
      <Navigation />
      
      <div className="flex-grow-1 container-fluid p-0 overflow-hidden">
        <div className="row h-100 g-0">
            {/* LISTE DES CONTACTS (Cachée sur mobile si chat ouvert) */}
            <div className={`col-md-4 col-lg-3 border-end h-100 overflow-hidden flex-column bg-white ${activeContactId ? 'd-none d-md-flex' : 'd-flex'}`}>
                <ContactList 
                    contacts={contacts} 
                    activeId={activeContactId} 
                    onSelect={handleContactSelect} 
                />
            </div>

            {/* FENÊTRE DE CHAT (Cachée sur mobile si aucun chat) */}
            <div className={`col-md-8 col-lg-9 h-100 flex-column bg-secondary-bg ${activeContactId ? 'd-flex' : 'd-none d-md-flex'}`}>
                {activeContactId ? (
                    loadingMessages && messages.length === 0 ? (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            <Spinner animation="border" variant="primary"/>
                        </div>
                    ) : (
                        <ChatWindow 
                            activeContact={contacts.find(c => c.id === activeContactId)} 
                            messages={messages} 
                            onSend={handleSendMessage}   
                            onUpload={handleUploadFile}
                            pendingProductContext={productContext} // Aperçu avant envoi
                            initialMessage={initialMessage}
                            partnerOnline={partnerOnline}
                            onBack={handleBackToList}
                        />
                    )
                ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center text-muted flex-column">
                        <p className="fs-5">Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Messagerie;