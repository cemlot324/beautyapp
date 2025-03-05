'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BasketItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface BasketContextType {
  items: BasketItem[];
  addToBasket: (item: BasketItem) => void;
  removeFromBasket: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Load basket from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      setItems(JSON.parse(savedBasket));
    }
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(items));
  }, [items]);

  const addToBasket = (newItem: BasketItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === newItem.productId);
      if (existingItem) {
        return currentItems.map(item =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, newItem];
    });
    // Show preview when item is added
    setShowPreview(true);
    // Hide preview after 3 seconds
    setTimeout(() => setShowPreview(false), 3000);
  };

  const removeFromBasket = (productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  return (
    <BasketContext.Provider value={{
      items,
      addToBasket,
      removeFromBasket,
      updateQuantity,
      clearBasket,
      showPreview,
      setShowPreview
    }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
} 