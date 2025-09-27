export interface ContextGrouped {
  name: string;
  dataAssignments: DataAssignment[];
}

export interface TrnsDetailGrouped {
  trnsId: string;
  name: string;
  trnsType: string;
  context: ContextGrouped[];
}

export interface PlanGrouped {
  id: string;
  name: string;
  trnsDetails: TrnsDetailGrouped[];
}

export interface DataAssignment {
  [key: string]: any;
  "WS-PLAN-ID": string | number;
  "WS-PLAN-LDSC-TX": string;
  "WS-PLAN-BRND-CD": string;
  "WS-TRNS-ID": string | number;
  "WS-TRNS-LDSC-TX"?: string;
  "WS-CNTX-ID": string | number;
  "WS-DATA-ASGN-ID": string | number;
}

export interface ContextNode {
  name: string;
  dataAssignments: DataAssignment[];
}

export interface TrnsDetailNode {
  trnsId: string;
  name: string;
  trnsType: string;
  context: ContextNode[];
}

export interface PlanNode {
  id: string;
  name: string;
  trnsDetails: TrnsDetailNode[];
}
