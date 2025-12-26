'use client';

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import axios from 'axios';

const Logout = () => {
    const router = useRouter();
    const { fetchUser } = useUser();

    useEffect(() => {
        handleLogout();
    }, [])

    const handleLogout = async () => {
        try{
            const response = await axios('http://localhost:5001/logout', {
                withCredentials: true,
            });
            
            // Refresh User Status
            await fetchUser();
            
            // Check response, on success send home, on error, send home + print error
            if (response.status == 200){
                router.push('/');
            }
            else{
                console.error("Logout Error:",error);
                await fetchUser();
                router.push('/');
            }
            
        }
        catch(error){
            console.error("Logout Error:",error);
            return;
        }
        
    }

    // Return something

}

export default Logout;
