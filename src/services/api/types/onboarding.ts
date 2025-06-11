// src/services/types/onboarding.ts
export enum OnboardingEntityType {
  USER = "USER",
  TENANT = "TENANT",
}

export enum OnboardingStepStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
}

export interface Onboarding {
  id: string;
  entityType: OnboardingEntityType;
  entityId: string;
  name: string;
  description: string;
  stepKey: string;
  order: number;
  isSkippable: boolean;
  isRequired: boolean;
  status: OnboardingStepStatus;
  metadata: Record<string, any> | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  performedByUser?: { id: string };
  performedByTenant?: { id: string };
}

export type OnboardingStatus = {
  steps: Onboarding[];
  completedCount: number;
  totalCount: number;
  requiredCompleted: number;
  totalRequired: number;
  percentage: number;
  currentStep: Onboarding | null;
};
