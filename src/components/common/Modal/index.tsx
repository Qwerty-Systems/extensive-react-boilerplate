// import { Close } from "@mui/icons-material";
// import Grid from "@mui/material/Grid2";
// import { IconButton, Modal as MUIModal } from "@mui/material";
// import Box from "@mui/material/Box";
// import Menu from "components/common/Menu";
// import React, { ReactNode } from "react";
// import { Loading } from "../Loading";
// import { Paper, Title, Wrapper } from "./styles";

// export type ModalSize = "small" | "medium" | "big";

// export interface ModalProps {
//   title?: string;
//   menuTitle?: string;
//   children?: React.ReactNode;
//   onClose: () => void;
//   isOpen?: boolean;
//   isLoading?: boolean;
//   size?: ModalSize;
//   scrollable?: boolean;
//   showCloseButton?: boolean;
//   menuItems?: ReactNode;
// }

// export const Modal: React.FC<ModalProps> = ({
//   title,
//   menuTitle = "",
//   children,
//   onClose,
//   isLoading,
//   size,
//   isOpen = true,
//   showCloseButton,
//   scrollable,
//   menuItems,
// }) => {
//   return (
//     <MUIModal
//       open={isOpen}
//       onClose={onClose}
//       onClick={(event) => event.stopPropagation()}
//     >
//       <Wrapper>
//         <Paper size={size} scrollable={scrollable}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "end",
//             }}
//           >
//             {menuItems && <Menu title={menuTitle}>{menuItems}</Menu>}
//             {showCloseButton && (
//               <IconButton onClick={onClose}>
//                 <Close />
//               </IconButton>
//             )}
//           </Box>
//           <Grid container>
//             {title && (
//               <Grid size={{ xs: 12 }}>
//                 <Title variant="h6" fontWeight={500}>
//                   {title}
//                 </Title>
//               </Grid>
//             )}
//             <Grid size={{ xs: 12 }}>
//               {isLoading ? <Loading /> : <>{children}</>}
//             </Grid>
//           </Grid>
//         </Paper>
//       </Wrapper>
//     </MUIModal>
//   );
// };
