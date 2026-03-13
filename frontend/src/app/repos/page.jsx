'use client';

import { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Repos = () => {
    const [ifDialog, setIsDialog] = useState(false);
    const [owner, setOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const { user, repos, fetchUser } = useUser();
    const router = useRouter();

    const handleOwnerChange = (e) => setOwner(e.target.value);
    const handleRepoNameChange = (e) => setRepoName(e.target.value);

    const onAddRepoClick = async () => {
        if (owner === "" || repoName === "") {
            alert("Must enter an owner and repo name!");
            return;
        }
        try {
            await axios.post(`http://localhost:5001/add_repo/${owner}/${repoName}`, {
                username: user.username,
            });
            await fetchUser();
            setOwner('');
            setRepoName('');
            setIsDialog(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onDeleteRepoClick = async (repoOwner, repoName) => {
        try {
            await axios.post(`http://localhost:5001/delete_repo/${repoOwner}/${repoName}`, {
                username: user.username,
            });
            await fetchUser();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchDefaultBranch = async (repoOwner, repoName) => {
        try {
            const response = await axios.post(`http://localhost:5001/get_branches/${repoOwner}/${repoName}`);
            return response.data.default_branch;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    const onRepoClick = async (repoOwner, repoName) => {
        const defaultBranch = await fetchDefaultBranch(repoOwner, repoName);
        router.push(`/repos/${repoOwner}/${repoName}?branch=${defaultBranch}`);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Repositories</h1>
                        <p className="text-sm text-neutral-400 mt-1">
                            {user ? `${repos.length} repo${repos.length !== 1 ? 's' : ''} connected` : "Sign in to manage your repos"}
                        </p>
                    </div>
                    {user && (
                        <button
                            onClick={() => setIsDialog(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-md hover:shadow-red-600/30 transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Repo
                        </button>
                    )}
                </div>

                {/* Content */}
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <p className="text-neutral-300 font-medium mb-1">You're not signed in</p>
                        <p className="text-neutral-500 text-sm mb-6">Sign in to connect and manage your repositories.</p>
                        <Link
                            href="/login"
                            className="px-5 py-2 rounded-full bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-md transition-all duration-200"
                        >
                            Sign in
                        </Link>
                    </div>
                ) : repos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-neutral-800 rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                        </div>
                        <p className="text-neutral-300 font-medium mb-1">No repositories yet</p>
                        <p className="text-neutral-500 text-sm mb-6">Add a GitHub repo to start getting AI code reviews.</p>
                        <button
                            onClick={() => setIsDialog(true)}
                            className="px-5 py-2 rounded-full bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer"
                        >
                            Add your first repo
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {repos.map((repo) => (
                            <div
                                key={repo.id + repo.repo_name}
                                className="group flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-200"
                            >
                                <button
                                    className="flex items-center gap-3 text-left cursor-pointer"
                                    onClick={() => onRepoClick(repo.owner, repo.repo_name)}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-red-500/30 group-hover:text-red-400 transition-colors duration-200">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-100 group-hover:text-white">
                                            {repo.owner}<span className="text-neutral-500">/</span>{repo.repo_name}
                                        </p>
                                        {repo.description && (
                                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{repo.description}</p>
                                        )}
                                    </div>
                                </button>

                                <button
                                    onClick={() => onDeleteRepoClick(repo.owner, repo.repo_name)}
                                    className="ml-4 p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                                    title="Remove repo"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Repo Modal */}
            {ifDialog && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setIsDialog(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                                <h2 className="text-base font-semibold text-neutral-100">Add Repository</h2>
                                <button
                                    onClick={() => setIsDialog(false)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all duration-150 cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="px-6 py-5 flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-neutral-400">Owner</label>
                                    <input
                                        type="text"
                                        value={owner}
                                        onChange={handleOwnerChange}
                                        placeholder="e.g. torvalds"
                                        className="w-full bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-neutral-400">Repository Name</label>
                                    <input
                                        type="text"
                                        value={repoName}
                                        onChange={handleRepoNameChange}
                                        placeholder="e.g. linux"
                                        className="w-full bg-neutral-800/60 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
                                    />
                                </div>

                                <button
                                    onClick={onAddRepoClick}
                                    className="mt-1 w-full py-2.5 rounded-lg bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-md hover:shadow-red-600/30 transition-all duration-200 cursor-pointer"
                                >
                                    Add Repository
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Repos;
