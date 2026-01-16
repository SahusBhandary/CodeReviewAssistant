'use client';

import { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const Repos = () => {
    const [ ifDialog, setIsDialog ] = useState(false);
    const [ owner, setOwner ] = useState('');
    const [ repoName, setRepoName ] = useState('');
    const { user, repos, fetchUser } = useUser();
    const router = useRouter();

    const handleOwnerChange = (e) => {
        setOwner(e.target.value);
    }

    const handleRepoNameChange = (e) => {
        setRepoName(e.target.value);
    }

    const onAddRepoClick = async () => {
        if (owner == "" || repoName == ""){
            alert("Must enter an owner and repo name!");
            return;
        }

        try{
            const response = await axios.post(`http://localhost:5001/add_repo/${owner}/${repoName}`, {
                username: user.username,
            });

            await fetchUser();
            setIsDialog(false);
        }
        catch(error){
            console.error("Error:",error);
            return;
        }
        
    }

    const onDeleteRepoClick = async (repoOwner, repoName) => {
        try{
            const response = await axios.post(`http://localhost:5001/delete_repo/${repoOwner}/${repoName}`, {
                username: user.username,
            });
            
            await fetchUser();
        }
        catch(error){
            console.error("Error:",error);
            return;
        }
    }

    // Function for selecting a repository
    const onRepoClick = async (repoOwner, repoName) => {
        router.push(`/repos/${repoOwner}/${repoName}`)
    }

    return (
        <div>
            <div className="flex justify-center text-2xl font-bold py-5">Repositories</div>
            {user ? 
                <>
                    <div className="flex justify-center pb-5">
                        <ul>
                            {repos.map((repo) => (
                                <div 
                                    key={repo.id + repo.repo_name}
                                    className="flex flex-col border p-2 m-2" 
                                >
                                    <li 
                                        onClick={() => onRepoClick(repo.owner, repo.repo_name)}
                                    >
                                        {repo.owner + "-" + repo.repo_name}
                                    </li>   
                                    <button 
                                        className="border p-2 cursor-pointer"
                                        onClick={() => onDeleteRepoClick(repo.owner, repo.repo_name)}
                                    >
                                        Delete Repo
                                    </button> 
                                </div>
                            ))}
                        </ul>
                    
                    </div>
                    <div className="flex justify-center">
                        <button className="border-2 p-2 cursor-pointer" onClick={() => setIsDialog(true)}>+ Add Repository</button>
                    </div> 
                </>
            : <div className="flex justify-center">Please log-in!</div>}
            
            {ifDialog && 
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white max-w-2xl w-full">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold">Add Repository</h2>
                                <button
                                    onClick={() => setIsDialog(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
                                >
                                    x
                                </button>
                            </div>
                            <div className="flex flex-col items-center">
                                <form className="grid grid-cols-[auto_1fr] gap-2 items-center p-5">
                                    <label>Owner</label>
                                    <input className="border rounded-2xl" type="text" value={owner} onChange={handleOwnerChange}></input>

                                    <label>Repo Name</label>
                                    <input className="border rounded-2xl" type="text" value={repoName} onChange={handleRepoNameChange}></input>
                                </form>
                                <button className="border-2 p-2 cursor-pointer mb-2" onClick={onAddRepoClick}>
                                    Add Repo
                                </button>

                            </div>
                        </div>
                    </div>
                </> 
            }
        </div>
    )
}

export default Repos;