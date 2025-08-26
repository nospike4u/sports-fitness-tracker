import React, { useState, useEffect } from "react";
import axios from "axios";
import FitbitConnection from "../Components/FitbitConnection";
import FitbitData from "../Components/FitbitData";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);

  // Mock user ID - in real app, get from authentication context
  const mockUserId = "507f1f77bcf86cd799439011";

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos/');
        console.log(response.data); // Log the response data to check its structure
        setActivities(response.data.slice(0, 5)); // Limit to first 5 items
      } catch (error) {
        console.error("Error in retrieving data", error);
      }
    };

    fetchActivities();

    // Mock user data
    setUser({
      id: mockUserId,
      name: "Dominic Spike"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sports Fitness Tracker Dashboard
          </h1>
          {user && (
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          )}
        </div>

        {/* Fitbit Connection Section */}
        <div className="mb-8">
          <FitbitConnection userId={mockUserId} />
        </div>

        {/* Fitbit Data Section */}
        <div className="mb-8">
          <FitbitData userId={mockUserId} />
        </div>

        {/* Sample Data Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Activities</h2>
          <ul className="space-y-2">
            {activities.map(item => (
              <li key={item.id} className="p-3 bg-gray-50 rounded border">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
