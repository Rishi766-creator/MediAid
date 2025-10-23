import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login(){
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [pass,setPass]=useState("");
      const [error, setError] = useState("");

    function sign(e){
        e.preventDefault();
        navigate('/signup')

    }
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email: email, password: pass });
localStorage.setItem("token", res.data.token);
console.log("Token saved:", res.data.token);
      alert("Login successful!");
              navigate('/');

    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
    }
  };
    
    
    return(
        <>
            <div className="bg-blue-200  min-h-screen flex justify-center items-center">
                <form className="bg-white flex flex-col items-center justify-center w-full rounded-xl max-w-sm " onSubmit={handleSubmit}>
                    <h1 className="mt-5 text-4xl mb-4">Login</h1>
                    <input type="email" placeholder="Email" className="mb-4 p-2   focus:outline-none focus:ring-2 focus:ring-blue-400  transition-all duration-300" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <input type="password" placeholder="Password" className="mb-6 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400  transition-all duration-300" onChange={(e)=>{setPass(e.target.value)}}/>
                    <button className="border-1 border-solid p-2 bg-blue-400 w-1/2 mb-2" >Login</button>
                    <p className="mb-2">Don't have an account?<button type="button" className="text-blue-500" onClick={sign}> Signup</button></p>
                            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

                </form>
            </div>


        </>
    )
    
}