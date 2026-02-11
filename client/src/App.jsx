import { useEffect, useState } from "react";
// import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/login.jsx";
import Users from "./Pages/Users.jsx";
import User from "./Pages/User.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import OAuthSuccess from "./Pages/OAuthSuccess.jsx";
import OAuthError from "./Pages/OAuthError.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import { ThemeContext } from "./theme/ThemeContext.jsx";
// import Test from "./Components/Test.jsx";

function App() {
 
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background */}
      <div className="app-bg absolute inset-0 -z-10"></div>
      
      {/* Main content wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Navbar/>
        {/* <Test /> */}
        {/* Main content area that grows to push footer down */}
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/register" element={<Register />}></Route> */}
            <Route path="/login" element={<Login />}></Route>
            <Route path="/users" element={<Users/>} />
            <Route path="/users/:id" element={<User/>} />
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/oauth/success" element={<OAuthSuccess/>}></Route>
            <Route path="/oauth/error" element={<OAuthError/>}></Route>
            {/* <Route path="/*" element={<Error/>} /> */}
          </Routes>
        </main>
        
        {/* Footer - always at bottom */}
        <Footer/>
      </div>
    </div>
  );
}

export default App;