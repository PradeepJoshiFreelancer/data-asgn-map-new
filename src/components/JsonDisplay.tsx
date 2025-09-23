import React from "react";

interface JsonDisplayProps {
  data: any[];
  currentInstanceIndex: number;
}

const backgroundColors = [
  "bg-purple-100",
  "bg-indigo-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-pink-100",
];

const isPrimitive = (val: any) =>
  val === null || ["string", "number", "boolean"].includes(typeof val);

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

// Deep equality check for values (primitive or object)
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (isPrimitive(a) || isPrimitive(b)) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
};

const renderValue = (value: any, level = 0): React.ReactNode => {
  if (value === null || value === undefined)
    return <span className="text-gray-400">No Data</span>;
  if (isPrimitive(value)) return <span>{String(value)}</span>;

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

  return (
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
          {allKeys.map((key) => {
            const prevValue = getValueByKey(prevInstance, key);
            const currentValue = getValueByKey(currentInstance, key);

            // Determine if value changed compared to prev instance
            const changed = !deepEqual(prevValue, currentValue);

            return (
              <tr key={key} className="hover:bg-indigo-50 align-top">
                <td className="border border-gray-300 px-3 py-1 font-semibold sticky left-0 bg-white z-5 max-w-xs break-words min-w-[200px]">
                  {key.split(".").slice(-1)[0]}
                </td>
                <td className="border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px]">
                  {renderValue(prevValue)}
                </td>
                <td
                  className={`border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px] ${
                    changed ? "bg-yellow-200" : ""
                  }`}
                >
                  {renderValue(currentValue)}
                </td>
                <td className="border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px]">
                  {renderValue(getValueByKey(nextInstance, key))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default JsonDisplay;
