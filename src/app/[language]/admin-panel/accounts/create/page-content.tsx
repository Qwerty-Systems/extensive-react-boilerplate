// "use client";

// import { useForm, FormProvider, useFormState, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import {
//   Button,
//   Container,
//   Grid,
//   Typography,
//   Paper,
//   Box,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import LoadingButton from "@mui/lab/LoadingButton";
// import SaveIcon from "@mui/icons-material/Save";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import useLeavePage from "@/services/leave-page/use-leave-page";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
// import { useTranslation } from "@/services/i18n/client";
// import { useRouter } from "next/navigation";
// import {
//   AccountTypeEnum,
//   NotificationChannelEnum,
//   NotificationTypeEnum,
// } from "@/utils/enum/account-type.enum";
// import { Tenant } from "@/services/api/types/tenant";
// import { User } from "@/services/api/types/user";
// import { RoleEnum } from "@/services/api/types/role";
// import { useGetTenantsQuery } from "../../tenants/queries/queries";
// import { useGetUsersQuery } from "../../users/queries/queries";
// import { usePostAccountService } from "@/services/api/services/accounts";
// import { Account } from "@/services/api/types/account";

// interface CreateAccountFormData
//   extends Pick<
//     Account,
//     | "name"
//     | "tenantId"
//     | "type"
//     | "active"
//     | "receiveNotification"
//     | "notificationChannel"
//     | "notificationType"
//     | "callbackUrl"
//     | "balance"
//     | "number"
//     | "description"
//   > {
//   ownerIds: string[];
// }

// type SelectOption = {
//   id: string;
//   label: string;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-accounts-create");

//   return yup.object().shape({
//     name: yup.string().required(t("inputs.name.required")),
//     tenantId: yup.string().required(t("inputs.tenant.required")),
//     ownerIds: yup
//       .array()
//       .of(yup.string().required())
//       .min(1, t("inputs.owner.required")),
//     type: yup
//       .mixed<AccountTypeEnum>()
//       .oneOf(Object.values(AccountTypeEnum))
//       .required(t("inputs.type.required")),
//     active: yup.boolean().required(),
//     receiveNotification: yup.boolean().required(),
//     notificationChannel: yup.mixed<NotificationChannelEnum>(),
//     /*.when("receiveNotification", {
//         is: (value: boolean) => value === true,
//         then: yup
//           .mixed<NotificationChannelEnum>()
//           .oneOf(
//             Object.values(NotificationChannelEnum) as NotificationChannelEnum[]
//           )
//           .required(t("inputs.notificationChannel.required")),
//       })*/ notificationType: yup.mixed<NotificationTypeEnum>(),
//     // .when("receiveNotification", {
//     //   is: true,
//     //   then: yup
//     //     .mixed<NotificationTypeEnum>()
//     //     .oneOf(Object.values(NotificationTypeEnum))
//     //     .required(t("inputs.notificationType.required")),
//     // }),
//     callbackUrl: yup.string().url(t("inputs.callbackUrl.invalid")).nullable(),
//     balance: yup
//       .number()
//       .min(0, t("inputs.balance.min"))
//       .required(t("inputs.balance.required")),
//     number: yup.string().nullable(),
//     description: yup.string().required(t("inputs.description.required")),
//   });
// };

// function CreateAccountFormActions() {
//   const { isDirty, isSubmitting } = useFormState();
//   useLeavePage(isDirty);
//   const { t } = useTranslation("admin-panel-accounts-create");

//   return (
//     <LoadingButton
//       type="submit"
//       variant="contained"
//       startIcon={<SaveIcon />}
//       loading={isSubmitting}
//     >
//       {isSubmitting ? t("actions.submitting") : t("actions.submit")}
//     </LoadingButton>
//   );
// }

// function NotificationFields() {
//   const { t } = useTranslation("admin-panel-accounts-create");
//   const receiveNotification = useWatch({ name: "receiveNotification" });

//   if (!receiveNotification) return null;

//   return (
//     <>
//       <Grid sx={{ xs: 12, md: 6 }}>
//         <FormSelectInput<CreateAccountFormData, SelectOption>
//           name="notificationChannel"
//           label={t("inputs.notificationChannel.label")}
//           options={Object.values(NotificationChannelEnum).map((value) => ({
//             id: value,
//             label: t(`notificationChannels.${value}`),
//           }))}
//           keyValue="id"
//           renderOption={(opt) => opt.label}
//         />
//       </Grid>
//       <Grid sx={{ xs: 12, md: 6 }}>
//         <FormSelectInput<CreateAccountFormData, SelectOption>
//           name="notificationType"
//           label={t("inputs.notificationType.label")}
//           options={Object.values(NotificationTypeEnum).map((value) => ({
//             id: value,
//             label: t(`notificationTypes.${value}`),
//           }))}
//           keyValue="id"
//           renderOption={(opt) => opt.label}
//         />
//       </Grid>
//     </>
//   );
// }

