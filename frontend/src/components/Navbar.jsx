'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
    const { user, loading, fetchUser } = useUser();
    
    return (
        <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link 
                    href="/" 
                    className="text-xl font-bold text-white hover:text-red-500 transition-colors"
                >
                    AI Code Review
                </Link>
                
                <div className="flex gap-6 items-center">
                    <Link 
                        href="/repos" 
                        className="text-gray-300 hover:text-white transition-colors font-medium"
                    >
                        Repositories
                    </Link>
                    
                    {user ? (
                        <Link 
                            href="/logout" 
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Logout
                        </Link>
                    ) : (
                        <Link 
                            href="/login" 
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;