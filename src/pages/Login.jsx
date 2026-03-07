import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if(user && user.email === email && user.password === password){
      alert("Login successful!");
      navigate("/");
    }else{
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;