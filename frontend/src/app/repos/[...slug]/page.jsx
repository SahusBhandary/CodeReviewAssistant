'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import axios from 'axios';

const RepoView = () => {
    const params = useParams();
    const router = useRouter();
    const { user, loading } = useUser();
    const [ repoContent, setRepoContent ] = useState([]);
    const [ repoLoading, setRepoLoading ] = useState(true);

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
                <div className='flex justify-center font-bold text-xl m-5'>{owner + "-" + repo}</div>
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
            </div>
        </>
    )
}

export default RepoView;