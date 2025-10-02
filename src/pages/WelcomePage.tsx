import React from "react";
import { useNavigate } from "react-router-dom";
import type { PlanNode } from "../util/types";
import Card from "../components/Card";
import LottieFiles from "../components/LottieFiles";

interface WelcomePageProps {
  plans: PlanNode[];
}

const WelcomePage: React.FC<WelcomePageProps> = ({ plans }) => {
  const navigate = useNavigate();
  const hasPlans = plans && plans.length > 0;
  return (
    <Card>
      {!hasPlans && (
        <div className="mb-6 text-center flex justify-center items-center">
          <LottieFiles src="/welcomePanda.json" height={300} width={300} />
          <LottieFiles src="/welcomeText.json" height={400} width={400} />
        </div>
      )}
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
