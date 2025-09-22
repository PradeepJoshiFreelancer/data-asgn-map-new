import React, { useState } from "react";

interface JsonDisplayProps {
  data: any;
  level?: number;
  parentKey?: string;
}

const backgroundColors = [
  "bg-orange-100",
  "bg-indigo-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-pink-100",
];

const JsonDisplay: React.FC<JsonDisplayProps> = ({
  data,
  level = 0,
  parentKey = "",
}) => {
  const isPrimitive = (val: any) => {
    return val === null || ["string", "number", "boolean"].includes(typeof val);
  };

  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());

  const toggleCollapse = (key: string) => {
    const newSet = new Set(collapsedKeys);
    if (collapsedKeys.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setCollapsedKeys(newSet);
  };

  const bgColor = backgroundColors[level % backgroundColors.length];

  if (Array.isArray(data)) {
    return (
      <div className="pl-8">
        {data.map((item, index) => (
          <JsonDisplay
            key={`${parentKey}-${index}`}
            data={item}
            level={level + 1}
            parentKey={`${parentKey}-${index}`}
          />
        ))}
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    return (
      <div className={`rounded-md p-2 ${bgColor} my-1`}>
        {Object.entries(data).map(([key, value]) => {
          const compositeKey = `${parentKey}-${key}`;

          if (!isPrimitive(value)) {
            const isCollapsed = collapsedKeys.has(compositeKey);
            return (
              <div
                key={compositeKey}
                className="border-b border-gray-300 py-1 cursor-pointer"
              >
                <div
                  className="flex justify-center items-center"
                  onClick={() => toggleCollapse(compositeKey)}
                  title={isCollapsed ? "Expand" : "Collapse"}
                >
                  <div className="w-1/2 pr-6 text-right font-semibold text-indigo-900 select-none">
                    {isCollapsed ? "+" : "-"} {key}
                  </div>
                  <div className="w-1/2 pl-6 text-indigo-900 select-none">
                    Object
                  </div>
                </div>
                {!isCollapsed && (
                  <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
                    <JsonDisplay
                      data={value}
                      level={level + 1}
                      parentKey={compositeKey}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={compositeKey}
              className="flex justify-center border-b border-gray-300 py-1"
            >
              <div className="w-1/2 pr-10 text-right font-semibold text-indigo-900">
                {key}
              </div>
              :
              <div className="w-1/2 pl-10 text-indigo-900">
                {value?.toString()}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <span>{data?.toString()}</span>;
};

export default JsonDisplay;
