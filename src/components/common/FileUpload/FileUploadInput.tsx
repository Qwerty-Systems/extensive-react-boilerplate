// import { TextField, Typography } from "@mui/material";
// import {
//   DeleteOutline,
//   PictureAsPdf,
//   Image,
//   Description,
//   TextSnippet,
// } from "@mui/icons-material";
// import { FormField } from "components/common/FormField";
// import { Container, FileCard, FileIcon } from "./styles";
// import { useTranslation } from "react-i18next";
// import { AttachmentsSchema } from "./FileUploadModal";
// import { useFormikContext, getIn } from "formik";
// import {
//   ACCEPTED_ATTACHMENT_CONTENT_TYPE,
//   ACCEPTED_FILE_UPLOAD_CONTENT_TYPE,
// } from "app/global/constants/contentTypes";
// import { formatBytes } from "app/global/constants/formatBytes";
// import Grid from "@mui/material/Grid2";

// type FileUploadInputProps = {
//   index: number;
//   onDelete: () => void;
//   isFile?: boolean;
// };

// export const FileUploadInput = ({
//   onDelete,
//   index,
//   isFile,
// }: FileUploadInputProps) => {
//   const { t } = useTranslation();

//   const { values, errors, touched, handleChange } =
//     useFormikContext<AttachmentsSchema>();
//   const getFileIcon = () => {
//     if (isFile) {
//       switch (
//         values.attachments?.[index]
//           ?.contentType as ACCEPTED_FILE_UPLOAD_CONTENT_TYPE
//       ) {
//         case "application/vnd.ms-excel":
//           return <TextSnippet sx={{ fontSize: 32, fill: "#10B981" }} />;
//         default:
//           return <Description sx={{ fontSize: 32, fill: "#10B981" }} />;
//       }
//     } else {
//       switch (
//         values.attachments?.[index]
//           ?.contentType as ACCEPTED_ATTACHMENT_CONTENT_TYPE
//       ) {
//         case "application/pdf":
//           return <PictureAsPdf sx={{ fontSize: 32, fill: "#10B981" }} />;
//         case "image/jpeg":
//         case "image/png":
//           return <Image sx={{ fontSize: 32, fill: "#10B981" }} />;
//         default:
//           return <Description sx={{ fontSize: 32, fill: "#10B981" }} />;
//       }
//     }
//   };

//   return (
//     <Container elevation={1}>
//       <Grid container alignItems="center">
//         <Grid size={{ xs: 12 }}>
//           <FileCard>
//             <FileIcon>{getFileIcon()}</FileIcon>
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12 }}>
//                 <FormField
//                   error={getIn(errors, `attachments[${index}].name`)}
//                   touched={Boolean(touched.attachments)}
//                   htmlFor={`file-upload-input-description-${index}`}
//                 >
//                   <TextField
//                     sx={{ width: "100%" }}
//                     id={`file-upload-input-name-${index}`}
//                     name={`attachments.${index}.name`}
//                     size="small"
//                     variant="outlined"
//                     value={values.attachments?.[index]?.name}
//                     label={t("name")}
//                     onChange={handleChange}
//                   />
//                 </FormField>
//               </Grid>
//               <Grid size={{ xs: 12 }}>
//                 <FormField
//                   error={getIn(errors, `attachments[${index}].description`)}
//                   touched={Boolean(touched.attachments)}
//                   htmlFor={`file-upload-input-description-${index}`}
//                 >
//                   <TextField
//                     sx={{ width: "100%" }}
//                     id={`file-upload-input-description-${index}`}
//                     name={`attachments.${index}.description`}
//                     size="small"
//                     variant="outlined"
//                     value={values.attachments?.[index]?.description}
//                     label={t("description")}
//                     onChange={handleChange}
//                   />
//                 </FormField>
//               </Grid>
//               <Grid
//                 container
//                 size={{ xs: 12 }}
//                 sx={{ justifyContent: "space-between" }}
//               >
//                 <Grid container size={{ xs: 12 }} flexDirection={"column"}>
//                   <Typography variant="caption" color="textSecondary">
//                     {values.attachments?.[index]?.fileName}
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     {formatBytes(
//                       values.attachments?.[index]?.contentLengthInBytes
//                     )}
//                   </Typography>
//                 </Grid>

//                 <Grid>
//                   <DeleteOutline
//                     onClick={onDelete}
//                     sx={{ cursor: "pointer", mr: 1, mt: 1 }}
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>
//           </FileCard>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };
