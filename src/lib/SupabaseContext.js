import React, { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZHN2dm9mcXBmdXR1bGdkdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNzE5ODUsImV4cCI6MjA1MjY0Nzk4NX0.6xVK2z8Y9wNKlOnW7tk1T7hJcq8xnTAwdAo9q0-pyIo";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create the context
const SupabaseContext = createContext();

// Context Provider component
export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to use Supabase
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};