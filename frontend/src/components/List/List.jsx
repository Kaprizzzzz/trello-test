import React from 'react';
import { useDrop } from 'react-dnd';
import useStore from '../../store/store';
import Card from '../Card/Card';
import AddCardForm from '../AddCardForm/AddCardForm';
import './List.css';

const List = ({ list }) => {
  const { cards, deleteList, moveCard } = useStore();
  const listCards = cards.filter((card) => card.list_id === list.id);

  const [, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item, monitor) => {
      console.log('Dropped item:', item);
      moveCard(item.id, item.list_id, list.id);
      return { list_id: list.id };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} className="list-container">
      <h2 className="list-title">{list.title}</h2>
      <AddCardForm listId={list.id} />
      <button onClick={() => deleteList(list.id)} className="delete-list-button">
        X
      </button>
      <div className="cards-container">
        {listCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default List;