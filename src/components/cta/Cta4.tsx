"use client";

// @mui
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// @third-party
import { motion } from "framer-motion";

// @project
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";
import ContainerWrapper from "@/components/ContainerWrapper";
import GraphicsCard from "@/components/cards/GraphicsCard";
import SvgIcon from "@/components/SvgIcon";

import { SECTION_COMMON_PY } from "@/utils/constant";

// @assets
import Arrow from "@/images/graphics/Arrow";
import LogoWatermark from "../logo/LogoWatermark";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typeset from "../Typeset";
import OutlinedInput from "@mui/material/OutlinedInput";

/***************************  CALL TO ACTION - 4  ***************************/

interface Cta4Props {
  headLine: React.ReactNode | string;
  list?: { primary: string }[];
  clientContent: string;
  heading?: string;
  caption?: string;
  label?: string;
  input?:
    | boolean
    | { placeholder?: string; adornmentBtn?: object; helpertext?: string };
  primaryBtn?: object;
  secondaryBtn?: object;
  description?: React.ReactNode | string;
  saleData?: { count: number; defaultUnit: string; caption: string };
  profileGroups?: object;
}

export default function Cta4({
  headLine,
  primaryBtn,
  list,
  clientContent,
  heading,
  caption,
  label,
  input = false,
  secondaryBtn,
  description,
}: Cta4Props) {
  const transformValues = {
    xs: "rotate(45deg)",
    sm: "rotate(320deg)",
    md: "unset",
  };

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
          delay: 0.3,
        }}
      >
        <GraphicsCard>
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Grid
              container
              spacing={{ xs: 5, sm: 0, md: 3 }}
              sx={{ alignItems: "flex-end" }}
            >
              <Grid size={{ xs: 12, sm: 9, md: 8 }}>
                <Stack sx={{ gap: 5 }}>
                  <Stack sx={{ gap: { xs: 2, sm: 5 } }}>
                    {typeof headLine === "string" ? (
                      <Typography variant="h2">{headLine}</Typography>
                    ) : (
                      headLine
                    )}
                    {list && (
                      <Stack
                        direction={{ sm: "row" }}
                        sx={{
                          columnGap: { xs: 1, sm: 3 },
                          rowGap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {list.map((item, index) => (
                          <Stack
                            key={index}
                            direction="row"
                            sx={{ gap: 1, alignItems: "center" }}
                          >
                            <SvgIcon
                              name="tabler-rosette-discount-check"
                              color="text.secondary"
                              stroke={1}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {item.primary}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
                <GraphicsCard sx={{ position: "relative" }}>
                  <Stack
                    sx={{
                      alignItems: "flex-start",
                      gap: { xs: 5.75, sm: 10 },
                      p: { xs: 3, sm: 4, md: 8 },
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Stack sx={{ gap: 5 }}>
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={
                            <Typography
                              variant="caption"
                              sx={{ color: "secondary.main" }}
                            >
                              {label}
                            </Typography>
                          }
                          variant="outlined"
                          sx={{
                            borderColor: "grey.600",
                            "& .MuiChip-label": { py: 0.75, px: 2 },
                          }}
                        />
                        <Divider sx={{ width: 63, borderBottomWidth: 2 }} />
                      </Stack>
                      <Typeset
                        {...{
                          heading: heading || "",
                          caption: caption || "",
                          captionProps: { sx: { maxWidth: 478 } },
                        }}
                      />
                    </Stack>
                    {input && typeof input === "object" && (
                      <Stack
                        sx={{ gap: 0.75, width: { sm: "100%", md: "unset" } }}
                      >
                        <OutlinedInput
                          placeholder={
                            input.placeholder || "Enter your email address"
                          }
                          endAdornment={
                            <Button
                              color="primary"
                              variant="contained"
                              sx={{ px: 4, minWidth: { xs: 110, md: 120 } }}
                              {...input.adornmentBtn}
                            />
                          }
                          slotProps={{
                            input: { "aria-label": "Email address" },
                          }}
                          sx={{
                            // ...theme.typography.caption,
                            color: "secondary.main",
                            p: 0.5,
                            whiteSpace: "nowrap",
                            "& .MuiOutlinedInput-input": { p: "6px 20px" },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: 25,
                            },
                          }}
                        />
                        {input.helpertext && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {input.helpertext}
                          </Typography>
                        )}
                      </Stack>
                    )}
                    {(primaryBtn || secondaryBtn || description) && (
                      <Stack
                        sx={{
                          alignItems: "flex-start",
                          gap: 1.5,
                          width: { sm: "100%", md: "60%" },
                          ...(input && { mt: -6 }),
                        }}
                      >
                        {description && typeof description === "string" ? (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {description}
                          </Typography>
                        ) : (
                          description
                        )}
                      </Stack>
                    )}
                  </Stack>
                  <Box
                    sx={{
                      position: "absolute",
                      right: -160,
                      bottom: -160,
                      display: { xs: "none", md: "block" },
                      transform: "scaleX(-1)",
                    }}
                  >
                    <LogoWatermark />
                  </Box>
                </GraphicsCard>
              </Grid>
              <Grid
                sx={{ position: "relative", pl: { md: 3 }, pt: { md: 3 } }}
                size={{ sm: 3, md: 4 }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: -36, sm: -98, md: -68 },
                    right: { xs: -70, sm: 40, md: 100 },
                    transform: transformValues,
                  }}
                >
                  <Arrow />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "primary.main",
                    width: 94,
                    position: "absolute",
                    top: { xs: 6, sm: -160, md: -82 },
                    right: { xs: -160, sm: 0 },
                  }}
                >
                  {clientContent}
                </Typography>
                <Box sx={{ textAlign: "right" }}>
                  <ButtonAnimationWrapper>
                    <Button
                      color="secondary"
                      size="large"
                      variant="contained"
                      sx={{ minWidth: { md: 263 } }}
                      {...primaryBtn}
                    />
                  </ButtonAnimationWrapper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </GraphicsCard>
      </motion.div>
    </ContainerWrapper>
  );
}
// "use client";
// import { useTheme } from "@mui/material/styles";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import ContainerWrapper from "@/components/ContainerWrapper";
// import { motion } from "framer-motion";
// import { SECTION_COMMON_PY } from "@/utils/constant";
// import Button from "@mui/material/Button";

// export default function Cta4({
//   headLine,
//   primaryBtn,
//   list,
//   clientContent,
// }: {
//   headLine: React.ReactNode | string;
//   primaryBtn?: any;
//   list?: { primary: string }[];
//   clientContent: string;
//   heading?: string;
//   caption?: string;
//   label?: string;
//   input?: any;
//   secondaryBtn?: any;
//   description?: React.ReactNode | string;
// }) {
//   const theme = useTheme();
//   const isLight = theme.palette.mode === "light";

//   return (
//     <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.3, delay: 0.3 }}
//       >
//         <Box
//           sx={{
//             p: { xs: 3, sm: 4, md: 5 },
//             borderRadius: 4,
//             bgcolor: isLight ? "background.paper" : "grey.900",
//             boxShadow: isLight
//               ? "0 8px 24px rgba(0,0,0,0.05)"
//               : "0 8px 24px rgba(0,0,0,0.15)",
//           }}
//         >
//           <Stack spacing={4}>
//             {typeof headLine === "string" ? (
//               <Typography variant="h3" sx={{ color: "text.primary" }}>
//                 {headLine}
//               </Typography>
//             ) : (
//               headLine
//             )}

//             {list && (
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                   gap: 2,
//                 }}
//               >
//                 {list.map((item, index) => (
//                   <Stack
//                     key={index}
//                     direction="row"
//                     alignItems="center"
//                     spacing={1}
//                   >
//                     <Box
//                       sx={{
//                         width: 24,
//                         height: 24,
//                         borderRadius: "50%",
//                         bgcolor: "primary.main",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "common.white",
//                       }}
//                     >
//                       ✓
//                     </Box>
//                     <Typography
//                       variant="body1"
//                       sx={{ color: "text.secondary" }}
//                     >
//                       {item.primary}
//                     </Typography>
//                   </Stack>
//                 ))}
//               </Box>
//             )}

//             <Button
//               variant="contained"
//               size="large"
//               sx={{
//                 alignSelf: "flex-start",
//                 background: "linear-gradient(45deg, #FFC107, #ffb300)",
//                 color: "#003d1a",
//                 fontWeight: 700,
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: "50px",
//                 boxShadow: "0 10px 30px rgba(255,193,7,0.4)",
//                 "&:hover": {
//                   boxShadow: "0 20px 40px rgba(255,193,7,0.6)",
//                 },
//               }}
//               {...primaryBtn}
//             >
//               {primaryBtn?.children}
//             </Button>

//             <Typography
//               variant="body1"
//               sx={{ color: "text.secondary", mt: -2 }}
//             >
//               {clientContent}
//             </Typography>
//           </Stack>
//         </Box>
//       </motion.div>
//     </ContainerWrapper>
//   );
// }
