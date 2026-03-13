'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const Login = () => {
    const { fetchUser } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const onLoginClick = async () => {
        if (username === "" || password === "") {
            setError("Please enter a username and password.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/login', {
                username,
                password,
            }, { withCredentials: true });

            if (response.status === 200) {
                await fetchUser();
                router.push('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") onLoginClick();
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Card */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm px-8 py-10">
                    {/* Brand mark */}
                    <div className="flex items-center gap-2 mb-8">
                        <span className="w-7 h-7 rounded-lg bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            AI
                        </span>
                        <span className="font-semibold text-sm text-neutral-100">
                            Code Review <span className="text-red-400">Assistant</span>
                        </span>
                    </div>

                    <h1 className="text-xl font-bold text-neutral-100 mb-1">Welcome back</h1>
                    <p className="text-sm text-neutral-400 mb-7">Sign in to your account to continue.</p>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-neutral-400">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                onKeyDown={onKeyDown}
                                placeholder="your-username"
                                className="w-full bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-neutral-400">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                onKeyDown={onKeyDown}
                                placeholder="••••••••"
                                className="w-full bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={onLoginClick}
                            className="mt-1 w-full py-2.5 rounded-lg bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-md hover:shadow-red-600/30 transition-all duration-200 cursor-pointer"
                        >
                            Sign in
                        </button>
                    </div>

                    <p className="mt-6 text-center text-xs text-neutral-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-red-400 hover:text-red-300 transition-colors duration-150">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
