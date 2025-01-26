import React, { useContext } from 'react'
import { SupabaseContext } from '../lib/SupabaseContext'

// Custom hook to use the Supabase context
const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export default useSupabase
