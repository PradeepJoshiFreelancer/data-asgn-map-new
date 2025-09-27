import type { DataAssignment, PlanNode } from "./types";

export function groupAssignments(
  dataAssignments: DataAssignment[]
): PlanNode[] {
  const planMap: Record<string, any> = {};

  dataAssignments.forEach((instance) => {
    const planId = String(instance["WS-PLAN-ID"]);
    const planName = instance["WS-PLAN-LDSC-TX"];
    const trnsId = String(instance["WS-TRNS-ID"]);
    const trnsName = instance["WS-TRNS-LDSC-TX"] || `Transaction ${trnsId}`;
    const trnsType = instance["WS-TRNS-TYPE"] || `Transaction ${trnsId}`;
    const cntxId = String(instance["WS-CNTX-ID"]);

    if (!planMap[planId]) {
      planMap[planId] = {
        id: planId,
        name: planName,
        trnsDetails: [],
        trnsMap: {},
      };
    }
    const plan = planMap[planId];

    if (!plan.trnsMap[trnsId]) {
      plan.trnsMap[trnsId] = {
        trnsId,
        name: trnsName,
        trnsType,
        context: [],
        cntxMap: {},
      };
      plan.trnsDetails.push(plan.trnsMap[trnsId]);
    }
    const trns = plan.trnsMap[trnsId];

    if (!trns.cntxMap[cntxId]) {
      trns.cntxMap[cntxId] = {
        name: cntxId,
        dataAssignments: [],
      };
      trns.context.push(trns.cntxMap[cntxId]);
    }
    trns.cntxMap[cntxId].dataAssignments.push(instance);
  });

  // Clean up maps before returning
  Object.values(planMap).forEach((plan) => {
    plan.trnsDetails.forEach((trns: any) => {
      delete trns.cntxMap;
    });
    delete plan.trnsMap;
  });
  // console.log("formatted data:", JSON.stringify(planMap));

  return Object.values(planMap) as PlanNode[];
}
