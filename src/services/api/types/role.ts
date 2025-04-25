export enum RoleEnum {
  ADMIN = "Admin",
  PLATFORM_OWNER = "Platform Owner",
  AGENT = "Agent",
  USER = "User",
  CUSTOMER = "Customer",
  MANAGER = "Manager",
  FINANCE = "Finance",
  GUEST = "Guest",
}

export type Role = {
  id: number | string;
  name?: string;
};

// {
//   "role": [
//     {
//       "id" : 1,
//       "name" : "Platform Owner",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 3,
//       "name" : "Admin",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 5,
//       "name" : "Agent",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 6,
//       "name" : "Customer",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 7,
//       "name" : "Manager",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 8,
//       "name" : "Finance",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 9,
//       "name" : "Guest",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     },
//     {
//       "id" : 4,
//       "name" : "User",
//       "tenantId" : "83bd7eb9-ef9c-425b-a702-9a42d6823423"
//     }
//   ]}
