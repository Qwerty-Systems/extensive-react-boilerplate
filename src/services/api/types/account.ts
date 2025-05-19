import {
  AccountTypeEnum,
  NotificationChannelEnum,
  NotificationTypeEnum,
} from "@/utils/enum/account-type.enum";

export type Account = {
  id: string;
  tenantId: string;
  owner?: string[] | null;
  type: AccountTypeEnum;
  active: boolean;
  callbackUrl?: string | null;
  notificationChannel?: NotificationChannelEnum | null;
  notificationType?: NotificationTypeEnum | null;
  receiveNotification: boolean;
  balance: number;
  number?: string | null;
  description: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
