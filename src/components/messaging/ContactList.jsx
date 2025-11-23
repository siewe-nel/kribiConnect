import React from 'react';
import { ListGroup, Form, InputGroup } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';

const ContactList = ({ contacts, activeId, onSelect }) => {
  return (
    <div className="h-100 d-flex flex-column bg-white">
      <div className="p-3 border-bottom">
        <InputGroup>
          <InputGroup.Text className="bg-light border-end-0"><BiSearch /></InputGroup.Text>
          <Form.Control placeholder="Rechercher..." className="bg-light border-start-0 shadow-none" />
        </InputGroup>
      </div>
      
      <div className="overflow-auto flex-grow-1">
        {contacts.length > 0 ? (
            <ListGroup variant="flush">
            {contacts.map((contact) => (
                <ListGroup.Item 
                key={contact.id} 
                action 
                active={activeId === contact.id}
                onClick={() => onSelect(contact.id)}
                className={`d-flex align-items-center p-3 border-0 ${activeId === contact.id ? 'bg-sky-50 border-start border-4 border-primary' : ''}`}
                >
                <div className="position-relative">
                    <img 
                        src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}`} 
                        alt="" 
                        width="45" height="45" 
                        className="rounded-circle me-3 border" 
                    />
                    {/* Indicateur En Ligne (Optionnel dans la liste, mais sympa) */}
                    {contact.isOnline && (
                        <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{width: 12, height: 12, marginRight: 16}}></span>
                    )}
                </div>
                
                <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-baseline">
                    <h6 className="mb-0 text-truncate fw-bold">{contact.name}</h6>
                    <small className="text-muted" style={{fontSize: '0.7rem'}}>
                        {contact.lastMessageDate ? new Date(contact.lastMessageDate).toLocaleDateString() : ''}
                    </small>
                    </div>
                    <p className="small text-muted mb-0 text-truncate">
                        {contact.lastMessage || "Nouvelle conversation"}
                    </p>
                </div>
                </ListGroup.Item>
            ))}
            </ListGroup>
        ) : (
            <div className="text-center p-4 text-muted mt-5">
                <p>Aucune conversation.</p>
                <small>Allez sur un article pour contacter un fournisseur.</small>
            </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;