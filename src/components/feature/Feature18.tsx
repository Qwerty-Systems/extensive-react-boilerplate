// "use client";

// import { SetStateAction, useState } from "react";

// // @mui
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";

// // @project
// import ContainerWrapper from "@/components/ContainerWrapper";
// import GraphicsCard from "@/components/cards/GraphicsCard";
// import SvgIcon from "@/components/SvgIcon";
// import Typeset from "@/components/Typeset";
// import { SECTION_COMMON_PY } from "@/utils/constant";

// // @assets
// import GraphicsImage from "@/components/GraphicsImage";

// /***************************  FEATURE - 18  ***************************/

// interface Feature18Props {
//   heading: string;
//   caption: string;
//   topics: Array<{
//     title: string;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     icon: string | { name: string; [key: string]: any };
//     image: string;
//     title2?: string;
//     description?: string;
//     list?: Array<{ primary: string }>;
//     actionBtn?: object;
//     actionBtn2?: object;
//   }>;
// }

// export default function Feature18({
//   heading,
//   caption,
//   topics,
// }: Feature18Props) {
//   const boxPadding = { xs: 3, md: 5 };
//   const imagePadding = { xs: 3, sm: 4, md: 5 };

//   const [value, setValue] = useState("1");

//   // Handle tab change
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleChange = (event: any, newValue: SetStateAction<string>) => {
//     setValue(newValue);
//   };

//   return (
//     <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
//       <Stack sx={{ gap: { xs: 3, sm: 4 } }}>
//         <Typeset
//           {...{
//             heading,
//             caption,
//             stackprops: {
//               sx: {
//                 alignItems: "center",
//                 textAlign: "center",
//                 maxWidth: { sm: 470, md: 800 },
//                 mx: "auto",
//               },
//             },
//           }}
//         />
//         <Stack sx={{ gap: 1.5, alignItems: "center" }}>
//           <TabContext value={value}>
//             <GraphicsCard sx={{ width: { xs: 1, sm: "unset" } }}>
//               <Box sx={{ p: 0.25 }}>
//                 <TabList
//                   onChange={handleChange}
//                   sx={{
//                     "& .MuiTabs-indicator": { display: "none" },
//                     minHeight: "unset",
//                     p: 0.25,
//                   }}
//                   variant="scrollable"
//                 >
//                   {topics.map((item, index) => (
//                     <Tab
//                       label={item.title}
//                       disableFocusRipple
//                       icon={
//                         <SvgIcon
//                           {...(typeof item.icon === "string"
//                             ? { name: item.icon }
//                             : { ...item.icon })}
//                           size={16}
//                           stroke={2}
//                           color="text.secondary"
//                         />
//                       }
//                       value={String(index + 1)}
//                       key={index}
//                       iconPosition="start"
//                       tabIndex={0}
//                       sx={{
//                         minHeight: 44,
//                         borderRadius: 10,
//                         borderWidth: 1,
//                         borderStyle: "solid",
//                         borderColor: "transparent",
//                         "& svg ": { mr: 1 },
//                         "&.Mui-selected": {
//                           bgcolor: "grey.200",
//                           borderColor: "grey.400",
//                           color: "text.primary",
//                           "& svg": { stroke: "text.primary" },
//                         },
//                         "&.Mui-focusVisible": { bgcolor: "grey.300" },
//                         "&:hover": { bgcolor: "grey.200" },
//                       }}
//                     />
//                   ))}
//                 </TabList>
//               </Box>
//             </GraphicsCard>
//             {topics.map((item, index) => (
//               <TabPanel
//                 value={String(index + 1)}
//                 key={index}
//                 sx={{ p: 0, width: 1 }}
//               >
//                 <Grid container spacing={1.5}>
//                   <Grid size={{ xs: 12, sm: 5 }}>
//                     <GraphicsCard>
//                       <Box
//                         sx={{
//                           pl: imagePadding,
//                           pt: imagePadding,
//                           height: { xs: 260, sm: 396, md: 434 },
//                         }}
//                       >
//                         <GraphicsImage
//                           nestedChildren={null}
//                           cardMediaProps={{}}
//                           sx={{
//                             height: 1,
//                             backgroundPositionX: "left",
//                             backgroundPositionY: "top",
//                             border: "5px solid",
//                             borderColor: "grey.200",
//                             borderBottom: "none",
//                             borderRight: "none",
//                             borderTopLeftRadius: { xs: 12 },
//                             borderBottomRightRadius: { xs: 20, sm: 32, md: 40 },
//                           }}
//                           image={item.image}
//                         />
//                       </Box>
//                     </GraphicsCard>
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 7 }}>
//                     <GraphicsCard sx={{ height: 1 }}>
//                       <Stack
//                         sx={{
//                           justifyContent: "space-between",
//                           gap: 5,
//                           height:
//                             item.actionBtn || item.actionBtn2
//                               ? {
//                                   sm: "calc(100% - 98px)",
//                                   md: "calc(100%  - 114px)",
//                                 }
//                               : 1,
//                           pt: boxPadding,
//                           px: boxPadding,
//                         }}
//                       >
//                         <Stack direction="row" sx={{ gap: 1 }}>
//                           <SvgIcon
//                             {...(typeof item.icon === "string"
//                               ? { name: item.icon }
//                               : { ...item.icon })}
//                             size={16}
//                             stroke={2}
//                             color="text.primary"
//                           />
//                           <Typography
//                             variant="subtitle2"
//                             sx={{ color: "text.secondary" }}
//                           >
//                             {item.title}
//                           </Typography>
//                         </Stack>
//                         <Stack sx={{ gap: { xs: 2, md: 3 }, pb: boxPadding }}>
//                           <Stack sx={{ gap: 0.5 }}>
//                             <Typography variant="h4">{item.title2}</Typography>
//                             {item.description && (
//                               <Typography sx={{ color: "text.secondary" }}>
//                                 {item.description}
//                               </Typography>
//                             )}
//                           </Stack>
//                           {item.list && (
//                             <Grid container spacing={{ xs: 0.75, md: 1 }}>
//                               {item.list.map((list, index) => (
//                                 <Grid key={index} size={{ xs: 12, md: 6 }}>
//                                   <Stack
//                                     direction="row"
//                                     sx={{
//                                       gap: 0.5,
//                                       alignItems: "center",
//                                       "& svg.tabler-rosette-discount-check": {
//                                         width: { xs: 16, md: 24 },
//                                         height: { xs: 16, md: 24 },
//                                       },
//                                     }}
//                                   >
//                                     <SvgIcon
//                                       name="tabler-rosette-discount-check"
//                                       stroke={1}
//                                       color="text.secondary"
//                                     />
//                                     <Typography
//                                       variant="body2"
//                                       sx={{ color: "text.secondary" }}
//                                     >
//                                       {list.primary}
//                                     </Typography>
//                                   </Stack>
//                                 </Grid>
//                               ))}
//                             </Grid>
//                           )}
//                         </Stack>
//                       </Stack>
//                       {(item.actionBtn || item.actionBtn2) && (
//                         <GraphicsCard sx={{ bgcolor: "grey.200" }}>
//                           <Stack
//                             direction="row"
//                             sx={{
//                               alignItems: "flex-start",
//                               gap: 1.5,
//                               p: { xs: 2, sm: 3, md: 4 },
//                             }}
//                           >
//                             {item.actionBtn2 && (
//                               <Button
//                                 variant="outlined"
//                                 color="primary"
//                                 startIcon={
//                                   <SvgIcon
//                                     name="tabler-help"
//                                     size={16}
//                                     stroke={3}
//                                   />
//                                 }
//                                 {...item.actionBtn2}
//                               />
//                             )}
//                             {item.actionBtn && (
//                               <Button
//                                 variant="contained"
//                                 color="primary"
//                                 startIcon={
//                                   <SvgIcon
//                                     name="tabler-link"
//                                     size={16}
//                                     stroke={3}
//                                     color="background.default"
//                                   />
//                                 }
//                                 {...item.actionBtn}
//                               />
//                             )}
//                           </Stack>
//                         </GraphicsCard>
//                       )}
//                     </GraphicsCard>
//                   </Grid>
//                 </Grid>
//               </TabPanel>
//             ))}
//           </TabContext>
//         </Stack>
//       </Stack>
//     </ContainerWrapper>
//   );
// }
// components/feature/Feature18.tsx
"use client";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ContainerWrapper from "@/components/ContainerWrapper";
import { motion } from "framer-motion";
import { SECTION_COMMON_PY } from "@/utils/constant";

