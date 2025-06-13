// import Popover from "@mui/material/Popover";
// import React, { Dispatch, useCallback, useState } from "react";
// import { HexColorPicker } from "react-colorful";
// import {
//   Box,
//   Container,
//   DefaultColorRow,
//   DefaultColors,
//   Picker,
//   StyledTypography,
//   Swatch,
// } from "./styles";

// export const ColorBlock: React.FC<{
//   color: string;
//   onChange: Dispatch<string>;
// }> = ({ color, onChange }) => (
//   <Box color={color} onClick={() => onChange(color)} />
// );

// interface HexColorPickerProps {
//   label?: string;
//   id?: string;
//   color: string;
//   onChange: Dispatch<string>;
// }

// export const ColorPicker: React.FC<HexColorPickerProps> = ({
//   id,
//   color,
//   label,
//   onChange,
// }) => {
//   const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

//   const close = useCallback(() => setAnchor(null), []);

//   const open = Boolean(anchor);

//   return (
//     <Container>
//       <Picker>
//         <Swatch
//           color={color}
//           onClick={(event) => setAnchor(event.currentTarget)}
//         />
//         <Popover
//           open={open}
//           anchorEl={anchor}
//           onClose={close}
//           anchorOrigin={{
//             vertical: "top",
//             horizontal: "center",
//           }}
//           transformOrigin={{
//             vertical: "bottom",
//             horizontal: "center",
//           }}
//         >
//           <HexColorPicker id={id} color={color} onChange={onChange} />
//           <DefaultColors>
//             <DefaultColorRow>
//               <ColorBlock color="#00a09f" onChange={onChange} />
//               <ColorBlock color="#7cb342" onChange={onChange} />
//               <ColorBlock color="#06bad6" onChange={onChange} />
//               <ColorBlock color="#0071ce" onChange={onChange} />
//               <ColorBlock color="#0000a0" onChange={onChange} />
//             </DefaultColorRow>
//             <DefaultColorRow>
//               <ColorBlock color="#7c06d6" onChange={onChange} />
//               <ColorBlock color="#c50187" onChange={onChange} />
//               <ColorBlock color="#d64106" onChange={onChange} />
//               <ColorBlock color="#f1be48" onChange={onChange} />
//               <ColorBlock color="#e25303" onChange={onChange} />
//             </DefaultColorRow>
//           </DefaultColors>
//         </Popover>
//       </Picker>
//       {!!label && <StyledTypography variant="body1">{label}</StyledTypography>}
//     </Container>
//   );
// };
