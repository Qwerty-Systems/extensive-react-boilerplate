// import { ReactNode } from "react";
// import GlobalStyles from "@mui/material/GlobalStyles";
// import { SystemStyleObject } from "@mui/system/styleFunctionSx/styleFunctionSx";
// import { Theme } from "@mui/system";
// import { PageCardedHeader } from "./PageCardedHeader";
// import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
// import { Sidebar } from "../SideBar";

// /**
//  * Props for the PageCarded component.
//  */
// type PageCardedProps = SystemStyleObject<Theme> & {
//   sidebarContent?: ReactNode;
//   sidebarVariant?: "permanent" | "persistent" | "temporary";
//   header?: ReactNode;
//   content?: ReactNode;
//   scroll?: "normal" | "page" | "content";
//   rightSidebarOnClose?: boolean;
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// };

// /**
//  * The PageCarded component is a carded page layout with left and right sidebars.
//  */
// export const Index = ({
//   scroll = "page",
//   header,
//   content,
//   sidebarContent,
//   sidebarVariant = "permanent",
//   isOpen,
//   setIsOpen,
// }: PageCardedProps) => {
//   return (
//     <>
//       <GlobalStyles
//         styles={() => ({
//           ...(scroll !== "page" && {
//             "#fuse-toolbar": {
//               position: "static",
//             },
//             "#fuse-footer": {
//               position: "static",
//             },
//           }),
//           ...(scroll === "page" && {
//             "#fuse-toolbar": {
//               position: "sticky",
//               top: 0,
//             },
//             "#fuse-footer": {
//               position: "sticky",
//               bottom: 0,
//             },
//           }),
//         })}
//       />

//       {header && <PageCardedHeader header={header} />}
//       <Paper
//         sx={{
//           position: "relative",
//           zIndex: 10,
//           height: "100%",
//           flex: "auto",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           borderRadius: "16px 16px 0 0",
//           boxShadow: 1, // Matches shadow-1
//         }}
//       >
//         <Box>
//           {content && <Box>{content}</Box>}

//           <Sidebar
//             position="right"
//             variant={sidebarVariant || "permanent"}
//             open={isOpen}
//             onClose={setIsOpen}
//             content={sidebarContent}
//           />
//         </Box>
//       </Paper>
//     </>
//   );
// };
