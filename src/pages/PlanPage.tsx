import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import type { PlanNode } from "../util/types";
import { keyElements } from "../assets/KeyElements";
import Button from "../components/Button";
import JsonDisplay from "../components/JsonDisplay";

interface PlanPageProps {
  plans: PlanNode[];
}

const PlanPage: React.FC<PlanPageProps> = ({ plans }) => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  if (!plans || plans.length === 0) {
    navigate("/");
  }

  const plan = plans.find((p) => p.id === planId);

  const [selectedTrnsIndex, setSelectedTrnsIndex] = useState(0);
  const [selectedContextIndex, setSelectedContextIndex] = useState(0);
  const [showJsonDisplay, setShowJsonDisplay] = useState(false);
  const [selectedJsonIndex, setSelectedJsonIndex] = useState(0);

  if (!plan) {
    return (
      <Card className="w-[85vw] mx-auto my-10 p-6">
        <p>Plan {planId} not found.</p>
      </Card>
    );
  }

  const trns = plan.trnsDetails[selectedTrnsIndex];
  const contexts = trns.context;
  const context = contexts[selectedContextIndex];

  // Find matching keyElements entry for current transaction type
  const keyElementEntry = keyElements.find(
    (ke) => ke.trnsType === trns.trnsType
  );

  // Helper function to extract cell value, including first array object if needed
  function getCellValue(instance: any, key: string) {
    // Example keys that map to nested arrays in example: WP-ACTL-CV-CAT-ID etc
    const nestedArrayKeys = [
      "WP-ACTL-CV-CAT-ID",
      "WP-ACTL-CV-ID",
      "WP-ACTL-PRT-PR-AT",
    ];

    if (nestedArrayKeys.includes(key)) {
      // console.log("instance for nested key:", instance);

      const cvCat = instance["WS-CvCat"] || instance.WS_CvCat;
      const cv = instance["WS-PrsnCv"] || instance.WS_PrsnCv;
      const pr = instance["WS-ActlPr"] || instance.WS_ActlPr;
      // console.log("cvCat:", cvCat, "cv:", cv, "pr:", pr);
      // console.log(
      //   "instance['WS-CvCat']  = " + JSON.stringify(instance["WS-CvCat"])
      // );
      // console.log(
      //   "instance['WS-PrsnCv']  = " + JSON.stringify(instance["WS-PrsnCv"])
      // );
      // console.log(
      //   "instance['WS-ActlPr']  = " + JSON.stringify(instance["WS-ActlPr"])
      // );
      // console.log(key);

      if (
        key === "WP-ACTL-CV-CAT-ID" &&
        Array.isArray(cvCat) &&
        cvCat.length > 0
      ) {
        return cvCat[0][key] ?? "—";
      } else if (
        key === "WP-ACTL-CV-ID" &&
        Array.isArray(cv) &&
        cv.length > 0
      ) {
        return cv[0][key] ?? "—";
      } else if (
        key === "WP-ACTL-PRT-PR-AT" &&
        Array.isArray(pr) &&
        pr.length > 0
      ) {
        return pr[0][key] ?? "—";
      }
      return "—";
    }
    return instance[key] ?? "—";
  }

  // Sort dataAssignments descending; last one comes first and rendered larger
  const sortedAssignments = context?.dataAssignments
    ? [...context.dataAssignments].reverse()
    : [];

  // Handle cell row click to show JsonDisplay
  const handleRowClick = (index: number) => {
    console.log("Row clicked:", index);

    setSelectedJsonIndex(index);
    setShowJsonDisplay(true);
    console.log("showJsonDisplay set to true");
  };

  // Back button handler to hide JsonDisplay or navigate back
  const handleBack = () => {
    if (showJsonDisplay) {
      setShowJsonDisplay(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <Button onClick={handleBack} className="ml-14 ">
        &larr; Back
      </Button>
      <Card>
        <h2 className="text-2xl font-semibold mb-6">
          {plan.name} - Transactions
        </h2>

        {/* Horizontal tabs for transactions */}
        <div className="flex border-b-2 mb-6">
          {plan.trnsDetails.map((t, idx) => (
            <Button
              key={t.trnsId}
              onClick={() => {
                setSelectedTrnsIndex(idx);
                setSelectedContextIndex(0);
                setShowJsonDisplay(false);
              }}
              className={`px-4 py-2 mr-4 font-semibold ${
                idx === selectedTrnsIndex
                  ? "border-b-4 border-indigo-600 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600"
              } focus:outline-none`}
            >
              {t.name}
            </Button>
          ))}
        </div>

        {/* Vertical tabs for context and data table */}
        <div className="flex gap-6">
          <div className="flex flex-col border-r pr-4 min-w-[150px]">
            {contexts.map((ctx, idx) => (
              <Button
                key={ctx.name}
                onClick={() => {
                  setShowJsonDisplay(false);
                  setSelectedContextIndex(idx);
                }}
                className={`py-2 px-3 mb-2 text-left font-medium rounded ${
                  idx === selectedContextIndex
                    ? "bg-indigo-200 text-indigo-900"
                    : "text-gray-700 hover:bg-indigo-50"
                } focus:outline-none`}
              >
                {ctx.name}
              </Button>
            ))}
          </div>
          {!showJsonDisplay ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              {sortedAssignments.length > 0 && keyElementEntry ? (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {keyElementEntry.keyElement.map((key) => (
                        <th scope="col" key={key.key} className="px-6 py-3">
                          {key.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssignments.map((instance, idx) => {
                      const isLast = idx === 0;

                      return (
                        <tr
                          className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                            isLast ? "text-lg font-bold shadow-lg" : ""
                          }`}
                          key={idx}
                          onClick={() => handleRowClick(idx)}
                        >
                          {keyElementEntry.keyElement.map((key) => {
                            return (
                              <td
                                className="px-6 py-4"
                                key={key.key}
                                title={
                                  typeof instance[key.key] === "string"
                                    ? instance[key.key]
                                    : undefined
                                }
                              >
                                {getCellValue(instance, key.key)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="p-4">
                  No data or configuration available for this transaction.
                </p>
              )}
            </div>
          ) : (
            <JsonDisplay
              data={sortedAssignments}
              currentInstanceIndex={selectedJsonIndex}
              setCurrentInstanceIndex={setSelectedJsonIndex}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default PlanPage;
