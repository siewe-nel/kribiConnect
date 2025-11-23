import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { BiSend, BiPaperclip, BiPhone, BiVideo, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom'; // <--- 1. IMPORT

const ChatWindow = ({ activeContact, messages, onSend, onUpload, pendingProductContext, initialMessage, partnerOnline, onBack }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // <--- 2. HOOK

  // Pré-remplir le message si nécessaire
  useEffect(() => {
    if (initialMessage) setText(initialMessage);
  }, [initialMessage]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingProductContext]);

  if (!activeContact) return null;

  // --- 3. FONCTION DE NAVIGATION VERS LE PROFIL ---
  const handleProfileClick = () => {
    if (activeContact && activeContact.id) {
        // On redirige vers la page profil (qui gère l'affichage dynamique)
        navigate(`/fournisseur/${activeContact.id}`);
    }
  };

  // --- HANDLERS ---
  const handleSendClick = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSendClick();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
      e.target.value = null; 
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();
  const startCall = (type) => alert(`Appel ${type} lancé vers ${activeContact.name} (Fonctionnalité simulée)`);
  
  const isImageFile = (filename) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  return (
    <div className="d-flex flex-column h-100 bg-white">
      {/* --- HEADER --- */}
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white shadow-sm" style={{zIndex: 10}}>
        <div className="d-flex align-items-center">
          {/* Bouton Retour (Mobile uniquement) */}
          <Button variant="link" className="text-dark p-0 me-3 d-md-none" onClick={onBack}>
            <BiArrowBack size={24} />
          </Button>

          {/* --- ZONE CLIQUABLE POUR LE PROFIL --- */}
          <div 
            className="d-flex align-items-center" 
            onClick={handleProfileClick} 
            style={{ cursor: 'pointer' }}
            title="Voir le profil"
          >
            <img 
                src={activeContact.avatar || `https://ui-avatars.com/api/?name=${activeContact.name}`} 
                width="45" height="45" 
                className="rounded-circle me-3 border" 
                alt="" 
            />
            <div>
                <h6 className="mb-0 fw-bold text-dark hover-primary">{activeContact.name}</h6>
                {/* Statut En Ligne Dynamique */}
                {partnerOnline && (
                    <small className="text-success d-flex align-items-center">
                        <span className="bg-success rounded-circle d-inline-block me-1" style={{width: 8, height: 8}}></span> 
                        En ligne
                    </small>
                )}
            </div>
          </div>
        </div>

        <div className="text-muted">
          <Button variant="light" className="rounded-circle me-2" onClick={() => startCall('audio')}><BiPhone size={20}/></Button>
          <Button variant="light" className="rounded-circle" onClick={() => startCall('video')}><BiVideo size={20}/></Button>
        </div>
      </div>

      {/* --- ZONE MESSAGES --- */}
      <div className="flex-grow-1 p-4 overflow-auto bg-light" style={{backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        {messages.map((msg) => {
             const isFile = msg.text && msg.text.startsWith('FILE:');
             const fileName = isFile ? msg.text.replace('FILE:', '') : '';
             const fileUrl = isFile ? `https://kribi-connect-backend.vercel.app/uploads/${fileName}` : '';

            return (
                <div key={msg.id} className={`d-flex mb-3 ${msg.isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                    {/* Avatar cliquable aussi dans le chat */}
                    {!msg.isMe && (
                        <img 
                            src={activeContact.avatar || `https://ui-avatars.com/api/?name=${activeContact.name}`} 
                            width="35" height="35" 
                            className="rounded-circle me-2 mt-1 shadow-sm" 
                            alt="" 
                            onClick={handleProfileClick}
                            style={{cursor: 'pointer'}}
                        />
                    )}
                    
                    <div className="d-flex flex-column align-items-start" style={{maxWidth: '75%'}}>
                        <div className={`p-3 shadow-sm ${msg.isMe ? 'chat-bubble-sender' : 'chat-bubble-receiver'}`}>
                            
                            {/* --- APERÇU PRODUIT (DANS LA BULLE) --- */}
                            {msg.productContext && (
                                <Card className="mb-2 border-0 bg-white text-dark overflow-hidden" style={{maxWidth: '250px'}}>
                                    <div className="d-flex align-items-center p-2">
                                        <img 
                                            src={msg.productContext.image || "https://via.placeholder.com/50"} 
                                            width="40" height="40" 
                                            className="rounded me-2 object-fit-cover" 
                                            alt=""
                                        />
                                        <div className="lh-1 overflow-hidden">
                                            <small className="fw-bold d-block text-truncate">{msg.productContext.title}</small>
                                            <small className="text-primary fw-bold">{msg.productContext.price}</small>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* CONTENU TEXTE OU FICHIER */}
                            {isFile ? (
                                <div>
                                    {isImageFile(fileName) ? (
                                        <div className="mb-2">
                                            <a href={fileUrl} target="_blank" rel="noreferrer">
                                                <img src={fileUrl} alt="envoyé" className="img-fluid rounded" style={{maxHeight: '200px'}} />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center bg-white bg-opacity-25 p-2 rounded">
                                            <span className="fs-3 me-2">📄</span>
                                            <span className="text-truncate" style={{maxWidth: '150px'}}>{fileName}</span>
                                        </div>
                                    )}
                                    <div className="mt-1">
                                        <a href={fileUrl} target="_blank" rel="noreferrer" className={`text-decoration-none small ${msg.isMe ? 'text-white' : 'text-primary'}`}>
                                            Télécharger
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
                            )}
                        </div>
                        <small className="mt-1 mx-1 text-muted" style={{ fontSize: '0.7em' }}>{msg.time}</small>
                    </div>
                </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* --- ZONE CONTEXTE PRODUIT (PENDING) --- */}
      {pendingProductContext && (
          <div className="px-3 pt-2 bg-white border-top">
              <Card className="flex-row p-2 align-items-center border-primary bg-primary bg-opacity-10">
                  <img src={pendingProductContext.image || "https://via.placeholder.com/50"} width="50" height="50" className="rounded object-fit-cover" alt="" />
                  <div className="ms-3 flex-grow-1">
                      <small className="text-primary fw-bold d-block">Article concerné :</small>
                      <h6 className="mb-0 text-dark small">{pendingProductContext.title}</h6>
                  </div>
              </Card>
          </div>
      )}

      {/* --- INPUT AREA --- */}
      <div className="p-3 bg-white border-top">
        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2 border shadow-sm">
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            
            <Button variant="link" className="text-muted p-0 me-2" onClick={triggerFileSelect}>
                <BiPaperclip size={22} />
            </Button>
            
            <Form.Control 
                type="text" 
                placeholder="Écrivez votre message..." 
                className="border-0 bg-transparent shadow-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <Button variant="primary" className="rounded-circle ms-2 btn-kribi d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}} onClick={handleSendClick}>
                <BiSend size={20} />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;