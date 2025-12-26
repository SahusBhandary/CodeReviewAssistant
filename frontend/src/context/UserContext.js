'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }){
    const [ user, setUser ] = useState(null);
    const [ repos, setRepos ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    // Get user from cookie
    const fetchUser = async () => {
        try{
            const response = await axios.get('http://localhost:5001/get_user_data', {
                withCredentials: true 
            });
    
            if (response.status == 200){
                const data = response.data;
                setUser(data);
                setRepos(data.repos);
            }
            else{
                setUser(null);
                setRepos([]);
            }
        }
        catch (error){
            console.log("Error:", error);
            setUser(null);
            setRepos([]);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, repos, loading, fetchUser }}>
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