import React from "react";
import Button from "./Button";

interface JsonDisplayProps {
  data: any[]; // entire filtered data list for current tab
  currentInstanceIndex: number;
  setCurrentInstanceIndex: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}
console.log("Inside JsonDisplay component");

const backgroundColors = [
  "bg-purple-100",
  "bg-indigo-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-pink-100",
];

// Helper to check if primitive type
const isPrimitive = (val: any) =>
  val === null || ["string", "number", "boolean"].includes(typeof val);

// Recursively collects keys from nested objects
const collectKeys = (dataArray: Array<any>): string[] => {
  const keysSet = new Set<string>();

  function recurse(obj: any, prefix: string) {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keysSet.add(fullKey);
        if (value && typeof value === "object" && !isPrimitive(value)) {
          recurse(value, fullKey);
        }
      });
    }
  }

  for (const data of dataArray) {
    recurse(data, "");
  }
  return Array.from(keysSet);
};

// Retrieve value for nested key (dot separated)
const getValueByKey = (data: any, key: string): any => {
  if (!data) return null;
  const keys = key.split(".");
  let current = data;
  for (let k of keys) {
    if (current && k in current) {
      current = current[k];
    } else {
      return null;
    }
  }
  return current;
};

// Renders value recursively with colored backgrounds for nested objects
const renderValue = (value: any, level = 0): React.ReactNode => {
  if (value === null || value === undefined)
    return <span className="text-gray-400">No Data</span>;
  if (isPrimitive(value)) return <span>{String(value)}</span>;

  // For objects or arrays, recursively render keys and values with indentation and background color
  if (Array.isArray(value)) {
    return (
      <div
        className={`rounded p-1 mb-1 ${
          backgroundColors[level % backgroundColors.length]
        }`}
      >
        {value.map((item, idx) => (
          <div
            key={idx}
            className="pl-4 border-l border-indigo-300 mb-1 break-words"
          >
            {renderValue(item, level + 1)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`rounded p-1 ${
        backgroundColors[level % backgroundColors.length]
      }`}
    >
      {Object.entries(value).map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between pl-4 border-l border-indigo-300 py-0.5 break-words"
        >
          <span className="font-semibold text-indigo-900 max-w-xs break-words">
            {k}
          </span>
          <span className="max-w-xs break-words">
            {renderValue(v, level + 1)}
          </span>
        </div>
      ))}
    </div>
  );
};

const JsonDisplay: React.FC<JsonDisplayProps> = ({
  data,
  currentInstanceIndex,
  setCurrentInstanceIndex,
}) => {
  const prevInstance =
    currentInstanceIndex > 0 ? data[currentInstanceIndex - 1] : null;
  const currentInstance = data[currentInstanceIndex] || null;
  const nextInstance =
    currentInstanceIndex < data.length - 1
      ? data[currentInstanceIndex + 1]
      : null;

  const allKeys = collectKeys([prevInstance, currentInstance, nextInstance]);

  if (allKeys.length === 0) return null;

  // Navigation handlers for instances inside tab
  const handelPrevClick = () => {
    setCurrentInstanceIndex((idx) => Math.max(idx - 1, 0));
  };

  const handelNextClick = () => {
    setCurrentInstanceIndex((idx) => Math.min(idx + 1, data.length - 1));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <Button
          variant="secondary"
          onClick={handelPrevClick}
          disabled={currentInstanceIndex === 0}
        >
          Previous
        </Button>

        <span className="text-indigo-600 font-semibold text-lg self-center">
          {currentInstanceIndex + 1} of {data.length}
        </span>

        <Button
          variant="primary"
          onClick={handelNextClick}
          disabled={currentInstanceIndex === data.length - 1}
        >
          Next
        </Button>
      </div>
      <div className="overflow-auto max-w-full">
        <table className="table-fixed border-collapse border border-gray-300 w-full text-sm min-w-full">
          <thead>
            <tr className="bg-indigo-100 sticky top-0">
              <th className="w-1/4 border border-gray-300 px-3 py-1 sticky left-0 bg-indigo-100 z-10 text-left min-w-[200px]">
                Key
              </th>
              <th className="w-1/4 border border-gray-300 px-3 py-1 text-left min-w-[300px] break-words">
                Previous
              </th>
              <th className="w-1/4 border border-gray-300 px-3 py-1 text-left min-w-[300px] break-words">
                Current
              </th>
              <th className="w-1/4 border border-gray-300 px-3 py-1 text-left min-w-[300px] break-words">
                Next
              </th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key) => (
              <tr key={key} className="hover:bg-indigo-50 align-top">
                <td className="border border-gray-300 px-3 py-1 font-semibold sticky left-0 bg-white z-5 max-w-xs break-words min-w-[200px]">
                  {key.split(".").slice(-1)[0]}
                </td>
                <td className="border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px]">
                  {renderValue(getValueByKey(prevInstance, key))}
                </td>
                <td className="border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px] text-cyan-600">
                  {renderValue(getValueByKey(currentInstance, key))}
                </td>
                <td className="border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px]">
                  {renderValue(getValueByKey(nextInstance, key))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JsonDisplay;
