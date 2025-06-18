// "use client";
// /* eslint-disable @typescript-eslint/no-explicit-any */

// // @mui
// import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";

// // @third-party
// import { motion } from "framer-motion";

// // @project
// import branding from "@/branding.json";
// import GraphicsCard from "@/components/cards/GraphicsCard";
// import ContainerWrapper from "@/components/ContainerWrapper";
// import LogoSection from "@/components/logo";

// import { CopyrightType } from "@/enum";
// import { SECTION_COMMON_PY } from "@/utils/constant";
// import Sitemap from "@/components/footer/Sitemap";
// import Copyright from "@/components/footer/Copyright";
// import FollowUS from "@/components/footer/FollowUS";

// // @types

// /***************************  FOOTER - 7 DATA  ***************************/

// const linkProps = { target: "_blank", rel: "noopener noreferrer" };
// const data = [
//   {
//     id: "company",
//     grid: { size: { xs: 6, sm: "auto" } },
//     title: "Company",
//     menu: [
//       {
//         label: "Why SakaTaka?",
//         link: {
//           href: "/",
//           ...linkProps,
//         },
//       },
//       {
//         label: "About",
//         link: { href: "/", ...linkProps },
//       },
//       {
//         label: "Contact Us",
//         link: { href: "/", ...linkProps },
//       },
//     ],
//   },
//   {
//     id: "support",
//     grid: { size: { xs: 6, sm: "auto" } },
//     title: "Support",
//     menu: [
//       {
//         label: "Pricing",
//         link: { href: "#" },
//       },
//       {
//         label: "FAQ",
//         link: { href: "#" },
//       },
//       {
//         label: "Support",
//         link: { href: branding.company.socialLink.support, ...linkProps },
//       },
//       {
//         label: "License Terms",
//         link: { href: "https://mui.com/store/license/", ...linkProps },
//       },
//     ],
//   },
//   {
//     id: "resources",
//     grid: { size: { xs: 12, sm: "auto" } },
//     title: "Resources",
//     menu: [
//       {
//         label: "Documentation",
//         link: { href: "/", ...linkProps },
//       },
//       {
//         label: "Blog",
//         link: { href: "/", ...linkProps },
//       },
//       {
//         label: "Privacy Policy",
//         link: { href: "/", ...linkProps },
//       },
//     ],
//   },
// ];

// /* const iconProps = { color: "text.secondary" };
//  */
// const usefullLinks: any[] = [
//   // {
//   //   icon: <SvgIcon name="tabler-brand-figma" {...iconProps} />,
//   //   title: "Figma Version 1.0.0",
//   //   href: "https://www.figma.com/community/file/1425095061180549847",
//   // },
//   // {
//   //   icon: <SvgIcon name="tabler-route" {...iconProps} />,
//   //   title: "React Material UI v6.1.4",
//   //   href: "https://mui.com/material-ui/getting-started",
//   // },
//   // {
//   //   icon: <SvgIcon name="tabler-sparkles" {...iconProps} />,
//   //   title: "Documentation",
//   //   href: "/",
//   // },
// ];

// /***************************  FOOTER - 7  ***************************/

// export default function Footer7() {
//   const logoFollowContent = (
//     <Stack sx={{ alignItems: "flex-start", gap: { xs: 1.5, sm: 3 } }}>
//       <LogoSection />
//       <Typography
//         variant="h6"
//         sx={{ maxWidth: { sm: 280 }, mb: { xs: -1, sm: -2.5 } }}
//       >
//         {process.env.NEXT_PUBLIC_VERSION}
//       </Typography>
//       <Typography variant="body2" sx={{ maxWidth: { sm: 280 } }}>
//         We’re on a mission to revolutionize waste management.
//       </Typography>
//     </Stack>
//   );

