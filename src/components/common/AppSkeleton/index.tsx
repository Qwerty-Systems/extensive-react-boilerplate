// // eslint-disable-next-line no-restricted-imports
// import { Box, Skeleton } from "@mui/material";
// import { Header, Aside, Main } from "./styles";
// import Grid from "@mui/material/Grid";

// interface AppSkeletonProps {
//   primaryCount: number;
//   secondaryCount: number;
//   topbarCount: number;
//   itemSize: number;
// }

// export function AppSkeleton({
//   primaryCount,
//   secondaryCount,
//   topbarCount,
//   itemSize,
// }: AppSkeletonProps) {
//   return (
//     <Grid>
//       <Header>
//         <Grid container className="left">
//           <Box paddingX={2.25} mr={1.5}>
//             <Skeleton variant="circular" width={itemSize} height={itemSize} />
//           </Box>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {/* <img src={logo} alt={'Polariks Logo'} /> */}
//           </Box>
//         </Grid>
//         <Grid
//           className="right"
//           container
//           justifyContent={"flex-end"}
//           gap={1}
//           paddingX={4}
//           sx={{ display: "flex", alignItems: "center" }}
//         >
//           {Array.from({ length: topbarCount }).map((_, index) => (
//             <Skeleton
//               key={index}
//               variant="circular"
//               width={itemSize}
//               height={itemSize}
//             />
//           ))}
//           <Skeleton variant="rounded" width={120} height={22} />
//         </Grid>
//       </Header>
//       <Grid container>
//         <Aside>
//           <Grid container className="top" gap={1.5} padding={2}>
//             {Array.from({ length: primaryCount }).map((_, index) => (
//               <div key={index}>
//                 <Skeleton
//                   variant="circular"
//                   width={itemSize}
//                   height={itemSize}
//                 />
//                 <Skeleton variant="rounded" width={itemSize} height={12} />
//               </div>
//             ))}
//           </Grid>
//           <Grid container className="bottom" gap={1.5} padding={2}>
//             {Array.from({ length: secondaryCount }).map((_, index) => (
//               <div key={index}>
//                 <Skeleton
//                   variant="circular"
//                   width={itemSize}
//                   height={itemSize}
//                 />
//                 <Skeleton variant="rounded" width={itemSize} height={12} />
//               </div>
//             ))}
//           </Grid>
//         </Aside>
//         <Main />
//       </Grid>
//     </Grid>
//   );
// }
