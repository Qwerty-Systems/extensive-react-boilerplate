// // app/admin-panel/payment-methods/payment-method-filter.tsx
// "use client";

// import { useForm } from "react-hook-form";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import Button from "@mui/material/Button";
// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { PaymentMethodFilterType } from "./payment-method-filter-types";
// import FormCheckbox from "@/components/form/checkbox/form-checkbox";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";

// export default function PaymentMethodFilter() {
//   const { register, handleSubmit, control, reset } = useForm<PaymentMethodFilterType>();
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const debouncedUpdate = useDebouncedCallback((filters: PaymentMethodFilterType) => {
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
//           <FormTextInput<PaymentMethodFilterType>
//             name="name"
//             control={control}
//             label="Name"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormTextInput<PaymentMethodFilterType>
//             name="processorType"
//             control={control}
//             label="Processor Type"
//           />
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <FormCheckbox<PaymentMethodFilterType>
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
