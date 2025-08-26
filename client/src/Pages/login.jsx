import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const {headers} =
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email,
        password,
      });

      console.log(response);

      if (response.status === 200) {
        setMessage("Login successful");
        toast.success("Login successfully!");
        //With token coming from headers
        // localStorage.setItem('token', headers.authorization);
        localStorage.setItem("token", response.token);
        //Don't save the email in the localstorage
        localStorage.setItem("email", response.email);
        setError("");
        const token = response.data.token;
        Cookies.set("token", token), { expires: 1 };
        setIsAuthenticated(true);

        navigate("/");
      }
    } catch (error) {
      setError("Invalid credentials");
      toast.error(error.response.data.message);
      setMessage("");
    }
  };

  const handleLogout = async () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-full p-4">
      <div
        className="text-white p-6 rounded shadow-lg w-full max-w-sm"
        style={{
          backgroundColor: "#1f2937",
          WebkitBackdropFilter: "blur(5px)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(102,224,2,0.1)",
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-white text-left text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 p-2 w-full border rounded outline-none text-black bg-cyan-50 text-sm"
            />
          </div>
          <div className="mb-3">
            <label className="block text-white text-left text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 p-2 w-full border rounded outline-none text-black bg-cyan-50 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-300 text-black p-2 rounded mt-3 font-bold hover:bg-orange-400 transition-colors duration-300 text-sm"
          >
            Login
          </button>
        </form>
        <p className="text-center text-white mt-3 text-xs">
          Do not have an account?{" "}
          <Link to="/register" className="text-[#fff] pl-1 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;