import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (userId) {
        // Correction : utilisation correcte de Drizzle ORM
        const result = await db.select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        const userData = result[0]; // Récupérer le premier élément

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            username: userData.username
          });
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Correction : utilisation correcte de Drizzle ORM
      const result = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const userData = result[0]; // Récupérer le premier élément

      if (!userData || userData.password !== password) {
        throw new Error('Email ou mot de passe incorrect');
      }

      await SecureStore.setItemAsync('userId', userData.id);
      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingResult = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingResult.length > 0) {
        throw new Error('Cet email est déjà utilisé');
      }

      const userId = Date.now().toString();

      await db.insert(users).values({
        id: userId,
        email,
        password, // En production, utilisez un hash !
        username,
        createdAt: new Date().toISOString()
      });

      await SecureStore.setItemAsync('userId', userId);
      setUser({ id: userId, email, username });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userId');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};