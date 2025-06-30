// import { useCallback } from "react";
// import { useDropzone, Accept } from "react-dropzone";
// import { useTranslation } from "react-i18next";
// import { LoadingButton } from "@mui/lab";
// import { FormikProvider, useFormik, FieldArray, ArrayHelpers } from "formik";
// import { UploadFile } from "@mui/icons-material";
// import { FileUploadInput } from "./FileUploadInput";
// import { DragContainer } from "./styles";
// import * as yup from "yup";
// import {
//   ACCEPTED_ATTACHMENT_CONTENT_TYPE,
//   ACCEPTED_ATTACHMENT_CONTENT_TYPES,
//   ACCEPTED_FILE_UPLOAD_CONTENT_TYPE,
//   ACCEPTED_FILE_UPLOAD_CONTENT_TYPES,
// } from "app/global/constants/contentTypes";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import { formatBytes } from "@/services/global/constants/formatBytes";
// import { useTheme } from "@mui/material/styles";

// const attachment_schema = yup.object().shape({
//   attachments: yup
//     .array(
//       yup.object({
//         name: yup.string().required().default(""),
//         file: yup.mixed().required(),
//         description: yup.string().default(""),
//         fileName: yup.string().required().default(""),
//         contentType: yup
//           .mixed<ACCEPTED_ATTACHMENT_CONTENT_TYPE>()
//           .oneOf([...ACCEPTED_ATTACHMENT_CONTENT_TYPES])
//           .required(),
//         contentLengthInBytes: yup.number().integer().required().min(0),
//         extension: yup.string().default(""),
//       })
//     )
//     .default([]),
// });
// const file_upload_schema = yup.object().shape({
//   files: yup
//     .array(
//       yup.object({
//         name: yup.string().required().default(""),
//         file: yup.mixed().required(),
//         description: yup.string().default(""),
//         fileName: yup.string().required().default(""),
//         contentType: yup
//           .mixed<ACCEPTED_FILE_UPLOAD_CONTENT_TYPE>()
//           .oneOf([...ACCEPTED_FILE_UPLOAD_CONTENT_TYPES])
//           .required(),
//         contentLengthInBytes: yup.number().integer().required().min(0),
//         extension: yup.string().default(""),
//       })
//     )
//     .default([]),
// });
// export type AttachmentsSchema = yup.InferType<typeof attachment_schema>;
// export type FileUploadSchema = yup.InferType<typeof file_upload_schema>;

// type FileUploadModalProps = {
//   title: string;
//   handleClose: () => void;
//   handleSubmit: (values: AttachmentsSchema | FileUploadSchema) => void;
//   acceptedFileTypes: Accept;
//   maxSize: number;
//   loading: boolean;
//   type?: "attachment" | "file_upload"; // type is optional so an not to break the existing attachment service implementation
// };

// type FileType = {
//   name: string;
//   file: File;
//   description: string;
//   fileName: string;
//   contentType: string;
//   contentLengthInBytes: number;
//   extension: string;
// };

// type FormValues = {
//   files?: FileType[];
//   attachments?: FileType[];
// };

// export function FileUploadModal(props: FileUploadModalProps) {
//   const { t } = useTranslation();
//   const { palette } = useTheme();

//   const initialValues: FormValues =
//     props.type === "file_upload" ? { files: [] } : { attachments: [] };
//   const formik = useFormik<FormValues>({
//     initialValues,
//     validationSchema:
//       props.type === "file_upload" ? file_upload_schema : attachment_schema,
//     onSubmit: (
//       values:
//         | { attachments: { [x: string]: any }[] }
//         | { files: { [x: string]: any }[] },
//       formikHelpers: { setSubmitting: (arg0: boolean) => void }
//     ) => {
//       props.handleSubmit(values as AttachmentsSchema | FileUploadSchema);
//       formikHelpers.setSubmitting(false);
//     },
//   });

