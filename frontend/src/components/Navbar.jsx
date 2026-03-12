'use client';

import Link from "next/link";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
    const { user, loading } = useUser();

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-neutral-950/90 border-b border-neutral-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

                {/* Brand */}
                <Link
                    href="/"
                    className="flex items-center gap-2 group"
                >
                    <span className="w-7 h-7 rounded-lg bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-red-600/40 transition-shadow duration-300">
                        AI
                    </span>
                    <span className="font-semibold text-sm tracking-tight text-neutral-100">
                        Code Review{" "}
                        <span className="text-red-400">Assistant</span>
                    </span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/repos"
                        className="px-4 py-1.5 text-sm font-medium text-neutral-400 rounded-full hover:bg-neutral-800 hover:text-neutral-100 transition-all duration-200"
                    >
                        Repos
                    </Link>

                    {!loading && (
                        user ? (
                            <Link
                                href="/logout"
                                className="px-4 py-1.5 text-sm font-medium text-neutral-400 rounded-full hover:bg-neutral-800 hover:text-neutral-100 transition-all duration-200"
                            >
                                Logout
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-1.5 text-sm font-semibold text-white rounded-full bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-md hover:shadow-red-600/40 transition-all duration-200"
                            >
                                Login
                            </Link>
                        )
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;