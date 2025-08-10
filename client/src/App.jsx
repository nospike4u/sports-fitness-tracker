import { useEffect, useState } from "react";
// import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/login.jsx";
import Users from "./Pages/Users.jsx";
import User from "./Pages/User.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

function App() {
 
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* <Navbar className="sticky top-0" /> */}
      <div className="app-bg "></div>
      <div className="flex-grow relative">
        <Navbar/>
        <Routes>
          {/* <Route path="/register" element={<Register />}></Route> */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/users" element={<Users/>} />
          <Route path="/users/:id" element={<User/>} />
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          {/* <Route path="/*" element={<Error/>} /> */}
        </Routes>
        <Footer/>
      </div>
    </div>
  );
}

export default App;