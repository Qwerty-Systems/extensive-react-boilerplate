export enum Address {
  String = "string",
}

export interface Logo {
  id?: string;
  path?: string;
}

export interface DocumentData {
  frontUrl?: string;
  backUrl?: string;
  expiryDate?: Date;
}
export interface Photo {
  id?: string;
  path?: string;
}

// export interface Role {
//   tenant?: Tenant;
//   id?: number;
//   name?: string;
// }

export interface Config {
  currency?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  email?: boolean;
  sms?: boolean;
}

export interface Status {
  id?: number;
  name?: string;
}

export enum SettingsType {
  // Financial
  INVOICE = "invoice",
  BILLING = "billing",
  PAYMENT = "payment",
  TAX = "tax",
  COMMISSION = "commission",

  // Notifications
  NOTIFICATION = "notification",
  REMINDER = "reminder",
  ALERT = "alert",

  // Waste Operations
  WASTE = "waste",
  COLLECTION = "collection",
  PROCESSING = "processing",
  RECYCLING = "recycling",
  DISPOSAL = "disposal",

  // Marketplace
  MARKETPLACE = "marketplace",
  LISTING = "listing",
  BIDDING = "bidding",
  TRANSACTION = "transaction",

  // User Preferences
  PREFERENCES = "preferences",
  PRIVACY = "privacy",
  ACCESSIBILITY = "accessibility",

  // Compliance
  COMPLIANCE = "compliance",
  CERTIFICATION = "certification",
  REPORTING = "reporting",
  AUDIT = "audit",

  // Technical
  API = "api",
  INTEGRATION = "integration",
  SECURITY = "security",
  RATE_LIMITING = "rate_limiting",

  // Localization
  LOCALIZATION = "localization",
  LANGUAGE = "language",
  CURRENCY = "currency",
  TIMEZONE = "timezone",

  // UI/UX
  THEME = "theme",
  LAYOUT = "layout",
  DASHBOARD = "dashboard",

  // System Operations
  SYSTEM = "system",
  MAINTENANCE = "maintenance",
  BACKUP = "backup",
  SCALING = "scaling",

  // Environmental
  CARBON_ACCOUNTING = "carbon_accounting",
  SUSTAINABILITY = "sustainability",

  // Logistics
  ROUTING = "routing",
  VEHICLE = "vehicle",
  DRIVER = "driver",
}
export enum KycStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REQUIRES_UPDATE = "requires_update",
  APPROVED = "approved",
  REJECTED = "rejected",
}
