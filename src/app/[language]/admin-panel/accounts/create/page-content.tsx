// "use client";

// import { useForm, FormProvider } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import { usePostAccountService } from "@/services/api/services/account";
// import { useTranslation } from "@/services/i18n/client";
// import { useRouter } from "next/navigation";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import FormSelectInput from "@/components/form/select/form-select";
// import { AccountTypeEnum, NotificationChannelEnum, NotificationTypeEnum } from "@/services/api/types/account";
// import { useGetTenantsQuery } from "../../tenants/queries/queries";
// import LoadingButton from "@mui/lab/LoadingButton";
// import SaveIcon from "@mui/icons-material/Save";
// import Paper from "@mui/material/Paper";
// import { RoleEnum } from "@/services/api/types/role";

// type CreateFormData = {
//   name: string;
//   description: string;
//   type: AccountTypeEnum;
//   balance: number;
//   active: boolean;
//   callbackUrl?: string;
//   notificationChannel?: NotificationChannelEnum;
//   notificationType?: NotificationTypeEnum;
//   receiveNotification: boolean;
//   tenantId: string;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-accounts-create");

//   return yup.object().shape({
//     name: yup.string().required(t("validation.name.required")),
//     description: yup.string().required(t("validation.description.required")),
//     type: yup.string().required(t("validation.type.required")),
//     balance: yup
//       .number()
//       .required(t("validation.balance.required"))
//       .min(0, t("validation.balance.min")),
//     tenantId: yup.string().required(t("validation.tenant.required")),
//     active: yup.boolean().required(),
//     receiveNotification: yup.boolean().required(),
//     callbackUrl: yup.string().url(t("validation.callbackUrl.invalid")),
//     notificationChannel: yup
//       .string()
//       .oneOf(Object.values(NotificationChannelEnum)),
//     notificationType: yup.string().oneOf(Object.values(NotificationTypeEnum)),
//   });
// };

// function CreateAccountFormActions() {
//   const { t } = useTranslation("admin-panel-accounts-create");
//   const { isSubmitting } = useFormState();

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

// function FormCreateAccount() {
//   const { t } = useTranslation("admin-panel-accounts-create");
//   const validationSchema = useValidationSchema();
//   const fetchPostAccount = usePostAccountService();
//   const { enqueueSnackbar } = useSnackbar();
//   const router = useRouter();
//   const { data: tenants } = useGetTenantsQuery();

//   const methods = useForm<CreateFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       type: AccountTypeEnum.ASSET,
//       balance: 0,
//       active: true,
//       receiveNotification: false,
//       tenantId: "",
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostAccount(formData);

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof CreateFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(`validation.${key}.server.${data.errors[key]}`),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.CREATED) {
//       enqueueSnackbar(t("alerts.success"), { variant: "success" });
//       router.push("/admin-panel/accounts");
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
//                 <FormTextInput<CreateFormData>
//                   name="name"
//                   label={t("inputs.name")}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormTextInput<CreateFormData>
//                   name="description"
//                   label={t("inputs.description")}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormSelectInput<CreateFormData, { value: AccountTypeEnum; label: string }>
//                   name="type"
//                   label={t("inputs.type")}
//                   options={Object.values(AccountTypeEnum).map((type) => ({
//                     value: type,
//                     label: t(`account.types.${type}`),
//                   }))}
//                   keyValue="value"
//                   renderOption={(option) => option.label}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormSelectInput<CreateFormData, Tenant>
//                   name="tenantId"
//                   label={t("inputs.tenant")}
//                   options={tenants?.pages.flatMap(page => page.data) || []}
//                   keyValue="id"
//                   renderOption={(tenant) => tenant.name}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormTextInput<CreateFormData>
//                   name="balance"
//                   label={t("inputs.balance")}
//                   type="number"
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormTextInput<CreateFormData>
//                   name="callbackUrl"
//                   label={t("inputs.callbackUrl")}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Box display="flex" gap={2}>
//                   <CreateAccountFormActions />
//                   <Button
//                     variant="outlined"
//                     color="inherit"
//                     onClick={() => router.push("/admin-panel/accounts")}
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

// export default withPageRequiredAuth(FormCreateAccount, {
//   roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
// });
