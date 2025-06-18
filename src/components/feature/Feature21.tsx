// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // @mui
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import Box from "@mui/material/Box";

// // @third-party
// import { motion } from "framer-motion";

// // @project
// import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";
// import GraphicsCard from "@/components/cards/GraphicsCard";
// import IconCard from "@/components/cards/GraphicsCard";
// import ContainerWrapper from "@/components/ContainerWrapper";
// import GraphicsImage from "@/components/GraphicsImage";
// import Typeset from "@/components/Typeset";
// import SvgIcon from "@/components/SvgIcon";
// import { SECTION_COMMON_PY } from "@/utils/constant";

// /***************************  FEATURE - 21  ***************************/

// interface Feature21Props {
//   heading?: string;
//   caption?: string;
//   image?: any;
//   features: Array<{
//     icon: string | { name: string; [key: string]: any };
//     title: string;
//     animationDelay?: number;
//   }>;
//   primaryBtn?: any;
//   secondaryBtn?: any;
// }

// export default function Feature21({
//   heading,
//   caption,
//   image,
//   features,
//   primaryBtn,
//   secondaryBtn,
// }: Feature21Props) {
//   const imagePadding = { xs: 3, sm: 4, md: 5 };
//   const iconProps = { color: "text.primary", stroke: 1 };

//   return (
//     <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
//       <Stack sx={{ gap: { xs: 3, sm: 4 } }}>
//         <motion.div
//           initial={{ opacity: 0, y: 5 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{
//             duration: 0.3,
//             delay: 0.3,
//           }}
//         >
//           <Typeset
//             {...{
//               heading: heading || "",
//               caption: caption || "",
//               stackprops: { sx: { textAlign: "center" } },
//             }}
//           />
//         </motion.div>
//         <Stack sx={{ gap: 1.5 }}>
//           {image && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{
//                 duration: 0.3,
//                 delay: 0.3,
//               }}
//             >
//               <GraphicsCard>
//                 <Box
//                   sx={{
//                     pl: imagePadding,
//                     pt: imagePadding,
//                     height: { xs: 204, sm: 300, md: 360 },
//                   }}
//                 >
//                   <GraphicsImage
//                     image={image}
//                     nestedChildren={null}
//                     cardMediaProps={{}}
//                     sx={{
//                       height: 1,
//                       backgroundPositionX: "left",
//                       backgroundPositionY: "top",
//                       borderTopLeftRadius: { xs: 12 },
//                       borderBottomRightRadius: { xs: 20, sm: 32, md: 40 },
//                       border: "5px solid",
//                       borderColor: "grey.200",
//                       borderBottom: "none",
//                       borderRight: "none",
//                     }}
//                   />
//                 </Box>
//               </GraphicsCard>
//             </motion.div>
//           )}
//           <Grid container spacing={1.5}>
//             {features.map((item, index) => (
//               <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{
//                     duration: 0.3,
//                     delay: item.animationDelay,
//                   }}
//                   style={{ height: "100%" }}
//                 >
//                   <IconCard
//                     icon={{
//                       ...(typeof item.icon === "string"
//                         ? { name: item.icon, ...iconProps }
//                         : { ...iconProps, ...item.icon }),
//                     }}
//                     title={item.title}
//                     stackprops={{ sx: { gap: 0 } }}
//                   />
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </Stack>
//         {(primaryBtn || secondaryBtn) && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{
//               duration: 0.3,
//               delay: 0.3,
//             }}
//           >
//             <Stack
//               direction="row"
//               sx={{ alignItems: "center", justifyContent: "center", gap: 1.5 }}
//             >
//               {secondaryBtn && (
//                 <ButtonAnimationWrapper>
//                   <Button
//                     variant="outlined"
//                     startIcon={
//                       <SvgIcon name="tabler-eye" size={16} stroke={3} />
//                     }
//                     {...secondaryBtn}
//                   />
//                 </ButtonAnimationWrapper>
//               )}
//               {primaryBtn && (
//                 <ButtonAnimationWrapper>
//                   <Button
//                     variant="contained"
//                     startIcon={
//                       <SvgIcon
//                         name="tabler-download"
//                         size={16}
//                         stroke={3}
//                         color="background.default"
//                       />
//                     }
//                     {...primaryBtn}
//                   />
//                 </ButtonAnimationWrapper>
//               )}
//             </Stack>
//           </motion.div>
//         )}
//       </Stack>
//     </ContainerWrapper>
//   );
// }
// components/feature/Feature21.tsx
"use client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ContainerWrapper from "@/components/ContainerWrapper";
import { SECTION_COMMON_PY } from "@/utils/constant";

export default function Feature21({
  heading,
  caption,
}: {
  heading: string;
  caption: string;
}) {
  return (
    <Box
      sx={{
        py: SECTION_COMMON_PY,
        background: "#005c24",
        textAlign: "center",
      }}
    >
      <ContainerWrapper>
        <Typography
          variant="h3"
          sx={{
            fontSize: "1.5rem",
            mb: 1,
            color: "#FFC107",
          }}
        >
          {heading}
        </Typography>
        <Typography sx={{ color: "white" }}>{caption}</Typography>
        <Typography
          sx={{
            mt: 3,
            fontSize: "1.2rem",
            color: "#FFC107",
            fontWeight: 700,
          }}
        >
          <strong>Join us on this journey!</strong>
        </Typography>
      </ContainerWrapper>
    </Box>
  );
}
