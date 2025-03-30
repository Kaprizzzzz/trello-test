import { create } from 'zustand';
import { API_URL } from '../config'; 

const useStore = create((set) => ({
  lists: [],
  cards: [],
  fetchLists: async () => {
    try {
      const res = await fetch(`${API_URL}/lists`); 
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      set({ lists: data });
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  },
  addList: async (title) => {
    try {
      const res = await fetch(`${API_URL}/lists`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const newList = await res.json();
      set((state) => ({ lists: [...state.lists, newList] }));
    } catch (error) {
      console.error('Error adding list:', error);
    }
  },
  fetchCards: async () => {
    try {
      const res = await fetch(`${API_URL}/cards`); 
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      set({ cards: data });
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  },
  addCard: async (list_id, title) => {
    try {
      const res = await fetch(`${API_URL}/cards`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_id, title }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const newCard = await res.json();
      set((state) => ({ cards: [...state.cards, newCard] }));
    } catch (error) {
      console.error('Error adding card:', error);
    }
  },
  updateCard: async (id, list_id, title) => {
    try {
      const res = await fetch(`${API_URL}/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_id, title }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const updatedCard = await res.json();
      set((state) => ({
        cards: state.cards.map((card) => (card.id === id ? updatedCard : card)),
      }));
    } catch (error) {
      console.error('Error updating card:', error);
    }
  },
  deleteCard: async (id) => {
    try {
      const res = await fetch(`${API_URL}/cards/${id}`, { 
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      set((state) => ({ cards: state.cards.filter((card) => card.id !== id) }));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  },
  deleteList: async (id) => {
    try {
      const res = await fetch(`${API_URL}/lists/${id}`, { 
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      set((state) => ({ lists: state.lists.filter((list) => list.id !== id) }));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  },
  moveCard: (cardId, fromListId, toListId) => {
    set((state) => ({
      cards: state.cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, list_id: toListId };
        }
        return card;
      }),
    }));
  },
  sortCardsByDateAsc: () => {
    set((state) => ({
      cards: [...state.cards].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    }));
  },
  sortCardsByDateDesc: () => {
    set((state) => ({
      cards: [...state.cards].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    }));
  },
}));

export default useStore;