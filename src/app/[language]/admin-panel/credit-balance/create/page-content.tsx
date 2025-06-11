// "use client";

// import { useForm, FormProvider } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
// import { useSnackbar } from "@/hooks/use-snackbar";
// import { usePostAccountsPayableService } from "@/services/api/services/accounts-payable";
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
// import {
//   AccountTypeEnum,
//   TransactionTypeEnum,
// } from "@/services/api/types/accounts-payable";
// import { useGetTenantsQuery } from "../../tenants/queries/queries";
// import LoadingButton from "@mui/lab/LoadingButton";
// import SaveIcon from "@mui/icons-material/Save";
// import Paper from "@mui/material/Paper";
// import { RoleEnum } from "@/services/api/types/role";
// import { useGetAccountsQuery } from "../../accounts/queries/queries";
// import { useGetUsersQuery } from "../../users/queries/queries";

// type CreateFormData = {
//   itemName: string;
//   itemDescription?: string;
//   quantity: number;
//   purchasePrice?: number;
//   salePrice?: number;
//   accountType?: AccountTypeEnum;
//   transactionType: TransactionTypeEnum;
//   amount: number;
//   tenantId: string;
//   accountIds: string[];
//   ownerIds: string[];
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-accounts-payables-create");

//   return yup.object().shape({
//     itemName: yup.string().required(t("validation.itemName.required")),
//     quantity: yup
//       .number()
//       .required(t("validation.quantity.required"))
//       .min(1, t("validation.quantity.min")),
//     transactionType: yup
//       .string()
//       .required(t("validation.transactionType.required")),
//     amount: yup
//       .number()
//       .required(t("validation.amount.required"))
//       .min(0.01, t("validation.amount.min")),
//     tenantId: yup.string().required(t("validation.tenant.required")),
//   });
// };

// function CreateAccountsPayableFormActions() {
//   const { t } = useTranslation("admin-panel-accounts-payables-create");
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
//       {isSubmitting ? t("actions.submitting") : t("actions.submit")}
//     </LoadingButton>
//   );
// }

// function FormCreateAccountsPayable() {
//   const { t } = useTranslation("admin-panel-accounts-payables-create");
//   const validationSchema = useValidationSchema();
//   const fetchPostAccountsPayable = usePostAccountsPayableService();
//   const { enqueueSnackbar } = useSnackbar();
//   const router = useRouter();
//   const { data: tenants } = useGetTenantsQuery();
//   const { data: accounts } = useGetAccountsQuery();
//   const { data: users } = useGetUsersQuery();

//   const methods = useForm<CreateFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       itemName: "",
//       quantity: 1,
//       transactionType: TransactionTypeEnum.PURCHASE,
//       amount: 0,
//       tenantId: "",
//       accountIds: [],
//       ownerIds: [],
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostAccountsPayable(formData);

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
//       router.push("/admin-panel/accounts-payables");
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
//                   name="itemName"
//                   label={t("inputs.itemName")}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormTextInput<CreateFormData>
//                   name="itemDescription"
//                   label={t("inputs.itemDescription")}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <FormTextInput<CreateFormData>
//                   name="quantity"
//                   label={t("inputs.quantity")}
//                   type="number"
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <FormTextInput<CreateFormData>
//                   name="purchasePrice"
//                   label={t("inputs.purchasePrice")}
//                   type="number"
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <FormTextInput<CreateFormData>
//                   name="salePrice"
//                   label={t("inputs.salePrice")}
//                   type="number"
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormSelectInput<
//                   CreateFormData,
//                   { value: AccountTypeEnum; label: string }
//                 >
//                   name="accountType"
//                   label={t("inputs.accountType")}
//                   options={Object.values(AccountTypeEnum).map((type) => ({
//                     value: type,
//                     label: t(`accountType.${type}`),
//                   }))}
//                   keyValue="value"
//                   renderOption={(option) => option.label}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormSelectInput<
//                   CreateFormData,
//                   { value: TransactionTypeEnum; label: string }
//                 >
//                   name="transactionType"
//                   label={t("inputs.transactionType")}
//                   options={Object.values(TransactionTypeEnum).map((type) => ({
//                     value: type,
//                     label: t(`transactionType.${type}`),
//                   }))}
//                   keyValue="value"
//                   renderOption={(option) => option.label}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <FormTextInput<CreateFormData>
//                   name="amount"
//                   label={t("inputs.amount")}
//                   type="number"
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormSelectInput<CreateFormData, Tenant>
//                   name="tenantId"
//                   label={t("inputs.tenant")}
//                   options={tenants?.pages.flatMap((page) => page.data) || []}
//                   keyValue="id"
//                   renderOption={(tenant) => tenant.name}
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <FormSelectInput<CreateFormData, Account>
//                   name="accountIds"
//                   label={t("inputs.accounts")}
//                   options={accounts?.pages.flatMap((page) => page.data) || []}
//                   keyValue="id"
//                   renderOption={(account) => account.name}
//                   multiple
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <FormSelectInput<CreateFormData, User>
//                   name="ownerIds"
//                   label={t("inputs.owners")}
//                   options={users?.pages.flatMap((page) => page.data) || []}
//                   keyValue="id"
//                   renderOption={(user) => `${user.firstName} ${user.lastName}`}
//                   multiple
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Box display="flex" gap={2}>
//                   <CreateAccountsPayableFormActions />
//                   <Button
//                     variant="outlined"
//                     color="inherit"
//                     onClick={() =>
//                       router.push("/admin-panel/accounts-payables")
//                     }
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

// export default withPageRequiredAuth(FormCreateAccountsPayable, {
//   roles: [RoleEnum.ADMIN, RoleEnum.PLATFORM_OWNER],
// });
