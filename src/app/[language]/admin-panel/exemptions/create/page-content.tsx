// // app/admin-panel/exemptions/create.tsx
// "use client";

// import Button from "@mui/material/Button";
// import { useForm, FormProvider, useFormState } from "react-hook-form";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import Link from "@/components/link";
// import useLeavePage from "@/services/leave-page/use-leave-page";
// import Box from "@mui/material/Box";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import { useTranslation } from "@/services/i18n/client";
// import { usePostExemptionService } from "@/services/api/services/exemptions";
// import { useRouter } from "next/navigation";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import { useGetRegionsService } from "@/services/api/services/regions";
// import { useGetResidencesService } from "@/services/api/services/residences";
// import { useGetUsersService } from "@/services/api/services/users";
// import { useGetInvoicesService } from "@/services/api/services/invoices";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import { useEffect, useState } from "react";

// type CreateExemptionFormData = {
//   reason?: string | null;
//   tenantId: string;
//   invoiceId?: string | null;
//   residenceId?: string | null;
//   regionId?: string | null;
//   customerId?: string | null;
//   endDate: Date;
//   startDate: Date;
//   description?: string | null;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-exemptions-create");

//   return yup.object().shape({
//     startDate: yup
//       .date()
//       .required(t("admin-panel-exemptions-create:inputs.startDate.validation.required")),
//     endDate: yup
//       .date()
//       .required(t("admin-panel-exemptions-create:inputs.endDate.validation.required"))
//       .min(
//         yup.ref("startDate"),
//         t("admin-panel-exemptions-create:inputs.endDate.validation.min")
//       ),
//     reason: yup
//       .string()
//       .required(t("admin-panel-exemptions-create:inputs.reason.validation.required")),
//   });
// };

// function CreateExemptionFormActions() {
//   const { t } = useTranslation("admin-panel-exemptions-create");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-exemptions-create:actions.submit")}
//     </Button>
//   );
// }

// function FormCreateExemption() {
//   const router = useRouter();
//   const fetchPostExemption = usePostExemptionService();
//   const fetchGetRegions = useGetRegionsService();
//   const fetchGetResidences = useGetResidencesService();
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetInvoices = useGetInvoicesService();
//   const { t } = useTranslation("admin-panel-exemptions-create");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [regions, setRegions] = useState([]);
//   const [residences, setResidences] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [invoices, setInvoices] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const regionsResponse = await fetchGetRegions({
//         page: 1,
//         limit: 100,
//       });
//       if (regionsResponse.status === HTTP_CODES_ENUM.OK) {
//         setRegions(regionsResponse.data.data);
//       }

//       const residencesResponse = await fetchGetResidences({
//         page: 1,
//         limit: 100,
//       });
//       if (residencesResponse.status === HTTP_CODES_ENUM.OK) {
//         setResidences(residencesResponse.data.data);
//       }

//       const customersResponse = await fetchGetUsers({
//         page: 1,
//         limit: 100,
//         filters: { role: "CUSTOMER" }
//       });
//       if (customersResponse.status === HTTP_CODES_ENUM.OK) {
//         setCustomers(customersResponse.data.data);
//       }

//       const invoicesResponse = await fetchGetInvoices({
//         page: 1,
//         limit: 100,
//       });
//       if (invoicesResponse.status === HTTP_CODES_ENUM.OK) {
//         setInvoices(invoicesResponse.data.data);
//       }
//     };

//     fetchData();
//   }, [fetchGetRegions, fetchGetResidences, fetchGetUsers, fetchGetInvoices]);

//   const methods = useForm<CreateExemptionFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostExemption({
//       ...formData,
//       tenantId: "current-tenant-id", // Replace with actual tenant ID
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof CreateExemptionFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-exemptions-create:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.CREATED) {
//       enqueueSnackbar(t("admin-panel-exemptions-create:alerts.exemption.success"), {
//         variant: "success",
//       });
//       router.push("/admin-panel/exemptions");
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6">
//                 {t("admin-panel-exemptions-create:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreateExemptionFormData>
//                 name="reason"
//                 label={t("admin-panel-exemptions-create:inputs.reason.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreateExemptionFormData>
//                 name="description"
//                 label={t("admin-panel-exemptions-create:inputs.description.label")}
//                 multiline
//                 rows={3}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<CreateExemptionFormData>
//                 name="startDate"
//                 label={t("admin-panel-exemptions-create:inputs.startDate.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<CreateExemptionFormData>
//                 name="endDate"
//                 label={t("admin-panel-exemptions-create:inputs.endDate.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateExemptionFormData>
//                 name="customerId"
//                 label={t("admin-panel-exemptions-create:inputs.customerId.label")}
//                 options={customers}
//                 getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateExemptionFormData>
//                 name="regionId"
//                 label={t("admin-panel-exemptions-create:inputs.regionId.label")}
//                 options={regions}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateExemptionFormData>
//                 name="residenceId"
//                 label={t("admin-panel-exemptions-create:inputs.residenceId.label")}
//                 options={residences}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateExemptionFormData>
//                 name="invoiceId"
//                 label={t("admin-panel-exemptions-create:inputs.invoiceId.label")}
//                 options={invoices}
//                 getOptionLabel={(option) => option.invoiceNumber}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CreateExemptionFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/exemptions"
//                 >
//                   {t("admin-panel-exemptions-create:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function CreateExemption() {
//   return <FormCreateExemption />;
// }

// export default withPageRequiredAuth(CreateExemption);
