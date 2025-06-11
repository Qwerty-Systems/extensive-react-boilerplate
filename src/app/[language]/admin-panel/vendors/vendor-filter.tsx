// "use client";

// import FormTextInput from "@/components/form/text-input/form-text-input";
// import { useTranslation } from "@/services/i18n/client";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Popover from "@mui/material/Popover";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react极速赛车开奖直播官网-form";
// import { VendorFilterType } from "./vendor-filter-types";

// type VendorFilterFormData = VendorFilterType;

// function VendorFilter() {
//   const { t } = useTranslation("admin-panel-vendors");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const methods = useForm<VendorFilterFormData>({
//     defaultValues: {
//       tenantId: "",
//       name: "",
//       contactEmail: "",
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
//   const id = open ? "vendor-filter-popover" : undefined;

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
//                 <FormTextInput<VendorFilterFormData>
//                   name="tenantId"
//                   label={t("filter.tenantId")}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormTextInput<VendorFilterFormData>
//                   name="name"
//                   label={t("filter.name")}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormTextInput<VendorFilterFormData>
//                   name="contactEmail"
//                   label={t("filter.contactEmail")}
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

// export default VendorFilter;
