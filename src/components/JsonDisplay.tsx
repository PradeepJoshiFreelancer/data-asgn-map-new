import React from "react";
import Button from "./Button";

interface JsonDisplayProps {
  data: any[]; // entire filtered data list for current tab
  currentInstanceIndex: number;
  setCurrentInstanceIndex: React.Dispatch<React.SetStateAction<number>>;
}

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
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        const arrPrefix = prefix ? `${prefix}[${idx}]` : `[${idx}]`;
        recurse(item, arrPrefix);
      });
    }
  }
  for (const data of dataArray) {
    recurse(data, "");
  }
  return Array.from(keysSet);
};

// Retrieve value for nested key (dot separated or array index)
const getValueByKey = (data: any, key: string): any => {
  if (!data) return null;
  // Split works with dot and bracket notation
  const parts = key
    .replace(/\.|\[|\]/g, (m) => (m === "." ? "." : m === "[" ? ".[" : ""))
    .split(".")
    .filter(Boolean);

  let current = data;
  for (let part of parts) {
    if (part.startsWith("[")) {
      const idx = parseInt(part.substr(1), 10);
      if (Array.isArray(current) && current.length > idx) {
        current = current[idx];
      } else {
        return null;
      }
    } else {
      if (current && part in current) {
        current = current[part];
      } else {
        return null;
      }
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

// Recursively check changes at field level
const getDiffFields = (
  prev: any,
  curr: any,
  prefix = ""
): Record<string, boolean> => {
  const diffs: Record<string, boolean> = {};
  if (isPrimitive(prev) || isPrimitive(curr)) {
    if (!deepEqual(prev, curr)) diffs[prefix] = true;
    return diffs;
  }
  if (Array.isArray(prev) && Array.isArray(curr)) {
    for (let i = 0; i < Math.max(prev.length, curr.length); i++) {
      const childPrefix = `${prefix}[${i}]`;
      Object.assign(diffs, getDiffFields(prev[i], curr[i], childPrefix));
    }
    return diffs;
  }
  if (typeof prev === "object" && typeof curr === "object" && prev && curr) {
    const keys = new Set([...Object.keys(prev), ...Object.keys(curr)]);
    for (const key of keys) {
      const childPrefix = prefix ? `${prefix}.${key}` : key;
      Object.assign(diffs, getDiffFields(prev[key], curr[key], childPrefix));
    }
    return diffs;
  }
  if (!deepEqual(prev, curr)) diffs[prefix] = true;
  return diffs;
};

// Renders value recursively with colored backgrounds for nested objects
const renderValue = (
  value: any,
  changedFields: Record<string, boolean>,
  keyPrefix: string,
  level = 0
): React.ReactNode => {
  const getBgStyle = (key: string) =>
    changedFields[key] ? "bg-yellow-100" : "";
  if (value === null || value === undefined)
    return (
      <span className={`className="text-gray-400" ${getBgStyle(keyPrefix)}`}>
        No Data
      </span>
    );
  if (isPrimitive(value))
    return <span className={getBgStyle(keyPrefix)}>{String(value)}</span>;
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
            style={{ marginLeft: 16 * level }}
            className={`pl-4 border-l border-indigo-300 mb-1 break-words ${getBgStyle(
              `${keyPrefix}[${idx}]`
            )}`}
          >
            [{idx}]{" "}
            {renderValue(
              item,
              changedFields,
              `${keyPrefix}[${idx}]`,
              level + 1
            )}
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
          className={`flex justify-between pl-4 border-l border-indigo-300 py-0.5 break-words ${getBgStyle(
            keyPrefix ? `${keyPrefix}.${k}` : k
          )}`}
        >
          <span className="font-semibold text-indigo-900 max-w-xs break-words">
            {k}:{" "}
          </span>
          <span className="max-w-xs break-words">
            {renderValue(
              v,
              changedFields,
              keyPrefix ? `${keyPrefix}.${k}` : k,
              level + 1
            )}
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

  const changedFields = prevInstance
    ? getDiffFields(prevInstance, currentInstance)
    : {};

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
                    {renderValue(
                      getValueByKey(prevInstance, key),
                      changedFields,
                      key
                    )}
                  </td>
                  <td
                    className={`border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px] text-cyan-600 ${
                      changed ? "bg-yellow-200" : ""
                    }`}
                  >
                    {renderValue(
                      getValueByKey(currentInstance, key),
                      changedFields,
                      key
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 max-w-xs break-words min-w-[300px]">
                    {renderValue(
                      getValueByKey(nextInstance, key),
                      changedFields,
                      key
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JsonDisplay;
