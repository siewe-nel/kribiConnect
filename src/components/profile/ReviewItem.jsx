import React from 'react';
import { Card } from 'react-bootstrap';
import { BiStar } from 'react-icons/bi';

const ReviewItem = ({ user, rating, comment, date }) => {
  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
            <div className="fw-bold">{user}</div>
            <small className="text-muted">{date}</small>
        </div>
        <div className="text-warning mb-2">
            {[...Array(5)].map((_, i) => (
                <BiStar key={i} fill={i < rating ? "currentColor" : "none"} />
            ))}
        </div>
        <Card.Text className="text-secondary">{comment}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReviewItem;