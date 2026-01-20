'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
    const { user, loading, fetchUser } = useUser();
    
    return (
        <nav className="flex justify-between px-15 py-2 border-b border-gray-500">
            <div>
                <Link href="/">Home</Link>
            </div>
            <div>
                <Link href="/repos">Repos</Link>
            </div>
            <div>
                {
                    user ? <Link href="/logout">Logout</Link> :
                    <Link href="/login">Login</Link> 
                }
                
            </div>
        </nav>
    )
}

export default Navbar;