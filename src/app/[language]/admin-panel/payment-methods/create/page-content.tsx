// // app/admin-panel/payment-methods/create.tsx
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
// import { usePostPaymentMethodService } from "@/services/api/services/payment-methods";
// import { useRouter } from "next/navigation";
// import FormCheckbox from "@/components/form/checkbox/form-checkbox";
// import { useMemo } from "react";

// type CreatePaymentMethodFormData = {
//   name: string;
//   processorType: string;
//   config?: {
//     provider: string;
//     apiKey: string;
//     sandboxMode: boolean;
//   } | null;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-payment-methods-create");

//   return yup.object().shape({
//     name: yup
//       .string()
//       .required(t("admin-panel-payment-methods-create:inputs.name.validation.required")),
//     processorType: yup
//       .string()
//       .required(t("admin-panel-payment-methods-create:inputs.processorType.validation.required")),
//     config: yup.object().shape({
//       provider: yup
//         .string()
//         .required(t("admin-panel-payment-methods-create:inputs.config.provider.validation.required")),
//       apiKey: yup
//         .string()
//         .required(t("admin-panel-payment-methods-create:inputs.config.apiKey.validation.required")),
//       sandboxMode: yup
//         .boolean()
//         .required(),
//     }).nullable(),
//   });
// };

// function CreatePaymentMethodFormActions() {
//   const { t } = useTranslation("admin-panel-payment-methods-create");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-payment-methods-create:actions.submit")}
//     </Button>
//   );
// }

// function FormCreatePaymentMethod() {
//   const router = useRouter();
//   const fetchPostPaymentMethod = usePostPaymentMethodService();
//   const { t } = useTranslation("admin-panel-payment-methods-create");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const processorTypes = useMemo(() => [
//     "STRIPE",
//     "PAYPAL",
//     "ADYEN",
//     "BRAINTREE",
//     "AUTHORIZE_NET"
//   ], []);

//   const providers = useMemo(() => [
//     "STRIPE",
//     "PAYPAL",
//     "ADYEN",
//     "BRAINTREE",
//     "AUTHORIZE_NET"
//   ], []);

//   const methods = useForm<CreatePaymentMethodFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       name: "",
//       processorType: "",
//       config: {
//         provider: "",
//         apiKey: "",
//         sandboxMode: true,
//       }
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostPaymentMethod({
//       ...formData,
//       tenantId: "current-tenant-id", // Replace with actual tenant ID
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof CreatePaymentMethodFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-payment-methods-create:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.CREATED) {
//       enqueueSnackbar(t("admin-panel-payment-methods-create:alerts.paymentMethod.success"), {
//         variant: "success",
//       });
//       router.push("/admin-panel/payment-methods");
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6">
//                 {t("admin-panel-payment-methods-create:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreatePaymentMethodFormData>
//                 name="name"
//                 label={t("admin-panel-payment-methods-create:inputs.name.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreatePaymentMethodFormData>
//                 name="processorType"
//                 label={t("admin-panel-payment-methods-create:inputs.processorType.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1" gutterBottom>
//                 {t("admin-panel-payment-methods-create:inputs.config.title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreatePaymentMethodFormData>
//                 name="config.provider"
//                 label={t("admin-panel-payment-methods-create:inputs.config.provider.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreatePaymentMethodFormData>
//                 name="config.apiKey"
//                 label={t("admin-panel-payment-methods-create:inputs.config.apiKey.label")}
//                 required
//                 type="password"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormCheckbox<CreatePaymentMethodFormData>
//                 name="config.sandboxMode"
//                 label={t("admin-panel-payment-methods-create:inputs.config.sandboxMode.label")}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CreatePaymentMethodFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/payment-methods"
//                 >
//                   {t("admin-panel-payment-methods-create:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function CreatePaymentMethod() {
//   return <FormCreatePaymentMethod />;
// }

// export default withPageRequiredAuth(CreatePaymentMethod);
