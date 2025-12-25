'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }){
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    // Get user from cookie
    const fetchUser = async () => {
        try{
            const response = await axios('http://localhost:5001/get_user_data', {
                withCredentials: true 
            });
    
            if (response.status == 200){
                const data = response.data;
                setUser(data);
            }
            else{
                setUser(null);
            }
        }
        catch (error){
            console.error("Error:", error);
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}