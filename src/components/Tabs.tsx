import React from "react";

interface TabsProps {
  uniqueIds: string[];
  currentTab: string;
  onSelectTab: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ uniqueIds, currentTab, onSelectTab }) => {
  return (
    <div className="flex justify-center space-x-4 border-b px-4 pb-3 overflow-x-auto">
      {uniqueIds.map((id) => (
        <button
          key={id}
          onClick={() => onSelectTab(id)}
          className={`px-5 py-2 rounded-t-lg font-semibold transition-colors duration-300 ${
            currentTab === id
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Trns-Id: {id}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
