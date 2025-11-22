'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  User as FirebaseUser,
} from 'firebase/auth';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: firebaseUser, isUserLoading, auth } = useFirebaseAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;
    if (firebaseUser) {
      const userDoc = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
        email: firebaseUser.email || '',
      }
      setUser(userDoc);
    } else {
      setUser(null);
    }
  }, [firebaseUser, isUserLoading]);

  const login = (email: string, password?: string) => {
    if (auth && password) {
      initiateEmailSignIn(auth, email, password);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    if (auth && firestore && password) {
      try {
        // This part needs to be blocking to get the user credential for doc creation
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const newUser = userCredential.user;
        if (newUser) {
          const userDocRef = doc(firestore, 'users', newUser.uid);
          const userData = {
            id: newUser.uid,
            firstName: name.split(' ')[0] || '',
            lastName: name.split(' ')[1] || '',
            email: newUser.email,
          };
          // We can use the non-blocking update here after user creation
          setDocumentNonBlocking(userDocRef, userData, { merge: true });
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  const logout = () => {
    auth?.signOut();
    router.push('/');
  };

  const isAuthenticated = useMemo(() => !!firebaseUser, [firebaseUser]);

  const value = {
    user,
    firebaseUser,
    isAuthenticated,
    login,
    register,
    logout,
    loading: isUserLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isUserLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};