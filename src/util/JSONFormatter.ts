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
        _lastCntxId: null, // for tracking within this trnsId
      };
      plan.trnsDetails.push(plan.trnsMap[trnsId]);
    }

    const trns = plan.trnsMap[trnsId];

    // If this is the first or cntxId has changed, create new context group
    if (trns._lastCntxId !== cntxId) {
      trns.context.push({
        name: cntxId,
        dataAssignments: [],
      });
      trns._lastCntxId = cntxId;
    }
    // Push dataAssignment to current context group
    trns.context[trns.context.length - 1].dataAssignments.push(instance);
  });

  // Clean up helper properties before returning
  Object.values(planMap).forEach((plan) => {
    plan.trnsDetails.forEach((trns: any) => {
      delete trns._lastCntxId;
      // No cntxMap needed anymore
    });
    delete plan.trnsMap;
  });

  return Object.values(planMap) as PlanNode[];
}
