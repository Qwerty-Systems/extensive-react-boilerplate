import { DocumentData } from "./other";
import { Tenant } from "./tenant";

export interface KycSubmission {
  verifiedBy?: number;
  verifiedAt?: Date;
  submittedAt?: Date;
  status?: string;
  documentData?: DocumentData;
  documentNumber?: string;
  documentType?: string;
  subjectType?: string;
  tenant?: Tenant;
  user?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
