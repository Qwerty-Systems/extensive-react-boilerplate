export enum PlanType {
  FLAT_MONTHLY = "FLAT_MONTHLY",
  PER_WEIGHT = "PER_WEIGHT",
  TIERED = "TIERED",
  PREPAID = "PREPAID",
  CREDIT = "CREDIT",
}

export type RateStructure =
  | { type: "FLAT"; amount: number }
  | { type: "PER_UNIT"; rate: number }
  | { type: "CREDIT_RATE"; rate: number }
  | { type: "TIERED"; tiers: Tier[] }
  | { type: "PREPAID"; creditRate: number };

export type Tier = {
  from: number;
  to: number;
  rate: number;
};

export interface PaymentPlanEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string | null;
  name: string;
  tenant: { id: string };
  isActive: boolean;
  unit: string;
  minimumCharge: number;
  rateStructure?: RateStructure | null;
  type: PlanType;
}
