import { useEffect, useState } from "react";
// import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/login.jsx";
import Dashboard from "./Pages/dashboard.jsx";
// import Navbar from "./components/Navbar.jsx";

function App() {
  const [loginName, setLoginName] = useState(null);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* <Navbar className="sticky top-0" /> */}
      <div className="app-bg "></div>
      <div className="flex-grow relative">
        <Routes>
          {/* <Route path="/register" element={<Register />}></Route> */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>

        </Routes>
      </div>
    </div>
  );
}

export default App;