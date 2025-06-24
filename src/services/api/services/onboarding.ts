// import { useCallback } from "react";
// import useFetch from "../use-fetch";
// import { API_URL } from "../config";
// import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
// import { RequestConfigType } from "./types/request-config";
// import { Onboarding, OnboardingEntityType } from "../types/onboarding";

// // Initialize Tenant Onboarding
// export type InitializeTenantOnboardingRequest = {
//   tenantId: string;
// };

// export type InitializeTenantOnboardingResponse = Onboarding[];

// export function useInitializeTenantOnboarding() {
//   const fetch = useFetch();

//   return useCallback(
//     (
//       data: InitializeTenantOnboardingRequest,
//       requestConfig?: RequestConfigType
//     ) => {
//       return fetch(`${API_URL}/v1/onboarding/initialize-tenant`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<InitializeTenantOnboardingResponse>);
//     },
//     [fetch]
//   );
// }

// // Get Onboarding Status
// export type GetOnboardingStatusRequest = {
//   entityType: OnboardingEntityType;
//   entityId: string;
// };

// export type GetOnboardingStatusResponse = {
//   steps: Onboarding[];
//   completedCount: number;
//   totalCount: number;
//   requiredCompleted: number;
//   totalRequired: number;
//   percentage: number;
//   currentStep: Onboarding | null;
// };

// export function useGetOnboardingStatus() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: GetOnboardingStatusRequest, requestConfig?: RequestConfigType) => {
//       // const params = new URLSearchParams({
//       //   entityType: data.entityType,
//       //   entityId: data.entityId,
//       // });

//       return fetch(`${API_URL}/v1/onboarding/${data.entityId}/status`, {
//         method: "GET",
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<GetOnboardingStatusResponse>);
//     },
//     [fetch]
//   );
// }

// // Complete Step
// export type CompleteStepRequest = {
//   entityType: OnboardingEntityType;
//   entityId: string;
//   stepKey: string;
//   metadata?: Record<string, any>;
//   performedBy?: {
//     userId?: string;
//     tenantId?: string;
//   };
// };

// export type CompleteStepResponse = Onboarding;

// export function useCompleteStep() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: CompleteStepRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/onboarding/complete-step`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<CompleteStepResponse>);
//     },
//     [fetch]
//   );
// }

// // Skip Step
// export type SkipStepRequest = {
//   entityType: OnboardingEntityType;
//   entityId: string;
//   stepKey: string;
//   performedBy?: {
//     userId?: string;
//     tenantId?: string;
//   };
// };

// export type SkipStepResponse = Onboarding;

// export function useSkipStep() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: SkipStepRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/onboarding/skip-step`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<SkipStepResponse>);
//     },
//     [fetch]
//   );
// }

// // Reset Step
// export type ResetStepRequest = {
//   entityType: OnboardingEntityType;
//   entityId: string;
//   stepKey: string;
// };

// export type ResetStepResponse = Onboarding;

// export function useResetStep() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: ResetStepRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/onboarding/reset-step`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<ResetStepResponse>);
//     },
//     [fetch]
//   );
// }
import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";
import { Onboarding, OnboardingEntityType } from "../types/onboarding";

// Initialize Onboarding
export type InitializeOnboardingRequest = {
  entityType: OnboardingEntityType;
  entityId: string;
};

export type InitializeOnboardingResponse = Onboarding[];

export function useInitializeOnboarding() {
  const fetch = useFetch();

  return useCallback(
    (data: InitializeOnboardingRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/onboardings/initialize/${data.entityType.toLocaleLowerCase()}/${data.entityId}`,
        {
          method: "POST",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<InitializeOnboardingResponse>);
    },
    [fetch]
  );
}

// Get Onboarding Status
export type GetOnboardingStatusRequest = {
  entityType: OnboardingEntityType;
  entityId: string;
};

export type GetOnboardingStatusResponse = {
  steps: Onboarding[];
  completedCount: number;
  totalCount: number;
  requiredCompleted: number;
  totalRequired: number;
  percentage: number;
  currentStep: Onboarding | null;
};

export function useGetOnboardingStatus() {
  const fetch = useFetch();

  return useCallback(
    (data: GetOnboardingStatusRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/onboardings/${data.entityType}/${data.entityId}/status`,
        {
          method: "GET",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<GetOnboardingStatusResponse>);
    },
    [fetch]
  );
}

// Complete Step
export type CompleteStepRequest = {
  entityType: OnboardingEntityType;
  entityId: string;
  stepId: string;
  metadata?: Record<string, any>;
  performedBy?: {
    userId?: string;
    tenantId?: string;
  };
};

export type CompleteStepResponse = Onboarding;

export function useCompleteStep() {
  const fetch = useFetch();

  return useCallback(
    (data: CompleteStepRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/onboardings/${data.entityType}/${data.entityId}/complete/${data.stepId}`,
        {
          method: "POST",
          body: JSON.stringify({
            metadata: data.metadata,
            performedBy: data.performedBy,
          }),
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<CompleteStepResponse>);
    },
    [fetch]
  );
}

// Skip Step
export type SkipStepRequest = {
  entityType: OnboardingEntityType;
  entityId: string;
  stepKey: string;
  performedBy?: {
    userId?: string;
    tenantId?: string;
  };
};

export type SkipStepResponse = Onboarding;

export function useSkipStep() {
  const fetch = useFetch();

  return useCallback(
    (data: SkipStepRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/onboardings/${data.entityType}/${data.entityId}/skip/${data.stepKey}`,
        {
          method: "POST",
          body: JSON.stringify({ performedBy: data.performedBy }),
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<SkipStepResponse>);
    },
    [fetch]
  );
}

// Reset Step
export type ResetStepRequest = {
  entityType: OnboardingEntityType;
  entityId: string;
  stepKey: string;
};

export type ResetStepResponse = Onboarding;

export function useResetStep() {
  const fetch = useFetch();

  return useCallback(
    (data: ResetStepRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/onboardings/${data.entityType}/${data.entityId}/reset/${data.stepKey}`,
        {
          method: "POST",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<ResetStepResponse>);
    },
    [fetch]
  );
}

// Get Step Status
export type GetStepStatusRequest = {
  entityType: OnboardingEntityType;
  entityId: string;
  stepKey: string;
};

export type GetStepStatusResponse = Onboarding;

export function useGetStepStatus() {
  const fetch = useFetch();

  return useCallback(
    (data: GetStepStatusRequest, requestConfig?: RequestConfigType) => {
      return fetch(
        `${API_URL}/v1/onboardings/${data.entityType}/${data.entityId}/step/${data.stepKey}`,
        {
          method: "GET",
          ...requestConfig,
        }
      ).then(wrapperFetchJsonResponse<GetStepStatusResponse>);
    },
    [fetch]
  );
}
