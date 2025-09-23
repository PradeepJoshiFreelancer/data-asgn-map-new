import React, { useState, useEffect, useRef } from "react";
import data from "./assets/dataAssignments.json";
import Tabs from "./components/Tabs";
import Button from "./components/Button";
import Card from "./components/Card";
import JsonDisplay from "./components/JsonDisplay";

interface DataAssignment {
  "Trns-Id": number;
  "Cntx-Id"?: number; // Used for slide detection
  [key: string]: any;
}

const App: React.FC = () => {
  const [dataAssignments, setDataAssignments] = useState<DataAssignment[]>([]);
  const [uniqueTrnsIds, setUniqueTrnsIds] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("");
  const [currentInstanceIndex, setCurrentInstanceIndex] = useState<number>(0);
  const [animationClass, setAnimationClass] = useState<string>("opacity-0");
  const prevCntxIdRef = useRef<number | undefined>(undefined);

  // Load default data on mount
  useEffect(() => {
    if (data && data.dataAssignments) {
      setDataAssignments(data.dataAssignments);
    }
  }, []);

  // Update unique IDs and reset navigation when data changes
  useEffect(() => {
    const uniqueIdsSet = new Set(
      dataAssignments.map((item) => item["Trns-Id"].toString())
    );
    const uniqueIdsArray = Array.from(uniqueIdsSet);
    setUniqueTrnsIds(uniqueIdsArray);
    if (!uniqueIdsArray.includes(currentTab)) {
      setCurrentTab(uniqueIdsArray[0] || "");
      setCurrentInstanceIndex(0);
    } else {
      setCurrentInstanceIndex(0);
    }
  }, [dataAssignments]);

  // Filter dataAssignments for the current tab Trns-Id
  const filteredItems = dataAssignments.filter(
    (item) => item["Trns-Id"].toString() === currentTab
  );

  const currentItem = filteredItems[currentInstanceIndex] || null;

  // Handle JSON file upload to update dataAssignments
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.dataAssignments && Array.isArray(json.dataAssignments)) {
          setDataAssignments(json.dataAssignments);
        } else {
          alert("Invalid JSON file format: missing dataAssignments array");
        }
      } catch (error) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Reset animation on currentItem change or index change
  useEffect(() => {
    if (!currentItem) return;

    setAnimationClass("opacity-0");

    // Animation only on tab change - so when currentTab changes, trigger animation
    const timeoutAnim = setTimeout(
      () => setAnimationClass("fall-from-top"),
      10
    );

    prevCntxIdRef.current = currentItem["Cntx-Id"];

    return () => clearTimeout(timeoutAnim);
  }, [currentTab]);

  // Navigation handlers for instances inside tab
  const prevInstance = () => {
    setCurrentInstanceIndex((idx) => Math.max(idx - 1, 0));
  };

  const nextInstance = () => {
    setCurrentInstanceIndex((idx) =>
      Math.min(idx + 1, filteredItems.length - 1)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-white to-indigo-50 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
        Data Assignments Viewer
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="file"
          accept="application/json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {uniqueTrnsIds.length > 0 && (
        <Tabs
          uniqueIds={uniqueTrnsIds}
          currentTab={currentTab}
          onSelectTab={(id) => {
            setCurrentTab(id);
            // Reset index when tab changes
            setCurrentInstanceIndex(0);
          }}
        />
      )}

      <div className="mt-10 max-w-4xl mx-auto min-h-[380px]">
        {currentItem ? (
          <Card animationClass={animationClass}>
            <>
              <div className="flex justify-between mb-6">
                <Button
                  variant="secondary"
                  onClick={prevInstance}
                  disabled={currentInstanceIndex === 0}
                >
                  Previous
                </Button>

                <span className="text-indigo-600 font-semibold text-lg self-center">
                  {currentInstanceIndex + 1} of {filteredItems.length}
                </span>

                <Button
                  variant="primary"
                  onClick={nextInstance}
                  disabled={currentInstanceIndex === filteredItems.length - 1}
                >
                  Next
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3 text-indigo-700">
                  Trns-Id: {currentItem["Trns-Id"]}
                </h2>
                <h3 className="mb-4 text-indigo-500 font-medium">
                  Cntx-Id: {currentItem["Cntx-Id"] ?? "N/A"}
                </h3>
                <div className="max-h-96 overflow-auto rounded bg-indigo-50 p-4">
                  <JsonDisplay
                    data={filteredItems}
                    currentInstanceIndex={currentInstanceIndex}
                  />
                </div>
              </div>
            </>
          </Card>
        ) : (
          <p className="text-center mt-16 text-indigo-500 text-lg font-light">
            No data available for the selected tab.
          </p>
        )}
      </div>

      {/* animation CSS styles */}
      <style>{`
        .fall-from-top {
  animation: fallFromTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fallFromTop {
  0% {
    opacity: 0;
    transform: translateY(-200px) rotateX(45deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}


        .slide-right {
          animation: slideRight 0.5s ease forwards;
        }

        .slide-left {
          animation: slideLeft 0.5s ease forwards;
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-30px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideLeft {
          0% {
            transform: translateX(30px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
