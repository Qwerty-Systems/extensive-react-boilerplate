// // eslint-disable-next-line no-restricted-imports
// import {
//   Button,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Input,
// } from "@mui/material";
// import { useConfirmPromise } from "../../hooks/useConfirmPromise";
// import { FormField } from "../../../../components/common/FormField";
// import { useFormik } from "formik";
// import React, {
//   createContext,
//   ReactNode,
//   useCallback,
//   useContext,
//   useMemo,
//   useState,
// } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   ConfirmationFormSchema,
//   validationSchema,
// } from "./confirmation.schema";
// import { Dialog } from "./styles";

// export enum ConfirmationResolution {
//   Confirmed,
//   Rejected,
// }

// export interface Confirmation {
//   title: ReactNode;
//   message?: ReactNode;
//   confirmationString?: string;
// }

// interface ConfirmationContextValue {
//   confirm: (
//     confirmation: Confirmation
//   ) => Promise<ConfirmationResolution | undefined>;
// }

// const ConfirmationContext = createContext<ConfirmationContextValue | null>(
//   null
// );

// export const useConfirmation = () => {
//   const context = useContext(ConfirmationContext);

//   if (!context)
//     throw new Error(
//       "useConfirmation can only be used inside a ConfirmationProvider"
//     );

//   return context;
// };

// export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { t } = useTranslation();

//   const [isOpen, setIsOpen] = useState(false);
//   const [confirmation, setConfirmation] = useState<Confirmation>();
//   const { promise, resolve, reject } =
//     useConfirmPromise<ConfirmationResolution>();

//   const { values, touched, errors, submitForm, handleChange } =
//     useFormik<ConfirmationFormSchema>({
//       enableReinitialize: true,
//       validationSchema,
//       initialValues: {
//         confirmationString: confirmation?.confirmationString || "",
//         confirmation: "",
//       },
//       onSubmit: () => {
//         resolve(ConfirmationResolution.Confirmed);
//       },
//     });

//   const confirm = useCallback(
//     async (conf: Confirmation) => {
//       setIsOpen(true);
//       setConfirmation(conf);

//       try {
//         return await promise();
//       } catch {
//         reject();
//       } finally {
//         setIsOpen(false);
//       }
//     },
//     [promise, reject]
//   );

//   const value = useMemo(() => ({ confirm }), [confirm]);

//   return (
//     <ConfirmationContext.Provider value={value}>
//       <Dialog
//         open={isOpen}
//         onClose={() => resolve(ConfirmationResolution.Rejected)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{confirmation?.title}</DialogTitle>
//         {confirmation?.message && (
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               {confirmation.message}
//             </DialogContentText>
//           </DialogContent>
//         )}
//         {confirmation?.confirmationString && (
//           <DialogContent>
//             <FormField
//               touched={touched.confirmation}
//               error={errors.confirmation}
//               label={t("confirmation_message", {
//                 message: confirmation.confirmationString,
//               })}
//               htmlFor="confirmation-input"
//             >
//               <Input
//                 name="confirmation"
//                 id="confirmation-input"
//                 onChange={handleChange}
//                 value={values.confirmation}
//               />
//             </FormField>
//           </DialogContent>
//         )}
//         <DialogActions sx={{ padding: "16px" }}>
//           <Button
//             variant="text"
//             color="info"
//             onClick={() => resolve(ConfirmationResolution.Rejected)}
//           >
//             {t("cancel")}
//           </Button>
//           <Button
//             onClick={submitForm}
//             color="error"
//             variant="contained"
//             data-test="confirmation-provider-confirm-button"
//           >
//             {t("confirm")}
//           </Button>
//         </DialogActions>
//       </Dialog>
//       {children}
//     </ConfirmationContext.Provider>
//   );
// };
