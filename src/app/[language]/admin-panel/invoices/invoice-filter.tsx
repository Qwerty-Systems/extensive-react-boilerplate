// // app/admin-panel/invoices/invoice-filter.tsx
// "use client";

// import { useForm } from "react-hook-form";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import Button from "@mui/material/Button";
// import FormSelectInput from "@/components/form/select/form-select";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { InvoiceFilterType } from "./invoice-filter-types";
// import { InvoiceStatus } from "@/services/api/types/invoice-status";
// import FormDatePicker from "@/components/form/date-picker/form-date-picker";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import { useGetUsersService } from "@/services/api/services/users";
// import { useGetPaymentPlansService } from "@/services/api/services/payment-plans";
// import FormAutocomplete from "@/components/form/autocomplete/form-autocomplete";
// import { useEffect, useState } from "react";

// export default function InvoiceFilter() {
//   const { register, handleSubmit, control, reset } = useForm<InvoiceFilterType>();
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [customers, setCustomers] = useState([]);
//   const [paymentPlans, setPaymentPlans] = useState([]);
//   const fetchGetUsers = useGetUsersService();
//   const fetchGetPaymentPlans = useGetPaymentPlansService();

//   useEffect(() => {
//     const fetchData = async () => {
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
//   }, [fetchGetUsers, fetchGetPaymentPlans]);

//   const debouncedUpdate = useDebouncedCallback((filters: InvoiceFilterType) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("filter", JSON.stringify(filters));
//     router.replace(`${pathname}?${params.toString()}`);
//   }, 500);

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
//           <FormSelectInput<InvoiceFilterType>
//             name="status"
//             control={control}
//             label="Status"
//             options={Object.values(InvoiceStatus)}
//             renderOption={(option) => option}
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormAutocomplete<InvoiceFilterType>
//             name="customerId"
//             control={control}
//             options={customers}
//             getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//             label="Customer"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormAutocomplete<InvoiceFilterType>
//             name="planId"
//             control={control}
//             options={paymentPlans}
//             getOptionLabel={(option) => option.name}
//             label="Payment Plan"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormDatePicker<InvoiceFilterType>
//             name="dueDateFrom"
//             control={control}
//             label="Due Date From"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormDatePicker<InvoiceFilterType>
//             name="dueDateTo"
//             control={control}
//             label="Due Date To"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormTextInput<InvoiceFilterType>
//             name="amountMin"
//             control={control}
//             label="Min Amount"
//             type="number"
//             inputProps={{ min: 0, step: 0.01 }}
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormTextInput<InvoiceFilterType>
//             name="amountMax"
//             control={control}
//             label="Max Amount"
//             type="number"
//             inputProps={{ min: 0, step: 0.01 }}
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
