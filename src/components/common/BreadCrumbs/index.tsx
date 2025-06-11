// import { Link, Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
// import { useBreadcrumb } from "app/global/providers/BreadCrumbProvider/BreadCrumbProvider";
// import { i18n } from "app/internationalization/providers/InternationalizationProvider";
// import { useLocation } from "react-router";
// import { Link as RouterLink } from "react-router-dom";

// type BreadcrumbMap = {
//   [key: string]: { name: string; link?: boolean };
// };

// const breadcrumbNameMap: BreadcrumbMap = {
//   "/home": { name: i18n.t("home"), link: false },
//   "/template": { name: i18n.t("template") },
//   "/settings": { name: i18n.t("settings") },
// };

// export default function BreadCrumbs() {
//   const location = useLocation();
//   const pathnames = location.pathname.split("/").filter((x) => x);
//   const { displayValue } = useBreadcrumb();

//   return (
//     <MuiBreadcrumbs aria-label="breadcrumb">
//       {pathnames.length > 0 && (
//         <Link underline="hover" color="inherit" href="/">
//           Home
//         </Link>
//       )}
//       {pathnames.map((value, index) => {
//         const last = index === pathnames.length - 1;
//         const to = `/${pathnames.slice(0, index + 1).join("/")}`;

//         const breadcrumb = breadcrumbNameMap[to];
//         const fullName =
//           breadcrumb?.name ?? value.charAt(0).toUpperCase() + value.slice(1);
//         const shortName =
//           fullName.length > 50 ? `${fullName.slice(0, 47)}...` : fullName;

//         if (displayValue[value]) {
//           return (
//             <Typography color="text.primary" key={to}>
//               {displayValue[fullName].length > 50
//                 ? `${fullName.slice(0, 47)}...`
//                 : displayValue[fullName]}
//             </Typography>
//           );
//         }
//         return last || breadcrumb?.link === false ? (
//           <Typography color="text.primary" key={to}>
//             {shortName}
//           </Typography>
//         ) : (
//           <Link
//             component={RouterLink}
//             to={to}
//             underline="hover"
//             color="inherit"
//             key={to}
//             variant="body2"
//           >
//             {shortName}
//           </Link>
//         );
//       })}
//     </MuiBreadcrumbs>
//   );
// }