//   return (
//     <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
//       <Stack
//         id="footer-7"
//         role="contentinfo"
//         rel="noopener noreferrer"
//         aria-label="Footer 7"
//         sx={{ gap: { xs: 3, sm: 4, md: 5 } }}
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{
//             duration: 0.5,
//             delay: 0.4,
//           }}
//         >
//           <Grid container spacing={{ xs: 4, md: 3 }}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Stack
//                 direction={{ sm: "row", md: "column" }}
//                 sx={{ gap: 3, justifyContent: "space-between", height: 1 }}
//               >
//                 {logoFollowContent}
//                 <Stack sx={{ gap: { xs: 2, sm: 2.5, md: 3 } }}>
//                   {usefullLinks.map((item, index) => (
//                     <Stack
//                       direction="row"
//                       sx={{ gap: 1, alignItems: "center" }}
//                       key={index}
//                     >
//                       {item.icon}
//                       <Link
//                         variant="body2"
//                         color="text.secondary"
//                         href={item.href}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         aria-label="Usefull Links"
//                       >
//                         {item.title}
//                       </Link>
//                     </Stack>
//                   ))}
//                 </Stack>
//               </Stack>
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Sitemap list={data} isMenuDesign />
//             </Grid>
//           </Grid>
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{
//             duration: 0.5,
//             delay: 0.4,
//           }}
//         >
//           <GraphicsCard sx={{ borderRadius: { xs: 6, sm: 8 } }}>
//             <Stack
//               direction={{ sm: "row" }}
//               sx={{
//                 alignItems: "center",
//                 justifyContent: { xs: "center", sm: "space-between" },
//                 gap: 1.5,
//                 py: { xs: 2, sm: 1.5 },
//                 px: { xs: 2, sm: 3 },
//               }}
//             >
//               <Copyright type={CopyrightType.TYPE3} />
//               <FollowUS heading={false} color="grey.100" />
//             </Stack>
//           </GraphicsCard>
//         </motion.div>
//       </Stack>
//     </ContainerWrapper>
//   );
// }

// components/footer/Footer7.tsx
"use client";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ContainerWrapper from "@/components/ContainerWrapper";
import { SECTION_COMMON_PY } from "@/utils/constant";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";

export default function Footer7() {
  return (
    <Box
      sx={{
        py: SECTION_COMMON_PY,
        background: "#003d1a",
        borderTop: "1px solid rgba(255,193,7,0.2)",
      }}
    >
      <ContainerWrapper>
        <Grid container spacing={4}>
          <Grid sx={{ xs: 12, md: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: "#FFC107", mb: 2 }}>
                Stay Connected
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}>
                Want the inside scoop on new features?
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  sx={{
                    flex: 1,
                    p: 1,
                    border: "none",
                    borderRadius: "25px",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    outline: "none",
                    // border: "1px solid rgba(255,193,7,0.3)",
                    "&::placeholder": {
                      color: "rgba(255,255,255,0.6)",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(45deg, #FFC107, #ffb300)",
                    color: "#003d1a",
                    borderRadius: "25px",
                    fontWeight: 600,
                    px: 3,
                  }}
                >
                  Sign Me Up
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid sx={{ xs: 12, md: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: "#FFC107", mb: 2 }}>
                Get Started
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(45deg, #FFC107, #ffb300)",
                  color: "#003d1a",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 700,
                  borderRadius: "50px",
                  boxShadow: "0 10px 30px rgba(255,193,7,0.4)",
                  px: 3,
                  py: 1.5,
                }}
              >
                Download App
              </Button>
            </Box>
          </Grid>

          <Grid sx={{ xs: 12, md: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: "#FFC107", mb: 2 }}>
                Let&apos;s Talk
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}>
                <strong>Waste Collectors:</strong> Join the movement
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
                <strong>Media/Investors:</strong> We should talk
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ xs: 12, md: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: "#FFC107", mb: 2 }}>
                Follow Our Progress
              </Typography>
              <Stack direction="row" spacing={1}>
                {["Instagram", "Twitter", "LinkedIn"].map((platform, index) => (
                  <Button
                    key={index}
                    sx={{
                      width: 40,
                      height: 40,
                      background: "linear-gradient(45deg, #008037, #FFC107)",
                      borderRadius: "50%",
                      minWidth: 0,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 5px 15px rgba(255,193,7,0.4)",
                      },
                    }}
                  >
                    {platform === "Instagram"
                      ? "📷"
                      : platform === "Twitter"
                        ? "🐦"
                        : "💼"}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Box>
  );
}
