'use client';

import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './auth-context';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc, where, query, getDocs } from 'firebase/firestore';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const cartItemsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.id, 'cartItems');
  }, [firestore, user]);

  const { data: cartItemsData, isLoading } = useCollection<{
    productId: string;
    quantity: number;
    product: Product;
  }>(cartItemsRef);

  const cartItems = useMemo(() => {
    if (!cartItemsData) return [];
    // The data from firestore only contains productId and quantity.
    // We need to map it to the full CartItem structure.
    // This assumes product details are embedded or can be fetched, but for now we embed them.
    return cartItemsData.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
    }));
  }, [cartItemsData]);


  const findCartItemByProductId = async (productId: string) => {
    if (!cartItemsRef) return null;
    const q = query(cartItemsRef, where("product.id", "==", productId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  };


  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated || !cartItemsRef) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You must be logged in to add items to the cart.',
      });
      return;
    }

    const existingItem = await findCartItemByProductId(product.id);

    if (existingItem && firestore) {
        const itemDocRef = doc(firestore, cartItemsRef.path, existingItem.id);
        updateDocumentNonBlocking(itemDocRef, { quantity: existingItem.quantity + quantity });
    } else {
        addDocumentNonBlocking(cartItemsRef, { product, quantity });
    }

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!isAuthenticated || !cartItemsRef || !firestore) return;

    const existingItem = await findCartItemByProductId(productId);

    if (existingItem) {
        const itemDocRef = doc(firestore, cartItemsRef.path, existingItem.id);
        if (newQuantity <= 0) {
            deleteDocumentNonBlocking(itemDocRef);
        } else {
            updateDocumentNonBlocking(itemDocRef, { quantity: newQuantity });
        }
    }
  };

  const removeFromCart = async (productId: string) => {
     if (!isAuthenticated || !cartItemsRef || !firestore) return;

    const existingItem = await findCartItemByProductId(productId);
     if (existingItem) {
        const itemDocRef = doc(firestore, cartItemsRef.path, existingItem.id);
        deleteDocumentNonBlocking(itemDocRef);
     }
  };

  const clearCart = () => {
    if (!isAuthenticated || !cartItemsRef || !firestore) return;
    // This is more complex with Firestore, requires deleting all docs in subcollection
    // For now, we will iterate and delete. For larger carts, a cloud function would be better.
    cartItems.forEach(item => {
        if(item.id) {
            const itemDocRef = doc(firestore, cartItemsRef.path, item.id);
            deleteDocumentNonBlocking(itemDocRef);
        }
    });
  };

  const getCartSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems || [],
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartSubtotal,
        getCartCount,
        loading: isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};