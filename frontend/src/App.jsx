import React, { useEffect } from 'react';
import useStore from './store/store';
import Board from './components/Board/Board';

const App = () => {
  const { fetchLists, fetchCards } = useStore();

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchLists, fetchCards]);

  return (
    <div>
      <Board />
    </div>
  );
};

export default App;