// // app/admin-panel/customer-plans/create.tsx
// "use client";

// import Button from "@mui/material/Button";
// import { useForm, FormProvider, useFormState } from "react-hook-form";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import Link from "@/components/link";
// import useLeavePage from "@/services/leave-page/use-leave-page";
// import Box from "@mui/material/Box";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import { useTranslation } from "@/services/i18n/client";
// import { useRouter } from "next/navigation";
// import { useGetUsersService } from "@/services/api/services/users";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import { useEffect, useState } from "react";
// import { User } from "@/services/api/types/user";
// import { PaymentPlanEntity } from "@/services/api/types/payment-plan";
// import { usePostCustomerPlanService } from "@/services/api/services/customer-payment-plan";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plan";

// type CreateCustomerPlanFormData = {
//   tenantId: string;
//   planIds: string[];
//   customerIds: string[];
//   assignedById?: string;
//   status: PlanStatusEnum;
//   startDate: Date;
//   endDate?: Date | null;
//   customRates?: Record<string, any>;
//   customSchedule?: {
//     lastPaymentDate: Date;
//     paymentCount: number;
//     nextPaymentDates?: Date[];
//   } | null;
// };

// const useValidationSchema =
//   (): yup.ObjectSchema<CreateCustomerPlanFormData> => {
//     const { t } = useTranslation("admin-panel-customer-plans-create");

//     return yup.object({
//       tenantId: yup
//         .string()
//         .required(
//           t(
//             "admin-panel-customer-plans-create:inputs.tenantId.validation.required"
//           )
//         ),
//       planIds: yup
//         .array()
//         .of(yup.string().required())
//         .min(
//           1,
//           t("admin-panel-customer-plans-create:inputs.planIds.validation.min")
//         )
//         .required(),
//       customerIds: yup
//         .array()
//         .of(yup.string().required())
//         .min(
//           1,
//           t(
//             "admin-panel-customer-plans-create:inputs.customerIds.validation.min"
//           )
//         )
//         .required(),
//       status: yup
//         .mixed<PlanStatusEnum>()
//         .oneOf(Object.values(PlanStatusEnum))
//         .required(
//           t(
//             "admin-panel-customer-plans-create:inputs.status.validation.required"
//           )
//         ),
//       startDate: yup
//         .date()
//         .required(
//           t(
//             "admin-panel-customer-plans-create:inputs.startDate.validation.required"
//           )
//         ),
//       endDate: yup
//         .date()
//         .nullable()
//         .min(
//           yup.ref("startDate"),
//           t("admin-panel-customer-plans-create:inputs.endDate.validation.min")
//         ),
//       assignedById: yup.string().notRequired(),
//       customRates: yup.mixed<Record<string, any>>().notRequired(),
//       customSchedule: yup
//         .object({
//           lastPaymentDate: yup.date().required(),
//           paymentCount: yup.number().required(),
//           nextPaymentDates: yup.array().of(yup.date()).notRequired(),
//         })
//         .nullable()
//         .notRequired(),
//     }) as yup.ObjectSchema<CreateCustomerPlanFormData>;
//   };

// function CreateCustomerPlanFormActions() {
//   const { t } = useTranslation("admin-panel-customer-plans-create");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-customer-plans-create:actions.submit")}
//     </Button>
//   );
// }

// function FormCreateCustomerPlan() {
//   const router = useRouter();
//   const fetchPostCustomerPlan = usePostCustomerPlanService();
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();
//   const { t } = useTranslation("admin-panel-customer-plans-create");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [users, setUsers] = useState<User[]>([]);
//   const [paymentPlans, setPaymentPlans] = useState<PaymentPlanEntity[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const usersResponse = await fetchGetUsers({
//         page: 1,
//         limit: 100,
//         //filters: { roles: ["CUSTOMER"] },
//       });
//       if (usersResponse.status === HTTP_CODES_ENUM.OK) {
//         setUsers(usersResponse.data.data);
//       }