export default function Feature18({
  heading,
  caption,
  topics,
}: {
  heading: string;
  caption: string;
  topics: any[];
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        py: SECTION_COMMON_PY,
        background: isLight
          ? theme.palette.landing.sections.features.background
          : theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isLight
            ? `linear-gradient(135deg, rgba(0, 61, 26, 0.05) 0%, rgba(0, 92, 36, 0.03) 100%)`
            : `linear-gradient(135deg, rgba(0, 61, 26, 0.15) 0%, rgba(0, 92, 36, 0.1) 100%)`,
          zIndex: 1,
        },
      }}
    >
      <ContainerWrapper>
        <Stack sx={{ gap: { xs: 3, sm: 4 }, position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              fontSize: { xs: "2.5rem", md: "3rem" },
              fontWeight: 800,
              mb: 2,
              background: "linear-gradient(45deg, #FFC107, #00a044)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              color: isLight ? "text.primary" : "common.white",
            }}
          >
            {heading}
          </Typography>

          {caption && (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: isLight ? "text.secondary" : "rgba(255, 255, 255, 0.85)",
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1.1rem", sm: "1.2rem" },
              }}
            >
              {caption}
            </Typography>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(auto-fit, minmax(300px, 1fr))",
              },
              gap: { xs: 2, sm: 3, md: 4 },
              mt: 4,
            }}
          >
            {topics.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                // eslint-disable-next-line no-restricted-syntax
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Box
                  sx={{
                    background: isLight
                      ? "linear-gradient(135deg, #E8F5E9, #C8E6C9)"
                      : "linear-gradient(135deg, #005c24 0%, #008037 100%)",
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: "16px",
                    border: `1px solid ${isLight ? "rgba(0, 128, 55, 0.15)" : "rgba(255, 193, 7, 0.3)"}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: isLight
                      ? "0 8px 24px rgba(0,0,0,0.05)"
                      : "0 8px 24px rgba(0,0,0,0.15)",
                    "&:hover": {
                      boxShadow: isLight
                        ? "0 12px 32px rgba(0,0,0,0.1)"
                        : "0 12px 32px rgba(0,0,0,0.25)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      transition: "left 0.6s ease-in-out",
                    },
                    "&:hover::before": {
                      left: "100%",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      color: isLight ? theme.palette.primary.main : "#FFC107",
                      fontWeight: 700,
                      fontSize: { xs: "1.3rem", sm: "1.4rem" },
                      minHeight: "3.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        mr: 1.5,
                        fontSize: "1.5em",
                        display: "inline-block",
                      }}
                    >
                      {item.title.split(" ")[0]}
                    </Box>
                    {item.title.split(" ").slice(1).join(" ")}
                  </Typography>
                  <Typography
                    sx={{
                      color: isLight
                        ? "text.secondary"
                        : "rgba(255,255,255,0.85)",
                      lineHeight: 1.7,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      flexGrow: 1,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Stack>
      </ContainerWrapper>
    </Box>
  );
}
