import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState([]);
  const [deleteUser, setDeleteUser] = useState();

  const { id } = useParams();

  useEffect(() => {
    const fetchOneUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/users/${id}`
        );
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("User not found");
      }
    };
    fetchOneUser();
  }, []);

  const imageUrl = `https://thispersondoesnotexist.com`;

  useEffect(() => {
    const deleteUser = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/v1/users/${id}`
        );
      } catch (error) {}
    };
    deleteUser();
  }, []);


  return (
    <div>
      <h1 className="font-bold text-2xl">Return one user</h1>
      <ol>
        <div className="flex flex-col my-6 p-10 bg-white shadow-sm border border-slate-200 rounded-lg w-96 hover:cursor-pointer">
          <li key={user.id}>
            <img src={imageUrl}></img>
            {`${user.first_name} ${user.last_name}`}
            <button onClick={deleteUser}
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 mt-7"
              type="button"
            >
              Delete User
            </button>
            <Link to={user.first_name}></Link>
          </li>
        </div>
      </ol>
    </div>
  );
};

export default User;
