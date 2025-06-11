// // app/admin-panel/discounts/edit.tsx
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
//   useGetDiscountService,
//   usePatchDiscountService,
// } from "@/services/api/services/discounts";
// import { useParams } from "next/navigation";
// import { DiscountTypeEnum } from "@/services/api/types/discount-type";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import FormCheckbox from "@/components/form/checkbox/form-checkbox";
// import { useGetRegionsService } from "@/services/api/services/regions";
// import { useGetUsersService } from "@/services/api/services/users";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { DiscountEntity } from "@/services/api/types/discount";

// type EditDiscountFormData = {
//   description?: string | null;
//   minVolume?: number | null;
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
//   const { t } = useTranslation("admin-panel-discounts-edit");

//   return yup.object().shape({
//     description: yup
//       .string()
//       .nullable(),
//     minVolume: yup
//       .number()
//       .positive()
//       .nullable(),
//     value: yup
//       .number()
//       .positive()
//       .required(t("admin-panel-discounts-edit:inputs.value.validation.required")),
//     type: yup
//       .string()
//       .required(t("admin-panel-discounts-edit:inputs.type.validation.required")),
//     validFrom: yup
//       .date()
//       .required(t("admin-panel-discounts-edit:inputs.validFrom.validation.required")),
//     validTo: yup
//       .date()
//       .required(t("admin-panel-discounts-edit:inputs.validTo.validation.required"))
//       .min(
//         yup.ref("validFrom"),
//         t("admin-panel-discounts-edit:inputs.validTo.validation.min")
//       ),
//   });
// };

// function EditDiscountFormActions() {
//   const { t } = useTranslation("admin-panel-discounts-edit");
//   const { isSubmitting, isDirty } = useFormState();
//   useLeavePage(isDirty);

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={isSubmitting}
//     >
//       {t("admin-panel-discounts-edit:actions.submit")}
//     </Button>
//   );
// }

// function FormEditDiscount() {
//   const params = useParams<{ id: string }>();
//   const discountId = params.id;
//   const fetchGetDiscount = useGetDiscountService();
//   const fetchPatchDiscount = usePatchDiscountService();
//   const fetchGetRegions = useGetRegionsService();
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();
//   const { t } = useTranslation("admin-panel-discounts-edit");
//   const validationSchema = useValidationSchema();
//   const { enqueueSnackbar } = useSnackbar();

//   const [regions, setRegions] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [paymentPlans, setPaymentPlans] = useState([]);
//   const [initialData, setInitialData] = useState<DiscountEntity | null>(null);

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

//       const discountResponse = await fetchGetDiscount({
//         id: discountId
//       });
//       if (discountResponse.status === HTTP_CODES_ENUM.OK) {
//         setInitialData(discountResponse.data);
//       }
//     };

//     fetchData();
//   }, [discountId, fetchGetDiscount, fetchGetRegions, fetchGetUsers, fetchGetPaymentPlans]);

//   const methods = useForm<EditDiscountFormData>({
//     resolver: yupResolver(validationSchema),
//   });

//   const { handleSubmit, setError, reset } = methods;

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         description: initialData.description,
//         minVolume: initialData.minVolume || undefined,
//         regionId: initialData.region?.id || undefined,
//         customerId: initialData.customer?.id || undefined,
//         planId: initialData.plan?.id || undefined,
//         isActive: initialData.isActive,
//         validFrom: new Date(initialData.validFrom),
//         validTo: new Date(initialData.validTo),
//         value: initialData.value,
//         type: initialData.type,
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = handleSubmit(async (formData) => {
//     const { status, data } = await fetchPatchDiscount({
//       id: discountId,
//       data: formData
//     });

//     if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
//       (Object.keys(data.errors) as Array<keyof EditDiscountFormData>).forEach(
//         (key) => {
//           setError(key, {
//             type: "manual",
//             message: t(
//               `admin-panel-discounts-edit:inputs.${key}.validation.server.${data.errors[key]}`
//             ),
//           });
//         }
//       );
//       return;
//     }

//     if (status === HTTP_CODES_ENUM.OK) {
//       enqueueSnackbar(t("admin-panel-discounts-edit:alerts.discount.success"), {
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
//                 {t("admin-panel-discounts-edit:title")}
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <FormTextInput<EditDiscountFormData>
//                 name="description"
//                 label={t("admin-panel-discounts-edit:inputs.description.label")}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormSelectInput<EditDiscountFormData>
//                 name="type"
//                 label={t("admin-panel-discounts-edit:inputs.type.label")}
//                 options={Object.values(DiscountTypeEnum)}
//                 renderOption={(option) =>
//                   t(`admin-panel-discounts-edit:inputs.type.options.${option}`)
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormTextInput<EditDiscountFormData>
//                 name="value"
//                 type="number"
//                 label={t("admin-panel-discounts-edit:inputs.value.label")}
//                 inputProps={{ step: "0.01" }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<EditDiscountFormData>
//                 name="validFrom"
//                 label={t("admin-panel-discounts-edit:inputs.validFrom.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormDatePicker<EditDiscountFormData>
//                 name="validTo"
//                 label={t("admin-panel-discounts-edit:inputs.validTo.label")}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormTextInput<EditDiscountFormData>
//                 name="minVolume"
//                 type="number"
//                 label={t("admin-panel-discounts-edit:inputs.minVolume.label")}
//                 inputProps={{ min: 0 }}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormCheckbox<EditDiscountFormData>
//                 name="isActive"
//                 label={t("admin-panel-discounts-edit:inputs.isActive.label")}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<EditDiscountFormData>
//                 name="regionId"
//                 label={t("admin-panel-discounts-edit:inputs.regionId.label")}
//                 options={regions}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<EditDiscountFormData>
//                 name="customerId"
//                 label={t("admin-panel-discounts-edit:inputs.customerId.label")}
//                 options={customers}
//                 getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormAutocomplete<EditDiscountFormData>
//                 name="planId"
//                 label={t("admin-panel-discounts-edit:inputs.planId.label")}
//                 options={paymentPlans}
//                 getOptionLabel={(option) => option.name}
//                 keyValue="id"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <EditDiscountFormActions />
//               <Box ml={1} component="span">
//                 <Button
//                   variant="contained"
//                   color="inherit"
//                   LinkComponent={Link}
//                   href="/admin-panel/discounts"
//                 >
//                   {t("admin-panel-discounts-edit:actions.cancel")}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Container>
//     </FormProvider>
//   );
// }

// function EditDiscount() {
//   return <FormEditDiscount />;
// }

// export default withPageRequiredAuth(EditDiscount);
