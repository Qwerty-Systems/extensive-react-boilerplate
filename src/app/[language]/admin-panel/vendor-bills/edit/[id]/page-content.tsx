// // app/admin-panel/payment-methods/edit.tsx
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
//   useGetPaymentMethodService,
//   usePatchPaymentMethodService,
// } from "@/services/api/services/payment-methods";
// import { useParams } from "next/navigation";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import FormCheckbox from "@/components/form/checkbox/form-checkbox";
// import { PaymentMethodEntity } from "@/services/api/types/payment-method";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

// type EditPaymentMethodFormData = {
//   name: string;
//   processorType: string;
//   config?: {
//     provider: string;
//     apiKey: string;
//     sandboxMode: boolean;
//   } | null;
// };

// const useValidationSchema = () => {
//   const { t } = use极
//   const { t } = useTranslation("admin-panel-payment-methods-edit");

//   return yup.object().shape({
//     name: yup
//       .string()
//       .required(t("admin-panel-payment-methods-edit:inputs.name.validation.required")),
//     processorType: yup
//       .string()
//       .required(t("admin-panel-payment-methods-edit:inputs.processorType.validation.required")),
//     config: yup.object().shape({
//       provider: yup
//         .string()
//         .required(t("admin-panel-payment-methods-edit:inputs.config.provider.validation.required")),
//       apiKey: yup
//         .string()
//         .required(t("admin-panel-payment-methods-edit:inputs.config.apiKey.validation.required")),
//       sandboxMode: yup
//         .boolean()
//         .required(),
//     }).nullable(),
//   });
// };

// function EditPaymentMethodFormActions() {
//   const { t } = useTranslation("admin-panel-payment-methods-edit");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-payment-methods-edit:actions.submit")}
//     </Button>
//   );
// }

// function FormEditPaymentMethod() {
//   const params = useParams<{ id: string }>();
//   const paymentMethodId = params.id;
//   const fetchGetPaymentMethod = useGetPaymentMethodService();
//   const fetchPatchPaymentMethod = usePatchPaymentMethodService();
//   const { t } = useTranslation("admin-panel-payment-methods-edit");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [initialData, setInitialData] = useState<PaymentMethodEntity | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const paymentMethodResponse = await fetchGetPaymentMethod({
//         id: paymentMethodId
//       });
//       if (paymentMethodResponse.status === HTTP_CODES_ENUM.OK) {
//         setInitialData(paymentMethodResponse.data);
//       }
//     };

//     fetchData();
//   }, [paymentMethodId, fetchGetPaymentMethod]);

//   const methods = useForm<EditPaymentMethodFormData>({
//     resolver: yupResolver(validationSchema),
//   });

//   const { handleSubmit, setError, reset } = methods;

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         name: initialData.name,
//         processorType: initialData.processorType,
//         config: initialData.config || {
//           provider: "",
//           apiKey: "",
//           sandboxMode: true,
//         }
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPatchPaymentMethod({
//       id: paymentMethodId,
//       data: formData
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof EditPaymentMethodFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-payment-methods-edit:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.OK) {
//       enqueueSnackbar(t("admin-panel-payment-methods-edit:alerts.paymentMethod.success"), {
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
//                 {t("admin-panel-payment-methods-edit:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<EditPaymentMethodFormData>
//                 name="name"
//                 label={t("admin-panel-payment-methods-edit:inputs.name.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<EditPaymentMethodFormData>
//                 name="processorType"
//                 label={t("admin-panel-payment-methods-edit:inputs.processorType.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1" gutterBottom>
//                 {t("admin-panel-payment-methods-edit:inputs.config.title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<EditPaymentMethodFormData>
//                 name="config.provider"
//                 label={t("admin-panel-payment-methods-edit:inputs.config.provider.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<EditPaymentMethodFormData>
//                 name="config.apiKey"
//                 label={t("admin-panel-payment-methods-edit:inputs.config.apiKey.label")}
//                 required
//                 type="password"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <FormCheckbox<EditPaymentMethodFormData>
//                 name="config.sandboxMode"
//                 label={t("admin-panel-payment-methods-edit:inputs.config.sandboxMode.label")}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <EditPaymentMethodFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/payment-methods"
//                 >
//                   {t("admin-panel-payment-methods-edit:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function EditPaymentMethod() {
//   return <FormEditPaymentMethod />;
// }

// export default withPageRequiredAuth(EditPaymentMethod);