//   const { submitForm, setFieldValue } = formik;
//   const arrayName = props.type === "file_upload" ? "files" : "attachments";

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const newFiles = acceptedFiles.map((file) => {
//         return {
//           file: file,
//           fileName: file.name,
//           name: file.name.replace(/\.[^/.]+$/, ""),
//           extension: file.name.split(".").pop(),
//           contentType: file.type,
//           contentLengthInBytes: file.size,
//           description: "",
//         };
//       });
//       setFieldValue(arrayName, [
//         ...(formik.values[arrayName] || []),
//         ...newFiles,
//       ]);
//     },
//     [setFieldValue, formik, arrayName]
//   );

//   const {
//     fileRejections,
//     getRootProps,
//     getInputProps,
//     isFocused,
//     isDragAccept,
//     isDragReject,
//   } = useDropzone({
//     onDrop,
//     accept: props.acceptedFileTypes,
//     maxSize: props.maxSize,
//   });

//   return (
//     <FormikProvider value={formik}>
//       <Modal title={props.title} onClose={props.handleClose} size="medium">
//         <Grid container columnSpacing={3} spacing={1} sx={{ width: "100%" }}>
//           <Grid size={{ xs: 12 }}>
//             <DragContainer
//               {...getRootProps({ isFocused, isDragAccept, isDragReject })}
//             >
//               <input {...getInputProps()} />

//               <Grid container flexDirection={"column"} alignItems={"center"}>
//                 <UploadFile
//                   fontSize={"large"}
//                   color={
//                     isDragAccept
//                       ? "primary"
//                       : isDragReject
//                         ? "error"
//                         : "inherit"
//                   }
//                 />
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     mt: 1,
//                     color: palette. === "dark" ? "white" : "grey",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {t("drag_and_drop_here")}{" "}
//                   <strong>
//                     <u>{t("choose_file")}</u>
//                   </strong>
//                 </Typography>
//               </Grid>
//             </DragContainer>
//           </Grid>
//           <Grid container size={{ xs: 12 }} sx={{ justifyContent: "flex-end" }}>
//             {fileRejections.length > 0 && (
//               <Typography variant="caption" color="error" sx={{ mr: "auto" }}>
//                 {t("files_rejected")}
//               </Typography>
//             )}
//             <Typography variant="caption" color="textSecondary">
//               {t("maximum_size")}: {formatBytes(props.maxSize)}
//             </Typography>
//           </Grid>
//           <FieldArray name={arrayName}>
//             {({
//               remove,
//             }: ArrayHelpers<AttachmentsSchema[] | FileUploadSchema[]>) => (
//               <>
//                 {formik.values[arrayName] &&
//                   formik.values[arrayName]?.length > 0 && (
//                     <Grid size={{ xs: 12 }}>
//                       <Typography
//                         variant="body1"
//                         sx={{ fontWeight: 500, mb: 2 }}
//                       >
//                         {t("files")}:
//                       </Typography>
//                       <Box
//                         sx={{
//                           maxHeight: "calc(100vh - 600px)",
//                           overflowY: "auto",
//                         }}
//                       >
//                         {(formik.values[arrayName] || []).map(
//                           (file: { fileName: any }, index: number) => (
//                             <FileUploadInput
//                               index={index}
//                               key={`${file?.fileName ?? "file"}-${index}`}
//                               onDelete={() => remove(index)}
//                               isFile={true}
//                             />
//                           )
//                         )}
//                       </Box>
//                     </Grid>
//                   )}
//               </>
//             )}
//           </FieldArray>

//           <Grid
//             container
//             sx={{ justifyContent: "flex-end", alignItems: "center", mt: 3 }}
//           >
//             {props.loading && (
//               <Box>
//                 <Typography color="error" sx={{ mr: 2 }}>
//                   {t("dont_close_window_while_uploading")}
//                 </Typography>
//               </Box>
//             )}
//             <Button onClick={props.handleClose} variant="text">
//               {t("cancel")}
//             </Button>
//             <LoadingButton
//               sx={{ ml: 2 }}
//               loading={props.loading}
//               variant="contained"
//               onClick={submitForm}
//             >
//               {t("upload")}
//             </LoadingButton>
//           </Grid>
//         </Grid>
//       </Modal>
//     </FormikProvider>
//   );
// }
