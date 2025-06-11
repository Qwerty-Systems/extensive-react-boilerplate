// // app/admin-panel/discounts/create.tsx
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
// import { usePostDiscountService } from "@/services/api/services/discounts";
// import { useRouter } from "next/navigation";
// import { DiscountTypeEnum } from "@/services/api/types/discount-type";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import FormCheckbox from "@/components/form/checkbox/form-checkbox";
// import { useGetRegionsService } from "@/services/api/services/regions";
// import { useGetUsersService } from "@/services/api/services/users";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";

// type CreateDiscountFormData = {
//   description?: string | null;
//   minVolume?: number | null;
//   tenantId: string;
//   regionId?: string | null;
//   customerId?: string | null;
//   planId?: string | null;
//   isActive: boolean;
//   validTo: Date;
//   validFrom: Date;
//   value: number;
//   type: DiscountTypeEnum;
// };

// const useValidationSchema = () => {
//   const { t } = useTranslation("admin-panel-discounts-create");

//   return yup.object().shape({
//     description: yup
//       .string()
//       .nullable(),
//     minVolume: yup
//       .number()
//       .positive()
//       .nullable(),
//     tenantId: yup
//       .string()
//       .required(t("admin-panel-discounts-create:inputs.tenantId.validation.required")),
//     value: yup
//       .number()
//       .positive()
//       .required(t("admin-panel-discounts-create:inputs.value.validation.required")),
//     type: yup
//       .string()
//       .required(t("admin-panel-discounts-create:inputs.type.validation.required")),
//     validFrom: yup
//       .date()
//       .required(t("admin-panel-discounts-create:inputs.validFrom.validation.required")),
//     validTo: yup
//       .date()
//       .required(t("admin-panel-discounts-create:inputs.validTo.validation.required"))
//       .min(
//         yup.ref("validFrom"),
//         t("admin-panel-discounts-create:inputs.validTo.validation.min")
//       ),
//   });
// };

// function CreateDiscountFormActions() {
//   const { t } = useTranslation("admin-panel-discounts-create");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-discounts-create:actions.submit")}
//     </Button>
//   );
// }

// function FormCreateDiscount() {
//   const router = useRouter();
//   const fetchPostDiscount = usePostDiscountService();
//   const fetchGetRegions = useGetRegionsService();
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();
//   const { t } = useTranslation("admin-panel-discounts-create");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [regions, setRegions] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [paymentPlans, setPaymentPlans] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const regionsResponse = await fetchGetRegions({
//         page: 1,
//         limit: 100,
//       });
//       if (regionsResponse.status === HTTP_CODES_ENUM.OK) {
//         setRegions(regionsResponse.data.data);
//       }

//       const customersResponse = await fetchGetUsers({
//         page: 1,
//         limit: 100,
//         filters: { role: "CUSTOMER" }
//       });
//       if (customersResponse.status === HTTP_CODES_ENUM.OK) {
//         setCustomers(customersResponse.data.data);
//       }

//       const plansResponse = await fetchGetPaymentPlans({
//         page: 1,
//         limit: 100,
//       });
//       if (plansResponse.status === HTTP_CODES_ENUM.OK) {
//         setPaymentPlans(plansResponse.data.data);
//       }
//     };

//     fetchData();
//   }, [fetchGetRegions, fetchGetUsers, fetchGetPaymentPlans]);

//   const methods = useForm<CreateDiscountFormData>({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       isActive: true,
//       validFrom: new Date(),
//       validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//       value: 0,
//       type: DiscountTypeEnum.PERCENTAGE,
//     },
//   });

//   const { handleSubmit, setError } = methods;

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPostDiscount({
//       ...formData,
//       tenantId: "current-tenant-id", // Replace with actual tenant ID
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof CreateDiscountFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-discounts-create:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.CREATED) {
//       enqueueSnackbar(t("admin-panel-discounts-create:alerts.discount.success"), {
//         variant: "success",
//       });
//       router.push("/admin-panel/discounts");
//     }
//   });

//   return (
//     <FormProvider {...methods}>
//       <Container maxWidth="md">
//         <form onSubmit={onSubmit}>
//           <Grid container spacing={2} mb={3} mt={3}>
//             <Grid item xs={12}>
//               <Typography variant="h6">
//                 {t("admin-panel-discounts-create:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<CreateDiscountFormData>
//                 name="description"
//                 label={t("admin-panel-discounts-create:inputs.description.label")}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormSelectInput<CreateDiscountFormData>
//                 name="type"
//                 label={t("admin-panel-discounts-create:inputs.type.label")}
//                 options={Object.values(DiscountTypeEnum)}
//                 renderOption={(option) =>
//                   t(`admin-panel-discounts-create:inputs.type.options.${option}`)
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormTextInput<CreateDiscountFormData>
//                 name="value"
//                 type="number"
//                 label={t("admin-panel-discounts-create:inputs.value.label")}
//                 inputProps={{ step: "0.01" }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<CreateDiscountFormData>
//                 name="validFrom"
//                 label={t("admin-panel-discounts-create:inputs.validFrom.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<CreateDiscountFormData>
//                 name="validTo"
//                 label={t("admin-panel-discounts-create:inputs.validTo.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormTextInput<CreateDiscountFormData>
//                 name="minVolume"
//                 type="number"
//                 label={t("admin-panel-discounts-create:inputs.minVolume.label")}
//                 inputProps={{ min: 0 }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormCheckbox<CreateDiscountFormData>
//                 name="isActive"
//                 label={t("admin-panel-discounts-create:inputs.isActive.label")}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateDiscountFormData>
//                 name="regionId"
//                 label={t("admin-panel-discounts-create:inputs.regionId.label")}
//                 options={regions}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateDiscountFormData>
//                 name="customerId"
//                 label={t("admin-panel-discounts-create:inputs.customerId.label")}
//                 options={customers}
//                 getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<CreateDiscountFormData>
//                 name="planId"
//                 label={t("admin-panel-discounts-create:inputs.planId.label")}
//                 options={paymentPlans}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CreateDiscountFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/discounts"
//                 >
//                   {t("admin-panel-discounts-create:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function CreateDiscount() {
//   return <FormCreateDiscount />;
// }

// export default withPageRequiredAuth(CreateDiscount);
