import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, count, icon, color }) => {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="d-flex align-items-center">
        <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10 text-${color}`}>
          {icon}
        </div>
        <div>
          <h6 className="text-muted mb-0">{title}</h6>
          <h3 className="fw-bold mb-0">{count}</h3>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;