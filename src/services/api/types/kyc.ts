import { DocumentData } from "./other";
import { Tenant } from "./tenant";

export interface KycSubmission {
  verifiedBy?: number;
  verifiedAt?: string;
  submittedAt?: string;
  status?: string;
  documentData?: DocumentData;
  documentNumber?: string;
  documentType?: string;
  subjectType?: string;
  tenant?: Tenant;
  user?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
