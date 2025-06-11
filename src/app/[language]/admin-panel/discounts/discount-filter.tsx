// // app/admin-panel/discounts/discount-filter.tsx
// "use client";

// import { useForm } from "react-hook-form";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import Button from "@mui/material/Button";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { DiscountFilterType } from "./discount-filter-types";
// import { DiscountTypeEnum } from "@/services/api/types/discount-type";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import FormCheckbox from "@/components/form/checkbox/form-checkbox";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import { useGetRegionsService } from "@/services/api/services/regions";
// import { useGetUsersService } from "@/services/api/services/users";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import { useEffect, useState } from "react";

// export default function DiscountFilter() {
//   const { register, handleSubmit, control, reset } =
//     useForm<DiscountFilterType>();
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [regions, setRegions] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [paymentPlans, setPaymentPlans] = useState([]);
//   const fetchGetRegions = useGetRegionsService();
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();

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
//         filters: { role: "CUSTOMER" },
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

//   const debouncedUpdate = useDebouncedCallback(
//     (filters: DiscountFilterType) => {
//       const params = new URLSearchParams(searchParams);
//       params.set("filter", JSON.stringify(filters));
//       router.replace(`${pathname}?${params.toString()}`);
//     },
//     500
//   );

//   const handleReset = () => {
//     reset();
//     const params = new URLSearchParams(searchParams);
//     params.delete("filter");
//     router.replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <Box component="form" onChange={handleSubmit(debouncedUpdate)}>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={3}>
//           <FormAutocomplete<DiscountFilterType>
//             name="regionId"
//             control={control}
//             options={regions}
//             getOptionLabel={(option) => option.name}
//             label="Region"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormAutocomplete<DiscountFilterType>
//             name="customerId"
//             control={control}
//             options={customers}
//             getOptionLabel={(option) =>
//               `${option.firstName} ${option.lastName}`
//             }
//             label="Customer"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormAutocomplete<DiscountFilterType>
//             name="planId"
//             control={control}
//             options={paymentPlans}
//             getOptionLabel={(option) => option.name}
//             label="Payment Plan"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormSelectInput<DiscountFilterType>
//             name="type"
//             control={control}
//             label="Type"
//             options={Object.values(DiscountTypeEnum)}
//             renderOption={(option) => option}
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormDatePicker<DiscountFilterType>
//             name="validFrom"
//             control={control}
//             label="Valid From"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormDatePicker<DiscountFilterType>
//             name="validTo"
//             control={control}
//             label="Valid To"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormCheckbox<DiscountFilterType>
//             name="isActive"
//             control={control}
//             label="Active Only"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Button variant="outlined" onClick={handleReset} fullWidth>
//             Reset Filters
//           </Button>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
