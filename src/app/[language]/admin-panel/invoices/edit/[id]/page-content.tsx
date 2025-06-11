// // app/admin-panel/invoices/edit.tsx
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
//   useGetInvoiceService,
//   usePatchInvoiceService,
// } from "@/services/api/services/invoices";
// import { useParams } from "next/navigation";
// import { InvoiceStatus } from "@/services/api/types/invoice-status";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import { useGetDiscountsService } from "@/services/api/services/discounts";
// import { useGetExemptionsService } from "@/services/api/services/exemptions";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import { useGetUsersService } from "@/services/api/services/users";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { InvoiceEntity } from "@/services/api/types/invoice";

// type EditInvoiceFormData = {
//   invoiceNumber: string;
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
//   const { t } = useTranslation("admin-panel-invoices-edit");

//   return yup.object().shape({
//     invoiceNumber: yup
//       .string()
//       .required(t("admin-panel-invoices-edit:inputs.invoiceNumber.validation.required")),
//     amount: yup
//       .number()
//       .positive()
//       .required(t("admin-panel-invoices-edit:inputs.amount.validation.required")),
//     status: yup
//       .string()
//       .required(t("admin-panel-invoices-edit:inputs.status.validation.required")),
//     dueDate: yup
//       .date()
//       .nullable()
//       .min(
//         new Date(),
//         t("admin-panel-invoices-edit:inputs.dueDate.validation.min")
//       ),
//   });
// };

// function EditInvoiceFormActions() {
//   const { t } = useTranslation("admin-panel-invoices-edit");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-invoices-edit:actions.submit")}
//     </Button>
//   );
// }

// function FormEditInvoice() {
//   const params = useParams<{ id: string }>();
//   const invoiceId = params.id;
//   const fetchGetInvoice = useGetInvoiceService();
//   const fetchPatchInvoice = usePatchInvoiceService();
//   const fetchGetDiscounts = useGetDiscountsService();
//   const fetchGetExemptions = useGetExemptionsService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();
//   const fetchGetUsers = useGetUsersService();
//   const { t } = useTranslation("admin-panel-invoices-edit");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [discounts, setDiscounts] = useState([]);
//   const [exemptions, setExemptions] = useState([]);
//   const [paymentPlans, setPaymentPlans] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [initialData, setInitialData] = useState<InvoiceEntity | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const discountsResponse = await fetch极GetDiscounts({
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

//       const invoiceResponse = await fetchGetInvoice({
//         id: invoiceId
//       });
//       if (invoiceResponse.status === HTTP_CODES_ENUM.OK) {
//         setInitialData(invoiceResponse.data);
//       }
//     };

//     fetchData();
//   }, [invoiceId, fetchGetInvoice, fetchGetDiscounts, fetchGetExemptions, fetchGetPaymentPlans, fetchGetUsers]);

//   const methods = useForm<EditInvoiceFormData>({
//     resolver: yupResolver(validationSchema),
//   });

//   const { handleSubmit, setError, reset } = methods;

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         invoiceNumber: initialData.invoiceNumber,
//         amount: initialData.amount,
//         status: initialData.status,
//         dueDate: initialData.dueDate ? new Date(initialData.dueDate) : undefined,
//         customerId: initialData.customer?.id || undefined,
//         discountId: initialData.discount?.id || undefined,
//         exemptionId: initialData.exemption?.id || undefined,
//         planIds: initialData.plan?.map(p => p.id) || [],
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPatchInvoice({
//       id: invoiceId,
//       data: formData
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof EditInvoiceFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-invoices-edit:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.OK) {
//       enqueueSnackbar(t("admin-panel-invoices-edit:alerts.invoice.success"), {
//         variant: "success",
//       });
//       reset(formData);
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6">
//                 {t("admin-panel-invoices-edit:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<EditInvoiceFormData>
//                 name="invoiceNumber"
//                 label={t("admin-panel-invoices-edit:inputs.invoiceNumber.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormTextInput<EditInvoiceFormData>
//                 name="amount"
//                 type="number"
//                 label={t("admin-panel-invoices-edit:inputs.amount.label")}
//                 inputProps={{ step: "0.01" }}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormSelectInput<EditInvoiceFormData>
//                 name="status"
//                 label={t("admin-panel-invoices-edit:inputs.status.label")}
//                 options={Object.values(InvoiceStatus)}
//                 renderOption={(option) =>
//                   t(`admin-panel-invoices-edit:inputs.status.options.${option}`)
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<EditInvoiceFormData>
//                 name="dueDate"
//                 label={t("admin-panel-invoices-edit:inputs.dueDate.label")}
//               />
//             </Grid>

//             <Grid item xs={12} md极={6}>
//               <FormAutocomplete<EditInvoiceFormData>
//                 name="customerId"
//                 label={t("admin-panel-invoices-edit:inputs.customerId.label")}
//                 options={customers}
//                 getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<EditInvoiceFormData>
//                 name="discountId"
//                 label={t("admin-panel-invoices-edit:inputs.discountId.label")}
//                 options={discounts}
//                 getOptionLabel={(option) => option.description || `Discount #${option.id}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<EditInvoiceFormData>
//                 name="exemptionId"
//                 label={t("admin-panel-invoices-edit:inputs.exemptionId.label")}
//                 options={exemptions}
//                 getOptionLabel={(option) => option.reason || `Exemption #${option.id}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormAutocomplete<EditInvoiceFormData>
//                 name="planIds"
//                 multiple
//                 label={t("admin-panel-invoices-edit:inputs.planIds.label")}
//                 options={paymentPlans}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <EditInvoiceFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/invoices"
//                 >
//                   {t("admin-panel-invoices-edit:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function EditInvoice() {
//   return <FormEditInvoice />;
// }

// export default withPageRequiredAuth(EditInvoice);