//       const plansResponse = await fetchGetPaymentPlans({
//         page: 1,
//         limit: 100,
//       });
//       if (plansResponse.status === HTTP_CODES_ENUM.OK) {
//         setPaymentPlans(plansResponse.data.data);
//       }
//     };

//     fetchData();
//   }, [fetchGetUsers, fetchGetPaymentPlans]);

//   const methods = useForm<CreateCustomerPlanFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       planIds: [],
//       customerIds: [],
//       status: PlanStatusEnum.ACTIVE,
//       startDate: new Date(),
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostCustomerPlan({
//       ...formData,
//       tenantId: "current-tenant-id",
//       tenant: {
//         id: "",
//       },
//       status: PlanStatusEnum.TRIAL,
//       customRates: undefined,
//       startDate: undefined,
//       plan: [],
//       customer: [],
//       planIds: [],
//       customerIds: [],
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (
//         Object.keys(data.errors) as Array<keyof CreateCustomerPlanFormData>
//       ).forEach((key) => {
//         setError(key, {
//           type: "manual",
//           message: t(
//             `admin-panel-customer-plans-create:inputs.${key}.validation.server.${data.errors[key]}`
//           ),
//         });
//       });
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.CREATED) {
//       enqueueSnackbar(
//         t("admin-panel-customer-plans-create:alerts.customerPlan.success"),
//         {
//           variant: "success",
//         }
//       );
//       router.push("/admin-panel/customer-plans");
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid sx={{ xs: 12 }}>
//               <Typography variant="h6">
//                 {t("admin-panel-customer-plans-create:title")}
//               </Typography>
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormAutocomplete<CreateCustomerPlanFormData>
//                 name="customerIds"
//                 options={users}
//                 getOptionLabel={(option) => {
//                   const user = option as User;
//                   return `${user.firstName} ${user.lastName} (${user.email})`;
//                 }}
//                 label={t(
//                   "admin-panel-customer-plans-create:inputs.customerIds.label"
//                 )}
//                 value={undefined}
//                 renderOption={(option: unknown) => {
//                   const user = option as User;
//                   return (
//                     <span>
//                       {user.firstName} {user.lastName} ({user.email})
//                     </span>
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormAutocomplete<CreateCustomerPlanFormData, any>
//                 name="planIds"
//                 options={paymentPlans}
//                 getOptionLabel={(option) => option.name}
//                 label={t(
//                   "admin-panel-customer-plans-create:inputs.planIds.label"
//                 )}
//                 value={undefined}
//                 renderOption={(option: any) => {
//                   return t(
//                     `admin-panel-customer-plans-create:inputs.status.options.${option}`
//                   );
//                 }}
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormSelectInput<CreateCustomerPlanFormData, PlanStatusEnum>
//                 name="status"
//                 label={t(
//                   "admin-panel-customer-plans-create:inputs.status.label"
//                 )}
//                 options={[
//                   PlanStatusEnum.ACTIVE,
//                   PlanStatusEnum.INACTIVE,
//                   PlanStatusEnum.PENDING,
//                   PlanStatusEnum.EXPIRED,
//                 ]}
//                 renderOption={(option) =>
//                   t(
//                     `admin-panel-customer-plans-create:inputs.status.options.${option}`
//                     // eslint-disable-next-line prettier/prettier
//                 )}
//                 keyValue="name"
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormDatePicker<CreateCustomerPlanFormData>
//                 name="startDate"
//                 label={t(
//                   "admin-panel-customer-plans-create:inputs.startDate.label"
//                 )}
//                 required
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormDatePicker<CreateCustomerPlanFormData>
//                 name="endDate"
//                 label={t(
//                   "admin-panel-customer-plans-create:inputs.endDate.label"
//                 )}
//               />
//             </Grid>

//             <Grid sx={{ xs: 12 }}>
//               <CreateCustomerPlanFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/customer-plans"
//                 >
//                   {t("admin-panel-customer-plans-create:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function CreateCustomerPlan() {
//   return <FormCreateCustomerPlan />;
// }

// export default withPageRequiredAuth(CreateCustomerPlan);
