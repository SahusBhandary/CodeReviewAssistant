'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import ReactMarkdown from 'react-markdown'

const RepoView = () => {
    const params = useParams();
    const router = useRouter();
    const { user, loading } = useUser();
    const [ repoContent, setRepoContent ] = useState([]);
    const [ repoLoading, setRepoLoading ] = useState(true);
    const [ webhookData, setWebhookData ] = useState(null);
    const [ llmResponse, setLLMResponse ] = useState("");
    const [ defaultBranch, setDefaultBranch ] = useState("");
    const [ branches, setBranches ] = useState([]);
    const [ selectedBranch, setSelectedBranch ] = useState("");
    const [ isOpen, setIsOpen ] = useState(false);

    // Parse params
    const { slug } = params;
    const owner = slug?.[0];
    const repo = slug?.[1];
    const content = slug?.slice(2) || [];
    
    // Fetch Repo Content
    useEffect(() => {
        if (!loading && user) {
            fetchRepoContent();
        }
    }, [loading, user, owner, repo]);

    // Webhook 
    useEffect(() => {
        // Connect to Flask backend
        const socket = io('http://localhost:5001');
        
        // Join a room
        socket.on('connect', () => {
            console.log("Connected to server");
            socket.emit('join', {room: repo})
        });
        
        socket.on('webhook-received', (data) => {
            console.log('Webhook data received:', data);
            setWebhookData(data);
            setLLMResponse(data.response);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => socket.disconnect();
    }, [repo]);

    // Fetch Branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.post(`http://localhost:5001/get_branches/${owner}/${repo}`);
                setDefaultBranch(response.data.default_branch);
                setSelectedBranch(response.data.default_branch);
                setBranches(response.data.branches);
            }
            catch(error){
                console.error("Error: ", error);
            }
        }
        fetchBranches();
    }, [repo]);

    const fetchRepoContent = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/get_repo_content/${owner}/${repo}`, {
                username: user.username,
                content: content,
            });
            console.log(response.data.contents);
            setRepoContent(response.data.contents);
        }
        catch(error){
            console.log("Error:",error);
            setRepoContent(null);
            return;
        }
        finally{
            setRepoLoading(false);
        }
    }

    const onContentClick = (item) => {
        if (item.type === 'dir') {
            // Build the new URL by appending the directory name
            const currentPath = `/repos/${owner}/${repo}`;
            const additionalPath = content.length > 0 ? `/${content.join('/')}` : '';
            router.push(`${currentPath}${additionalPath}/${item.name}`);
        } else {
            // Handle file click - maybe show file content
            console.log('File clicked:', item);
        }
    }

    return (
        <>
            <div className='flex flex-col'>
                <div
                    className='flex justify-between m-5'
                >
                    <div
                        className='font-bold text-xl'
                    >
                        {owner + "-" + repo}
                    </div>
                    <div 
                        className="bg-gray-200 px-5 py-2"
                    >
                        <button
                            className='cursor-pointer bg-gray-500'
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? "▲" : "▼"}
                            {selectedBranch}
                        </button>
                        {isOpen && 
                            <ul>
                                {branches.map((branch) => (
                                    branch != selectedBranch ? 
                                    <li 
                                        onClick={() => {
                                            setSelectedBranch(branch);
                                            setIsOpen(false);
                                        }}
                                        key={branch}
                                        className='cursor-pointer bg-gray-500'
                                    >
                                        {branch}
                                    </li> : ""
                                ))}
                            </ul>
                        }
                    </div>
                </div>
                
                {webhookData && 
                    <div className='flex justify-center'>
                        <button className='border p-2 cursor-pointer' onClick={() => window.location.reload()}>New Push Made, Click to Refresh</button>
                    </div>
                }
                {!repoLoading ?
                    <ul>
                        {repoContent.map((cont, index) => (
                            <li 
                                className='border p-2 cursor-pointer' 
                                key={cont.sha || index}
                                onClick={() => onContentClick(cont)}
                            >
                                {cont.type == "dir" ? "📁" + cont.name : "📄" + cont.name}
                            </li>
                        ))}
                    </ul>
                : <div>Loading...</div>}
                {llmResponse && <ReactMarkdown>{llmResponse}</ReactMarkdown>}
            </div>
        </>
    )
}

export default RepoView;