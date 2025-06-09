// // app/admin-panel/customer-plans/edit.tsx
// "use client";

// import Button from "@mui/material/Button";
// import { useForm, FormProvider, useFormState } from "react-hook-form";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useEffect, useState } from "react";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import Link from "@/components/link";
// import useLeavePage from "@/services/leave-page/use-leave-page";
// import Box from "@mui/material/Box";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import { useTranslation } from "@/services/i18n/client";
// import {
//   useGetCustomerPlanService,
//   usePatchCustomerPlanService,
// } from "@/services/api/services/customer-plans";
// import { useParams } from "next/navigation";
// import { useGetUsersService } from "@/services/api/services/users";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import {
//   CustomerPlanEntity,
//   PlanStatusEnum,
// } from "@/services/api/types/customer-plan";
// import { User } from "@/services/api/types/user";
// import { PaymentPlanEntity } from "@/services/api/types/payment-plan";

// type EditCustomerPlanFormData = {
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

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-customer-plans-edit");

//   return yup.object().shape({
//     planIds: yup
//       .array()
//       .of(yup.string().required())
//       .min(
//         1,
//         t("admin-panel-customer-plans-edit:inputs.planIds.validation.min")
//       ),
//     customerIds: yup
//       .array()
//       .of(yup.string().required())
//       .min(
//         1,
//         t("admin-panel-customer-plans-edit:inputs.customerIds.validation.min")
//       ),
//     status: yup
//       .string()
//       .required(
//         t("admin-panel-customer-plans-edit:inputs.status.validation.required")
//       ),
//     startDate: yup
//       .date()
//       .required(
//         t(
//           "admin-panel-customer-plans-edit:inputs.startDate.validation.required"
//         )
//       ),
//     endDate: yup
//       .date()
//       .nullable()
//       .min(
//         yup.ref("startDate"),
//         t("admin-panel-customer-plans-edit:inputs.endDate.validation.min")
//       ),
//   });
// };

// function EditCustomerPlanFormActions() {
//   const { t } = useTranslation("admin-panel-customer-plans-edit");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-customer-plans-edit:actions.submit")}
//     </Button>
//   );
// }

// function FormEditCustomerPlan() {
//   const params = useParams<{ id: string }>();
//   const customerPlanId = params.id;
//   const fetchGetCustomerPlan = useGetCustomerPlanService();
//   const fetchPatchCustomerPlan = usePatchCustomerPlanService();
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();
//   const { t } = useTranslation("admin-panel-customer-plans-edit");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [users, setUsers] = useState<User[]>([]);
//   const [paymentPlans, setPaymentPlans] = useState<PaymentPlanEntity[]>([]);
//   const [initialData, setInitialData] = useState<CustomerPlanEntity | null>(
//     null
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       const usersResponse = await fetchGetUsers({
//         page: 1,
//         limit: 100,
//         filters: { role: "CUSTOMER" },
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

//       const customerPlanResponse = await fetchGetCustomerPlan({
//         id: customerPlanId,
//       });
//       if (customerPlanResponse.status === HTTP_CODES_ENUM.OK) {
//         setInitialData(customerPlanResponse.data);
//       }
//     };

//     fetchData();
//   }, [
//     customerPlanId,
//     fetchGetCustomerPlan,
//     fetchGetUsers,
//     fetchGetPaymentPlans,
//   ]);

//   const methods = useForm<EditCustomerPlanFormData>({
//     resolver: yupResolver(validationSchema),
//   });

//   const { handleSubmit, setError, reset } = methods;

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         planIds: initialData.plan.map((p) => p.id),
//         customerIds: initialData.customer.map((c) => c.id),
//         status: initialData.status,
//         startDate: new Date(initialData.startDate),
//         endDate: initialData.endDate
//           ? new Date(initialData.endDate)
//           : undefined,
//         customRates: initialData.customRates,
//         customSchedule: initialData.customSchedule,
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPatchCustomerPlan({
//       id: customerPlanId,
//       data: {
//         ...formData,
//         planIds: formData.planIds,
//         customerIds: formData.customerIds,
//       },
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (
//         Object.keys(data.errors) as Array<keyof EditCustomerPlanFormData>
//       ).forEach((key) => {
//         setError(key, {
//           type: "manual",
//           message: t(
//             `admin-panel-customer-plans-edit:inputs.${key}.validation.server.${data.errors[key]}`
//           ),
//         });
//       });
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.OK) {
//       enqueueSnackbar(
//         t("admin-panel-customer-plans-edit:alerts.customerPlan.success"),
//         {
//           variant: "success",
//         }
//       );
//       reset(formData);
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid sx={{ xs: 12 }}>
//               <Typography variant="h6">
//                 {t("admin-panel-customer-plans-edit:title")}
//               </Typography>
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormAutocomplete<EditCustomerPlanFormData>
//                 name="customerIds"
//                 multiple
//                 options={users}
//                 getOptionLabel={(option) =>
//                   `${option.firstName} ${option.lastName} (${option.email})`
//                 }
//                 label={t(
//                   "admin-panel-customer-plans-edit:inputs.customerIds.label"
//                 )}
//                 required
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormAutocomplete<EditCustomerPlanFormData>
//                 name="planIds"
//                 multiple
//                 options={paymentPlans}
//                 getOptionLabel={(option) => option.name}
//                 label={t(
//                   "admin-panel-customer-plans-edit:inputs.planIds.label"
//                 )}
//                 required
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormSelectInput<EditCustomerPlanFormData>
//                 name="status"
//                 label={t("admin-panel-customer-plans-edit:inputs.status.label")}
//                 options={[
//                   PlanStatusEnum.ACTIVE,
//                   PlanStatusEnum.INACTIVE,
//                   PlanStatusEnum.PENDING,
//                   PlanStatusEnum.EXPIRED,
//                 ]}
//                 renderOption={(option) =>
//                   t(
//                     `admin-panel-customer-plans-edit:inputs.status.options.${option}`
//                   )
//                 }
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormDatePicker<EditCustomerPlanFormData>
//                 name="startDate"
//                 label={t(
//                   "admin-panel-customer-plans-edit:inputs.startDate.label"
//                 )}
//                 required
//               />
//             </Grid>

//             <Grid sx={{ xs: 12, md: 6 }}>
//               <FormDatePicker<EditCustomerPlanFormData>
//                 name="endDate"
//                 label={t(
//                   "admin-panel-customer-plans-edit:inputs.endDate.label"
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <EditCustomerPlanFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/customer-plans"
//                 >
//                   {t("admin-panel-customer-plans-edit:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function EditCustomerPlan() {
//   return <FormEditCustomerPlan />;
// }

// export default withPageRequiredAuth(EditCustomerPlan);
