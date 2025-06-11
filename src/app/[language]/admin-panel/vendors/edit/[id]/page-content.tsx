// "use client";

// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useForm, FormProvider, useFormState } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "y极速赛车开奖直播官网p";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import {
//   useGetVendorService,
//   usePatchVendorService
// } from "@/services/api/services/vendor";
// import { useTranslation } from "@/services/i18n/client";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { useGetTenantsQuery } from "../../tenants/queries/queries";
// import { RoleEnum } from "@/services/api/types/role";
// import LoadingButton from "@mui/lab/LoadingButton";
// import SaveIcon from "@mui/icons-material/Save";
// import Paper from "@mui/material/Paper";
// import useLeavePage from "@/services/leave-page/use-leave-page";
// import Link from "@/components/link";
// import FormSelectInput from "@/components/form/select/form-select";

// type EditFormData = {
//   name: string;
//   contactEmail?: string;
//   paymentTerms?: string;
//   tenantId: string;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-vendors-edit");

//   return yup.object().shape({
//     name: yup.string().required(t("validation.name.required")),
//     tenantId: yup.string().required(t("validation.tenant.required")),
//   });
// };

// function EditVendorFormActions() {
//   const { t } = useTranslation("admin-panel-vendors-edit");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <LoadingButton
//       variant="contained"
//       color="primary"
//       type="submit"
//       loading={isSubmitting}
//       loadingPosition="start"
//       startIcon={<SaveIcon />}
//     >
//       {isSubmitting
//         ? t("actions.submitting")
//         : t("actions.submit")}
//     </LoadingButton>
//   );
// }

// function FormEditVendor() {
//   const { t } = useTranslation("admin-panel-vendors-edit");
//   const params = useParams<{ id: string }>();
//   const vendorId = params.id;
//   const fetchGetVendor = useGetVendorService();
//   const fetchPatchVendor = usePatchVendorService();
//   const { enqueueSnackbar } = useSnackbar();
//   const validationSchema = useValidationSchema();
//   const { data: tenants } = useGetTenantsQuery();

//   const methods = useForm<EditFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       name: "",
//       tenantId: "",
//     },
//   });

//   const { handleSubmit, setError, reset } = methods;

//   // Load vendor data
//   useEffect(() => {
//     const loadVendor = async () => {
//       const { status, data } = await fetchGetVendor({
//         id: vendorId,
//       });

//       if (status === HTTP_CODES_ENUM.OK) {
//         reset({
//           ...data,
//           tenantId: data.tenant?.id,
//         });
//       }
//     };

//     loadVendor();
//   }, [vendorId, reset, fetchGetVendor]);

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPatchVendor({
//       id: vendorId,
//       data: formData
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof EditFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(`validation.${key}.server.${data.errors[key]}`),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.OK) {
//       enqueueSnackbar(t("alerts.success"), { variant: "success" });
//       reset(formData);
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//           <form onSubmit={onSubmit}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Typography variant="h4" gutterBottom>
//                   {t("title")}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormTextInput<EditFormData>
//                   name="name"
//                   label={t("inputs.name")}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormTextInput<EditFormData>
//                   name="contactEmail"
//                   label={t("inputs.contactEmail")}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <FormTextInput<EditFormData>
//                   name="paymentTerms"
//                   label={t("inputs.paymentTerms")}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <FormSelectInput<EditFormData, Tenant>
//                   name="tenantId"
//                   label={t("inputs.tenant")}
//                   options={tenants?.pages.flatMap(page => page.data) || []}
//                   keyValue="id"
//                   renderOption={(tenant) => tenant.name}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Box display="flex" gap={2}>
//                   <EditVendorFormActions />
//                   <Button
//                     variant="outlined"
//                     color="inherit"
//                     LinkComponent={Link}
//                     href="/admin-panel/vendors"
//                   >
//                     {t("actions.cancel")}
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//           </form>
//         </Paper>
//       </Container>
//     </FormProvider>
//   );
// }

// export default withPageRequiredAuth(FormEditVendor, {
//   roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
// });
