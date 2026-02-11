import React, { useState, useEffect } from "react";
import axios from "axios";
import FitbitConnection from "../Components/FitbitConnection";
import FitbitData from "../Components/FitbitData";
import CorporatePartnerBadge from "../Components/CorporatePartnerBadge";
import PerksAndClasses from "../Components/PerksAndClasses";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);

  // Mock user ID - in real app, get from authentication context
  const mockUserId = "507f1f77bcf86cd799439011";

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos/",
        );
        console.log(response.data); // Log the response data to check its structure
        setActivities(response.data.slice(0, 5)); // Limit to first 5 items
      } catch (error) {
        console.error("Error in retrieving data", error);
      }
    };

    fetchActivities();

    // Mock user data - including corporate membership info
    setUser({
      id: mockUserId,
      name: "Dominic Spike",
      corporateMember: true,
      companyName: "Seibert Media",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
            Sports Fitness Tracker Dashboard
          </h1>
          {user && (
            <div className="space-y-3">
              <p className="text-[var(--muted-text)]">
                Welcome back, {user.name}!
              </p>
              {user.corporateMember && (
                <CorporatePartnerBadge companyName={user.companyName} />
              )}
            </div>
          )}
        </div>

        {/* Fitbit Connection Section */}
        <div className="mb-8">
          <FitbitConnection userId={mockUserId} />
        </div>

        {/* Perks & Classes Section */}
        <div className="mb-8">
          <PerksAndClasses
            userType={user?.corporateMember ? "corporate" : "individual"}
          />
        </div>

        {/* Fitbit Data Section */}
        <div className="mb-8">
          <FitbitData userId={mockUserId} />
        </div>

        {/* Sample Data Section */}
        <div className="bg[var(--color-bg)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
            Sample Activities
          </h2>
          <ul className="space-y-2">
            {activities.map((item) => (
              <li
                key={item.id}
                className="p-3 bg-[var(--color-bg)] border-[var(--border)] rounded border-2"
              >
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
