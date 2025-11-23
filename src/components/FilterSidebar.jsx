import React from 'react';
import { ListGroup, Form } from 'react-bootstrap';

const FilterSidebar = ({ selectedCategories, onCategoryChange, searchType, onSearchTypeChange }) => {
  const categories = ['Immobilier', 'Alimentation', 'Transport', 'Technique', 'Santé', 'Divers'];

  const handleCheck = (cat) => {
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter(c => c !== cat));
    } else {
      onCategoryChange([...selectedCategories, cat]);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      
      {/* NOUVEAU : Filtre Type */}
      <h5 className="fw-bold mb-3">Je recherche</h5>
      <Form.Group className="mb-4">
        <Form.Check 
            type="radio"
            label="Tout"
            name="searchType"
            id="type-all"
            checked={searchType === 'all'}
            onChange={() => onSearchTypeChange('all')}
            className="mb-2"
        />
        <Form.Check 
            type="radio"
            label="Services / Articles"
            name="searchType"
            id="type-service"
            checked={searchType === 'service'}
            onChange={() => onSearchTypeChange('service')}
            className="mb-2"
        />
        <Form.Check 
            type="radio"
            label="Fournisseurs"
            name="searchType"
            id="type-provider"
            checked={searchType === 'provider'}
            onChange={() => onSearchTypeChange('provider')}
        />
      </Form.Group>
      
      <hr className="text-muted" />

      <h5 className="fw-bold mb-3">Catégories</h5>
      <ListGroup variant="flush">
        {categories.map((cat, idx) => (
          <ListGroup.Item key={idx} className="border-0 px-0 text-secondary py-1">
            <Form.Check 
              type="checkbox" 
              label={cat} 
              id={`cat-${idx}`}
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCheck(cat)}
              style={{cursor: 'pointer'}}
              disabled={searchType === 'provider'} // Désactiver si on cherche des fournisseurs (optionnel)
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default FilterSidebar;