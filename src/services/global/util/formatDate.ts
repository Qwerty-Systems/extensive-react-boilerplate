// import { format, formatDuration, isValid, parseISO } from "date-fns";
// import { normalize } from "duration-fns";

// export const formatISODateString = (
//   isoString?: string,
//   includeSeconds?: boolean
// ): string => {
//   if (!isoString) return "";

//   const date = parseISO(isoString);
//   if (!isValid(date)) return "";

//   let formatStr = "dd/MM/yyyy HH:mm";
//   if (includeSeconds) {
//     formatStr += ":ss";
//   }
//   return format(date, formatStr);
// };

// export const formatDurationString = (duration: string): string => {
//   const s = formatDuration(normalize(duration));
//   return s === "" ? "0 seconds" : s;
// };
