'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";


const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Implement the Signup Route and Button
    const onSignUpClick = async () => {
        if (username === "" || password === ""){
            alert("Please make sure to enter a username and password!")
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/signup', {
                username: username,
                password: password,
            });
            
            // On success, send user to login page
            if (response.status == 200){
                router.push('/login');
            }
        }
        catch(error){
            console.error(error);
            alert(error.response.data.message);
        }
    };

    return (
        <div>
            <div className="flex flex-row items-center justify-center h-screen ">
                <div className="flex flex-col items-center rounded border border-gray-600 p-10">
                    <div className="mb-4 text-xl font-semibold">Sign Up</div>
                    <form className="grid grid-cols-[auto_1fr] gap-2 items-center">
                        <label>Username:</label>
                        <input className="border px-2 py-1" type="text" value={username} onChange={handleUsernameChange}></input> 

                        <label>Password:</label>
                        <input className="border px-2 py-1" type="password" value={password} onChange={handlePasswordChange}></input> 
                         
                    </form>
                    <div className="col-span-2 flex justify-center mt-2">
                        <button className="px-8 py-2 border border-gray-700 rounded-2xl bg-gray-400 cursor-pointer hover:bg-gray-500" onClick={onSignUpClick}>Sign Up</button>
                    </div>
                    <Link className="cursor-pointer pt-5 text-blue-600 underline hover:text-blue-800" href="/login">Already have an account? Login</Link>
                </div> 
            </div>
        </div>
    )
}

export default SignUp;