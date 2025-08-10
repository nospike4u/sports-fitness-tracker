import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [img, setImg] = useState();

  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/users/`);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error in retrieving data", error);
      }
    };
    fetchUsers();
  }, []);


  
    const imageUrl = `https://thispersondoesnotexist.com/`;

    const fetchImage = async () => {
      const res = await fetch(imageUrl);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImg(imageObjectURL);
    };
  
    useEffect(() => {
      fetchImage();
    }, []);

  return (
    <>
      <div>
        <h1 className="font-bold text-2xl">Return all users</h1>
        <ol>
          {users.map((user) => (
            <div className="flex flex-col my-6 p-10 bg-white shadow-sm border border-slate-200 rounded-lg w-96 hover:cursor-pointer">
              <li key={user.id}>
                <img src={imageUrl}></img>
                {`${user.first_name} ${user.last_name}`}
                <Link to={user.first_name}></Link>
              </li>
            </div>
          ))}
        </ol>
      </div>
    </>
  );
};

export default Users;
