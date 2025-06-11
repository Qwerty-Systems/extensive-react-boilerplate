// import { Box } from "@mui/material";
// import { useNavigationContext } from "app/global/providers/NavigationProvider";
// import React from "react";
// import BreadCrumbs from "../BreadCrumbs";
// import { Container, Header, SubTitle, Title } from "./styled";

// interface PageContainerProps {
//   title?: string;
//   subTitle?: string;
//   menuContent?: React.ReactNode;
//   chips?: React.ReactNode;
//   children?: React.ReactNode;
// }

// export const PageContainer = ({
//   title,
//   children,
//   menuContent,
//   chips,
//   subTitle,
// }: PageContainerProps) => {
//   const { activeNavigationPath } = useNavigationContext();

//   return (
//     <Container navigationIsActive={!!activeNavigationPath}>
//       <Header>
//         <Box>
//           <BreadCrumbs />
//           <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//             <Title variant="h4">{title}</Title>
//             {chips && chips}
//           </Box>
//           {subTitle && <SubTitle variant="h6">{subTitle}</SubTitle>}
//         </Box>
//         <Box>{menuContent}</Box>
//       </Header>
//       <Box>{children}</Box>
//     </Container>
//   );
// };
