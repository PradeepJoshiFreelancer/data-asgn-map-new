import React from "react";
import { useNavigate } from "react-router-dom";
import type { PlanNode } from "../util/types";
import Card from "../components/Card";

interface WelcomePageProps {
  plans: PlanNode[];
}

const WelcomePage: React.FC<WelcomePageProps> = ({ plans }) => {
  const navigate = useNavigate();

  return (
    <Card className="w-[85vw] min-h-[60vh] mx-auto my-8 p-8 flex flex-col">
      <h1 className="mb-6 text-3xl font-semibold">Welcome</h1>
      <div className="grid grid-cols-3 gap-4">
        {plans.map(({ id, name }) => (
          <div
            key={id}
            className="cursor-pointer rounded-lg p-6 font-bold flex items-center justify-center select-none transition-colors bg-indigo-100 hover:bg-indigo-300"
            onClick={() => navigate(`/${id}`)}
          >
            {name}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WelcomePage;
