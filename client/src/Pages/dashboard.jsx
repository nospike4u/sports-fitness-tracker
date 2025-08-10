import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos/');
        console.log(response.data); // Log the response data to check its structure
        setActivities(response.data); // Ensure this data is an array
      } catch (error) {
        console.error("Error in retrieving data", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      <h1 className="text-red-500 text-xl font-bold">Data</h1>
      <ul>
        {activities.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
