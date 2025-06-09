// "use client";

// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { useTranslation } from "@/services/i18n/client";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Popover from "@mui/material/Popover";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { AccountsPayableFilterType } from "./accounts-payable-filter-types";
// import FormSelectInput from "@/components/form/select/form-select";
// import { AccountTypeEnum, TransactionTypeEnum } from "@/services/api/types/accounts-payable";

// type AccountsPayableFilterFormData = AccountsPayableFilterType;

// function AccountsPayableFilter() {
//   const { t } = useTranslation("admin-panel-accounts-payables");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const methods = useForm<AccountsPayableFilterFormData>({
//     defaultValues: {
//       tenantId: "",
//       accountType: "",
//       transactionType: "",
//       itemName: "",
//     },
//   });

//   const { handleSubmit, reset } = methods;

//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "accounts-payable-filter-popover" : undefined;

//   useEffect(() => {
//     const filter = searchParams.get("filter");
//     if (filter) {
//       handleClose();
//       const filterParsed = JSON.parse(filter);
//       reset(filterParsed);
//     }
//   }, [searchParams, reset]);

//   return (
//     <FormProvider {...methods}>
//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "left",
//         }}
//       >
//         <Container sx={{ minWidth: 300, py: 2 }}>
//           <form
//             onSubmit={handleSubmit((data) => {
//               const searchParams = new URLSearchParams(window.location.search);
//               searchParams.set("filter", JSON.stringify(data));
//               router.push(
//                 window.location.pathname + "?" + searchParams.toString()
//               );
//             })}
//           >
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <FormTextInput<AccountsPayableFilterFormData>
//                   name="tenantId"
//                   label={t("filter.tenantId")}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormSelectInput<
//                   AccountsPayableFilterFormData,
//                   { value: AccountTypeEnum; label: string }
//                 >
//                   name="accountType"
//                   label={t("filter.accountType")}
//                   options={Object.values(AccountTypeEnum).map((type) => ({
//                     value: type,
//                     label: t(`accountType.${type}`),
//                   }))}
//                   keyValue="value"
//                   renderOption={(option) => option.label}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormSelectInput<
//                   AccountsPayableFilterFormData,
//                   { value: TransactionTypeEnum; label: string }
//                 >
//                   name="transactionType"
//                   label={t("filter.transactionType")}
//                   options={Object.values(TransactionTypeEnum).map((type) => ({
//                     value: type,
//                     label: t(`transactionType.${type}`),
//                   }))}
//                   keyValue="value"
//                   renderOption={(option) => option.label}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormTextInput<AccountsPayableFilterFormData>
//                   name="itemName"
//                   label={t("filter.itemName")}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Button fullWidth variant="contained" type="submit">
//                   {t("actions.apply")}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </Container>
//       </Popover>
//       <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
//         {t("actions.filter")}
//       </Button>
//     </FormProvider>
//   );
// }

// export default AccountsPayableFilter;
