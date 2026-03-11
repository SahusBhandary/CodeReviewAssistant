'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
    const { user, loading, fetchUser } = useUser();
    
    return (
        <nav className="flex justify-between px-15 py-3 border-b border-gray-500">
            <div>
                <Link className="font-bold hover:border-b borger-gray-600" href="/">AI Code Review Assistant</Link>
            </div>
            <div className="flex gap-20">
                <Link className="font-bold hover:border-b borger-gray-600" href="/repos">Repos</Link>
                <div className="font-bold hover:border-b borger-gray-600">
                    {
                        user ? <Link href="/logout">Logout</Link> :
                        <Link href="/login">Login</Link> 
                    }
                </div>
                
            </div>
        </nav>
    )
}

export default Navbar;