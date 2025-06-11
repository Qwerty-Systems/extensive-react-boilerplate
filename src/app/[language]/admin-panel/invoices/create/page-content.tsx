// // app/admin-panel/invoices/create.tsx
// "use client";

// import Button from "@mui/material/Button";
// import { useForm, FormProvider, useFormState } from "react-hook-form";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import * as yup from "yup";
// import { y极Resolver } from "@hookform/resolvers/yup";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import Link from "@/components/link";
// import useLeavePage from "@/services/leave-page/use-leave-page";
// import Box from "@mui/material/Box";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import { useTranslation } from "@/services/i18n/client";
// import { usePostInvoiceService } from "@/services/api/services/invoices";
// import { useRouter } from "next/navigation";
// import { InvoiceStatus } from "@/services/api/types/invoice-status";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import { useGetDiscountsService } from "@/services/api/services/discounts";
// import { useGetExemptionsService } from "@/services/api/services/exemptions";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import { useGetUsersService } from "@/services/api/services/users";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import { useEffect, useState } from "react";

// type CreateInvoiceFormData = {
//   invoiceNumber: string;
//   tenantId: string;
//   exemptionId?: string | null;
//   discountId?: string | null;
//   accountsReceivableId?: string | null;
//   planIds?: string[] | null;
//   amount: number;
//   status: InvoiceStatus;
//   dueDate?: Date | null;
//   customerId?: string | null;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-invoices-create");

//   return yup.object().shape({
//     invoiceNumber: yup
//       .string()
//       .required(t("admin-panel-invoices-create:inputs.invoiceNumber.validation.required")),
//     amount: yup
//       .number()
//       .positive()
//       .required(t("admin-panel-invoices-create:inputs.amount.validation.required")),
//     status: yup
//       .string()
//       .required(t("admin-panel-invoices-create:inputs.status.validation.required")),
//     dueDate: yup
//       .date()
//       .nullable()
//       .min(
//         new Date(),
//         t("admin-panel-invoices-create:inputs.dueDate.validation.min")
//       ),
//   });
// };

// function CreateInvoiceFormActions() {
//   const { t } = useTranslation("admin-panel-invoices-create");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-invoices-create:actions.submit")}
//     </Button>
//   );
// }

// function FormCreateInvoice() {
//   const router = useRouter();
//   const fetchPostInvoice = usePostInvoiceService();
//   const fetchGetDiscounts = useGetDiscountsService();
//   const fetchGetExemptions = useGetExemptionsService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();
//   const fetchGetUsers = useGetUsersService();
//   const { t } = useTranslation("admin-panel-invoices-create");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [discounts, setDiscounts] = useState([]);
//   const [exemptions, setExemptions] = useState([]);
//   const [paymentPlans, setPaymentPlans] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const discountsResponse = await fetchGetDiscounts({
//         page: 1,
//         limit: 100,
//       });
//       if (discountsResponse.status === HTTP_CODES_ENUM.OK) {
//         setDiscounts(discountsResponse.data.data);
//       }

//       const exemptionsResponse = await fetchGetExemptions({
//         page: 1,
//         limit: 100,
//       });
//       if (exemptionsResponse.status === HTTP_CODES_ENUM.OK) {
//         setExemptions(exemptionsResponse.data.data);
//       }

//       const plansResponse = await fetchGetPaymentPlans({
//         page: 1,
//         limit: 100,
//       });
//       if (plansResponse.status === HTTP_CODES_ENUM.OK) {
//         setPaymentPlans(plansResponse.data.data);
//       }

//       const customersResponse = await fetchGetUsers({
//         page: 1,
//         limit: 100,
//         filters: { role: "CUSTOMER" }
//       });
//       if (customersResponse.status === HTTP_CODES_ENUM.OK) {
//         setCustomers(customersResponse.data.data);
//       }
//     };

//     fetchData();
//   }, [fetchGetDiscounts, fetchGetExemptions, fetchGetPaymentPlans, fetchGetUsers]);

//   const methods = useForm<CreateInvoiceFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       status: InvoiceStatus.PENDING,
//       amount: 0,
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostInvoice({
//       ...formData,
//       tenantId: "current-tenant-id", // Replace with actual tenant ID
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof CreateInvoiceFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-invoices-create:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.CREATED) {
//       enqueueSnackbar(t("admin-panel-invoices-create:alerts.invoice.success"), {
//         variant: "success",
//       });
//       router.push("/admin-panel/invoices");
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6">
//                 {t("admin-panel-invoices-create:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreateInvoiceFormData>
//                 name="invoiceNumber"
//                 label={t("admin-panel-invoices-create:inputs.invoiceNumber.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormTextInput<CreateInvoiceFormData>
//                 name="amount"
//                 type="number"
//                 label={t("admin-panel-invoices-create:inputs.amount.label")}
//                 inputProps={{ step: "0.01" }}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormSelectInput<CreateInvoiceFormData>
//                 name="status"
//                 label={t("admin-panel-invoices-create:inputs.status.label")}
//                 options={Object.values(InvoiceStatus)}
//                 renderOption={(option) =>
//                   t(`admin-panel-invoices-create:inputs.status.options.${option}`)
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<CreateInvoiceFormData>
//                 name="dueDate"
//                 label={t("admin-panel-invoices-create:inputs.dueDate.label")}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateInvoiceFormData>
//                 name="customerId"
//                 label={t("admin-panel-invoices-create:inputs.customerId.label")}
//                 options={customers}
//                 getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateInvoiceFormData>
//                 name="discountId"
//                 label={t("admin-panel-invoices-create:inputs.discountId.label")}
//                 options={discounts}
//                 getOptionLabel={(option) => option.description || `Discount #${option.id}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateInvoiceFormData>
//                 name="exemptionId"
//                 label={t("admin-panel-invoices-create:inputs.exemptionId.label")}
//                 options={exemptions}
//                 getOptionLabel={(option) => option.reason || `Exemption #${option.id}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormAutocomplete<CreateInvoiceFormData>
//                 name="planIds"
//                 multiple
//                 label={t("admin-panel-invoices-create:inputs.planIds.label")}
//                 options={paymentPlans}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CreateInvoiceFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/invoices"
//                 >
//                   {t("admin-panel-invoices-create:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function CreateInvoice() {
//   return <FormCreateInvoice />;
// }

// export default withPageRequiredAuth(CreateInvoice);
