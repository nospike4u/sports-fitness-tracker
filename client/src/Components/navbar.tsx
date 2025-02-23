import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { HiOutlineDocumentText } from "react-icons/hi";
import "./Navbar.css";
import logo from "./../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <div className="navbar flex justify-between items-center px-[30px]">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="compass logo"
            className="btn btn-ghost btn-circle h-[40px]"
          />
          <span className="compass ml-2">Compass</span>
        </Link>
      </div>
      <div className="doc flex items-center ml-[70%]">
        <Link to="/documentation" className="flex space-x-1 items-center">
          <HiOutlineDocumentText className="doc-icon text-xl" />
          <span className="text-m">Documentation</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        {/* Dropdown Container */}
        <div className="dropdown dropdown-end">
          {/* Trigger Button */}
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            onClick={toggleDropdown}
          >
            <CgProfile className="profile-icon text-3xl hover:scale-105" />
          </label>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-m dropdown-content mt-2 p-2 shadow bg-base-100 rounded-box w-52 "
            >
              <li>
                <Link to="/editprofile" className="justify-between">
                  <span>Profile</span>
                </Link>
                {/* <span className="badge bg-green-500 ">New</span> */}
              </li>

              <li>
                <Link to="/login">Logout</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;