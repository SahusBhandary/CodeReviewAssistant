'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { io } from 'socket.io-client';
import ReactMarkdown from 'react-markdown'
import Link from 'next/link';

const FolderIcon = () => (
    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

const FileIcon = () => (
    <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const ChevronIcon = ({ open }) => (
    <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const RepoView = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams()
    const { user, loading } = useUser();
    const [repoContent, setRepoContent] = useState([]);
    const [repoLoading, setRepoLoading] = useState(true);
    const [branchLoading, setBranchLoading] = useState(true);
    const [webhookData, setWebhookData] = useState(null);
    const [llmResponse, setLLMResponse] = useState("");
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { slug } = params;
    const owner = slug?.[0];
    const repo = slug?.[1];
    const content = slug?.slice(2) || [];
    const contentPath = content.join('/');
    const urlSelectedBranch = searchParams.get('branch');

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Fetch Branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.post(`http://localhost:5001/get_branches/${owner}/${repo}`);
                setBranches(response.data.branches);
            } catch (error) {
                console.error("Error: ", error);
            } finally {
                setBranchLoading(false);
            }
        };
        fetchBranches();
    }, [repo]);

    // Fetch Repo Content
    useEffect(() => {
        const fetchRepoContent = async () => {
            setRepoLoading(true);
            try {
                const response = await axios.post(`http://localhost:5001/get_repo_content/${owner}/${repo}/${urlSelectedBranch}`, {
                    username: user.username,
                    content: content,
                });
                setSelectedBranch(urlSelectedBranch);
                setRepoContent(response.data.contents);
            } catch (error) {
                console.error("Error:", error);
                setRepoContent([]);
            } finally {
                setRepoLoading(false);
            }
        };

        if (!loading && user && urlSelectedBranch) {
            fetchRepoContent();
        }
    }, [loading, user, owner, repo, urlSelectedBranch, contentPath]);

    // Webhook
    useEffect(() => {
        const socket = io('http://localhost:5001');
        socket.on('connect', () => socket.emit('join', { room: repo }));
        socket.on('webhook-received', (data) => {
            setWebhookData(data);
            setLLMResponse(data.response);
        });
        return () => socket.disconnect();
    }, [repo]);

    const onContentClick = (item) => {
        if (item.type === 'dir') {
            const basePath = `/repos/${owner}/${repo}`;
            const additionalPath = content.length > 0 ? `/${content.join('/')}` : '';
            router.push(`${basePath}${additionalPath}/${item.name}?branch=${selectedBranch}`);
        }
    };

    const updateBranch = (newBranch) => {
        const p = new URLSearchParams(searchParams);
        p.set('branch', newBranch);
        setSelectedBranch(newBranch);
        router.push(`/repos/${owner}/${repo}?${p.toString()}`);
    };

    // Breadcrumb segments
    const breadcrumbs = [
        { label: owner, href: `/repos` },
        { label: repo, href: `/repos/${owner}/${repo}?branch=${selectedBranch}` },
        ...content.map((seg, i) => ({
            label: seg,
            href: `/repos/${owner}/${repo}/${content.slice(0, i + 1).join('/')}?branch=${selectedBranch}`,
        })),
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-sm flex-wrap">
                        <Link href="/repos" className="text-neutral-400 hover:text-neutral-100 transition-colors duration-150">
                            Repos
                        </Link>
                        {breadcrumbs.slice(0).map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                <span className="text-neutral-700">/</span>
                                {i === breadcrumbs.length - 1 ? (
                                    <span className="text-neutral-100 font-medium">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href} className="text-neutral-400 hover:text-neutral-100 transition-colors duration-150">
                                        {crumb.label}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* Branch dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:border-neutral-600 text-sm text-neutral-200 transition-all duration-150 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3v6.75m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0H6m3.75 0h3.75m2.25-9.75v6.75m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0H12m3.75 0h3" />
                            </svg>
                            <span>{selectedBranch || urlSelectedBranch || "branch"}</span>
                            <ChevronIcon open={isOpen} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl z-50 overflow-hidden">
                                <div className="py-1">
                                    {branches.map((branch) => (
                                        <button
                                            key={branch}
                                            onClick={() => { updateBranch(branch); setIsOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                                                branch === selectedBranch
                                                    ? 'text-red-400 bg-red-500/10'
                                                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100'
                                            }`}
                                        >
                                            {branch}
                                            {branch === selectedBranch && (
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Webhook push banner */}
                {webhookData && (
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        New push detected — click to refresh
                    </button>
                )}

                {/* File tree */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
                    {repoLoading || branchLoading ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-neutral-500 text-sm">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Loading repository…
                        </div>
                    ) : repoContent.length === 0 ? (
                        <div className="flex items-center justify-center py-20 text-neutral-500 text-sm">
                            No files found.
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-800">
                            {repoContent.map((item, index) => (
                                <li
                                    key={item.sha || index}
                                    onClick={() => onContentClick(item)}
                                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                                        item.type === 'dir'
                                            ? 'cursor-pointer hover:bg-neutral-800/60'
                                            : 'cursor-default'
                                    }`}
                                >
                                    {item.type === 'dir' ? <FolderIcon /> : <FileIcon />}
                                    <span className={item.type === 'dir' ? 'text-neutral-200 hover:text-white' : 'text-neutral-400'}>
                                        {item.name}
                                    </span>
                                    {item.size > 0 && item.type === 'file' && (
                                        <span className="ml-auto text-xs text-neutral-600">
                                            {item.size < 1024 ? `${item.size} B` : `${(item.size / 1024).toFixed(1)} KB`}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* LLM Review Panel */}
                {llmResponse && (
                    <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-800">
                            <span className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-xs font-semibold text-neutral-300 tracking-wide uppercase">AI Code Review</span>
                            {webhookData?.commit_id && (
                                <span className="ml-auto text-xs text-neutral-600 font-mono">{webhookData.commit_id.slice(0, 7)}</span>
                            )}
                        </div>
                        <div className="px-5 py-5 prose prose-sm prose-invert max-w-none
                            prose-headings:text-neutral-100 prose-headings:font-semibold
                            prose-p:text-neutral-300 prose-p:leading-relaxed
                            prose-code:text-red-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                            prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-700
                            prose-strong:text-neutral-100
                            prose-li:text-neutral-300
                            prose-a:text-red-400">
                            <ReactMarkdown>{llmResponse}</ReactMarkdown>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RepoView;
