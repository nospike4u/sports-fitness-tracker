import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { HiOutlineDocumentText } from "react-icons/hi";
import logo from "../assets/radar_128dp_FFF_FILL0_wght400_GRAD0_opsz48.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar flex justify-between items-center py-[10px] px-[30px] bg-gray-800 rounded-md mb-16 relative">
      {/* Logo Section */}
      <div className="flex items-center cursor-pointer">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="compass logo"
            className="btn btn-ghost btn-circle h-[40px]"
          />
          <span className="compass ml-2 text-white">FitPulse</span>
        </Link>
      </div>
      
      {/* Center/Right Section */}
      <div className="flex items-center space-x-6">
        {/* Documentation Link */}
        <div className="flex items-center">
          <Link to="/documentation" className="flex space-x-1 items-center hover:text-gray-300 transition-colors">
            <HiOutlineDocumentText className="doc-icon text-xl text-white" />
            <span className="text-white">Documentation</span>
          </Link>
        </div>
        
        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end relative" ref={dropdownRef}>
          {/* Trigger Button */}
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            onClick={toggleDropdown}
          >
            <CgProfile className="profile-icon text-3xl hover:scale-105 text-white cursor-pointer" />
          </label>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52 absolute right-0 top-full z-50"
            >
              <li>
                <Link 
                  to="/editprofile" 
                  className="justify-between text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
