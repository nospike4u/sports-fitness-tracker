import React, { useState } from "react";
import {
  BadgePercent,
  Calendar,
  CalendarCheck,
  Dumbbell,
  Flower,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Ticket,
  Zap,
} from "lucide-react";

const PerksAndClasses = ({ userType = 'corporate' }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Mock data for classes
  const upcomingClasses = [
    {
      id: 1,
      title: 'Power Yoga',
      instructor: 'Sarah Miller',
      time: 'Today, 6:00 PM',
      duration: '60 min',
      spotsLeft: 3,
      corporatePriority: true,
      difficulty: 'Intermediate',
      icon: Flower,
    },
    {
      id: 2,
      title: 'HIIT Cardio Blast',
      instructor: 'Mike Johnson',
      time: 'Tomorrow, 7:00 AM',
      duration: '45 min',
      spotsLeft: 8,
      corporatePriority: false,
      difficulty: 'Advanced',
      icon: Zap,
    },
    {
      id: 3,
      title: 'Mindful Meditation',
      instructor: 'Lisa Chen',
      time: 'Tomorrow, 12:30 PM',
      duration: '30 min',
      spotsLeft: 5,
      corporatePriority: true,
      difficulty: 'All Levels',
      icon: Sparkles,
    },
    {
      id: 4,
      title: 'Strength Training',
      instructor: 'Tom Weber',
      time: 'Tomorrow, 6:30 PM',
      duration: '60 min',
      spotsLeft: 2,
      corporatePriority: true,
      difficulty: 'Intermediate',
      icon: Dumbbell,
    }
  ];

  // Mock data for perks
  const corporatePerks = [
    {
      id: 1,
      title: 'TK MAXX - 15% Off Athletic Wear',
      description: 'Show your member badge at checkout',
      icon: Ticket,
      category: 'Shopping'
    },
    {
      id: 2,
      title: 'Priority Class Booking',
      description: 'Book up to 7 days in advance',
      icon: BadgePercent,
      category: 'Benefits'
    },
    {
      id: 3,
      title: 'Healthy Bites Café - Free Smoothie',
      description: 'After every 5 classes attended',
      icon: CalendarCheck,
      category: 'Food & Drink'
    },
    {
      id: 4,
      title: 'Monthly Wellness Workshop',
      description: 'Exclusive nutrition & recovery sessions',
      icon: GraduationCap,
      category: 'Education'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Classes Section */}
      <div className="bg-[var(--color-bg)] rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-color)]">
            Upcoming Classes
          </h2>
          <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="relative p-4  dark:bg-slate-900 dark:text-slate-100 rounded-lg border border-gray-200/50 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => setSelectedClass(classItem.id)}
            >
              {/* Corporate Priority Badge */}
              {/* {classItem.corporatePriority && userType === 'corporate' && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Priority
                  </span>
                </div>
              )} */}

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg dark:bg-blue-900/50">
                  {React.createElement(classItem.icon, {
                    className: "w-6 h-6 text-blue-600 dark:text-blue-200",
                  })}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-color)] mb-1">
                    {classItem.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-text)] mb-2">
                    with {classItem.instructor}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(classItem.difficulty)}`}>
                      {classItem.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200">
                      {classItem.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="inline-flex items-center gap-2 text-[var(--muted-text)]">
                        <Calendar className="w-4 h-4" />
                        {classItem.time}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className={`font-medium ${classItem.spotsLeft <= 3 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                        {classItem.spotsLeft} spots left
                      </span>
                    </div>
                  </div>

                  <button className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg text-sm font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perks Section */}
      {userType === 'corporate' && (
        <div className="bg-[var(--color-bg)] rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-color)] mb-1">
              Your Corporate Benefits
            </h2>
            <p className="text-sm text-[var(--muted-text)]">
              Exclusive perks as part of your company wellness program
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {corporatePerks.map((perk) => (
              <div
                key={perk.id}
                className="p-4 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-indigo-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                    {React.createElement(perk.icon, {
                      className: "w-5 h-5 text-indigo-600 dark:text-indigo-300",
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--text-color)] text-sm">
                        {perk.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted-text)] mb-2">
                      {perk.description}
                    </p>
                    <span className="inline-block text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {perk.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company Challenge Banner */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">February Team Challenge 🏆</h3>
                <p className="text-sm opacity-90">
                  Your team is ranked #2! Complete 3 more classes this week to take the lead.
                </p>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerksAndClasses;
