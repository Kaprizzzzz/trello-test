import React, { useState } from 'react';
import useStore from '../../store/store';
import './AddListForm.css';

const AddListForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const { addList } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    addList(title);
    if (onCancel) onCancel();
  };

  return (
    <form className="add-list-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="List title"
        className="list-title-input"
      />
      <button type="submit" className="add-list-button">
        Add List
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      )}
    </form>
  );
};

export default AddListForm;