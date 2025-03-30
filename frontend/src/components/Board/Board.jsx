import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useStore from '../../store/store';
import List from '../List/List';
import AddListForm from '../AddListForm/AddListForm';
import './Board.css';

const Board = () => {
  const { lists, sortCardsByDateAsc, sortCardsByDateDesc } = useStore();
  const [showAddListForm, setShowAddListForm] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        <div className="button-container">
          <div className="sort-buttons">
            <button onClick={sortCardsByDateAsc} className="sort-button">
              Sort Ascending
            </button>
            <button onClick={sortCardsByDateDesc} className="sort-button">
              Sort Descending
            </button>
          </div>
          <div className="add-list-container"> {}
            {showAddListForm ? (
              <AddListForm onCancel={() => setShowAddListForm(false)} />
            ) : (
              <button onClick={() => setShowAddListForm(true)} className="add-list-button">
                Add List
              </button>
            )}
          </div>
        </div>
        <div className="lists-container">
          {lists.map((list) => (
            <div key={list.id} className="list-wrapper">
              <List list={list} />
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;