// function FormCreateAccount() {
//   const { t } = useTranslation("admin-panel-accounts-create");
//   const { data: tenants } = useGetTenantsQuery();
//   const { data: usersPages } = useGetUsersQuery();
//   const postAccount = usePostAccountService();
//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();

//   const users = usersPages?.pages.flatMap((page: any) => page.data) ?? [];
//   const schema = useValidationSchema();

//   const methods = useForm<CreateAccountFormData>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       name: "",
//       tenantId: "",
//       ownerIds: [],
//       type: AccountTypeEnum.asset,
//       active: true,
//       receiveNotification: false,
//       notificationChannel: undefined,
//       notificationType: undefined,
//       callbackUrl: "",
//       balance: 0,
//       number: "",
//       description: "",
//     },
//   });

//   const { handleSubmit } = methods;

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       const { status, data: errorData } = await postAccount(data);

//       if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//         Object.entries(errorData.errors).forEach(([field, error]) =>
//           methods.setError(field as keyof CreateAccountFormData, {
//             type: "server",
//             message: t(`inputs.${field}.server.${error}`),
//           })
//         );
//         return;
//       }

//       if (status === HTTP_CODES_ENUM.CREATED) {
//         enqueueSnackbar(t("alerts.success"), { variant: "success" });
//         router.push("/admin-panel/accounts");
//       }
//     } catch (error) {
//       enqueueSnackbar(t("alerts.error.generic"), { variant: "error" });
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <Paper sx={{ p: 4, borderRadius: 2 }}>
//           <form onSubmit={onSubmit}>
//             <Grid container spacing={3}>
//               <Grid sx={{ xs: 12 }}>
//                 <Typography variant="h4">{t("title")}</Typography>
//               </Grid>

//               <Grid sx={{ xs: 12, md: 6 }}>
//                 <FormTextInput<CreateAccountFormData>
//                   name="name"
//                   label={t("inputs.name.label")}
//                 />
//               </Grid>
//               <Grid sx={{ xs: 12, md: 6 }}>
//                 <FormSelectInput<CreateAccountFormData, Tenant>
//                   name="tenantId"
//                   label={t("inputs.tenant.label")}
//                   options={tenants?.pages.flatMap((p: any) => p.data) ?? []}
//                   keyValue="id"
//                   renderOption={(opt) => opt.name}
//                 />
//               </Grid>

//               <Grid sx={{ xs: 12 }}>
//                 <FormMultipleSelectInput<CreateAccountFormData, User>
//                   name="ownerIds"
//                   label={t("inputs.owner.label")}
//                   options={users}
//                   keyValue="id"
//                   renderOption={(opt) => `${opt.firstName} ${opt.lastName}`}
//                   renderValue={(selected) =>
//                     selected
//                       .map(
//                         (userId) =>
//                           users.find((u) => u.id === userId)?.firstName +
//                           " " +
//                           users.find((u) => u.id === userId)?.lastName
//                       )
//                       .join(", ")
//                   }
//                 />
//               </Grid>

//               <Grid sx={{ xs: 12, md: 4 }}>
//                 <FormSelectInput<CreateAccountFormData, SelectOption>
//                   name="type"
//                   label={t("inputs.type.label")}
//                   options={Object.values(AccountTypeEnum).map((value) => ({
//                     id: value,
//                     label: t(`accountTypes.${value}`),
//                   }))}
//                   keyValue="id"
//                   renderOption={(opt) => opt.label}
//                 />
//               </Grid>
//               <Grid sx={{ xs: 12, md: 4 }}>
//                 <FormControlLabel
//                   control={<Checkbox {...methods.register("active")} />}
//                   label={t("inputs.active.label")}
//                 />
//                 <FormControlLabel
//                   control={
//                     <Checkbox {...methods.register("receiveNotification")} />
//                   }
//                   label={t("inputs.receiveNotification.label")}
//                 />
//               </Grid>
//               <Grid sx={{ xs: 12, md: 4 }}>
//                 <FormTextInput<CreateAccountFormData>
//                   name="callbackUrl"
//                   label={t("inputs.callbackUrl.label")}
//                 />
//               </Grid>

//               <NotificationFields />

//               <Grid sx={{ xs: 12, md: 6 }}>
//                 <FormTextInput<CreateAccountFormData>
//                   name="balance"
//                   label={t("inputs.balance.label")}
//                   type="number"
//                 />
//               </Grid>
//               <Grid sx={{ xs: 12, md: 6 }}>
//                 <FormTextInput<CreateAccountFormData>
//                   name="number"
//                   label={t("inputs.number.label")}
//                 />
//               </Grid>

//               <Grid sx={{ xs: 12 }}>
//                 <FormTextInput<CreateAccountFormData>
//                   name="description"
//                   label={t("inputs.description.label")}
//                   multiline
//                   // rows={4}
//                 />
//               </Grid>

//               <Grid sx={{ xs: 12 }}>
//                 <Box display="flex" gap={2}>
//                   <CreateAccountFormActions />
//                   <Button variant="outlined" href="/admin-panel/accounts">
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
//   roles: [RoleEnum.ADMIN],
// });
