import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import useStore from '../../store/store';
import './Card.css';

const Card = ({ card }) => {
  const { deleteCard, updateCard } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [timeAgo, setTimeAgo] = useState('');

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: card.id, list_id: card.list_id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim() === '') {
      setIsEditing(false);
      return;
    }
    updateCard(card.id, card.list_id, editedTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(card.title);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  return (
    <div
      ref={drag}
      className={`card ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setTimeAgo(getTimeAgo(new Date(card.created_at)))}
      onMouseLeave={() => setTimeAgo('')}
    >
      <div className="card-title">{card.title}</div>
      <div className="card-actions">
        <button onClick={handleEdit} className="edit-button">
          Edit
        </button>
        <button onClick={() => deleteCard(card.id)} className="delete-button">
          X
        </button>
      </div>
      {isEditing && (
        <div className="edit-modal">
          <div className="edit-modal-title">Edit Card</div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
            className="edit-input"
          />
          <div className="edit-modal-actions">
            <button onClick={handleSave} className="save-button">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
      {timeAgo && <div className="time-ago">{timeAgo}</div>}
    </div>
  );
};

export default Card;