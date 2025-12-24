'use client';

import { useState, useEffect } from "react";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Implement the Login Route and Button
    const onLoginClick = () => {

    };

    return (
        <div>
            <div className="flex flex-row items-center justify-center h-screen ">
                <div className="flex flex-col items-center rounded border border-gray-600 p-10">
                    <div className="mb-4 text-xl font-semibold">Login</div>
                    <form className="grid grid-cols-[auto_1fr] gap-2 items-center">
                        <label>Username:</label>
                        <input className="border px-2 py-1" type="text" value={username} onChange={handleUsernameChange}></input> 

                        <label>Password:</label>
                        <input className="border px-2 py-1" type="password" value={password} onChange={handlePasswordChange}></input>   
                    </form>
                    <div className="col-span-2 flex justify-center mt-2">
                        <button className="px-8 py-2 border border-gray-700 rounded-2xl bg-gray-400 cursor-pointer hover:bg-gray-500" onClick={onLoginClick}>Login</button>
                    </div>
                    <a className="cursor-pointer pt-5 text-blue-600 underline hover:text-blue-800" href="/signup">Don't have an account? Sign Up</a>
                </div> 
            </div>
        </div>
    )
}

export default Login;