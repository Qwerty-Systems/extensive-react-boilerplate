import { FileEntity } from "./file-entity";
import { KycSubmission } from "./kyc";
import { Status } from "./other";
import { Region } from "./region";
import { Role } from "./role";
import { Setting } from "./settings";
import { Tenant } from "./tenant";

export enum UserProviderEnum {
  EMAIL = "email",
  GOOGLE = "google",
}

// export type User = {
//   id: string;
//   email: string;
//   firstName?: string;
//   username?: string;
//   phone?: string;
//   lastName?: string;
//   photo?: FileEntity;
//   provider?: UserProviderEnum;
//   socialId?: string;
//   role?: Role;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   roles?: any;
// };

export interface User {
  regions?: Region[];
  settings?: Setting[];
  kycSubmissions?: KycSubmission[];
  tenant?: Tenant;
  id?: number | string;
  email?: string;
  provider?: string;
  socialId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  photo?: FileEntity;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles?: any;
  role?: Role;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
