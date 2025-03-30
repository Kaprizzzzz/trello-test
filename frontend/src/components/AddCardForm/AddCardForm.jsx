import React, { useState } from 'react';
import useStore from '../../store/store';
import './AddCardForm.css';

const AddCardForm = ({ listId }) => {
  const [title, setTitle] = useState('');
  const { addCard } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addCard(listId, title);
      setTitle('');
    }
  };

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card Title"
        className="card-title-input"
      />
      <button type="submit" className="add-card-button">
        +
      </button>
    </form>
  );
};

export default AddCardForm;