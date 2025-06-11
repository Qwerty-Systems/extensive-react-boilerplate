// import styled from "@emotion/styled";
// import Box, { BoxProps } from "@mui/material/Box";
// import css from "styled-jsx/css";
// export const Container = ({
//   navigationIsActive,
//   ...props
// }: { navigationIsActive?: boolean } & BoxProps) => {
//   const styles = css`
//     transition: transform 0.2s ease-in-out;
//     transform-origin: top;
//     ${navigationIsActive && "transform: scale(0.9);"}
//   `;

//   return <Box css={styles} {...props} />;
// };

// export const PageTags = styled.div`
//   padding: 7px 10px;
//   background-color: #0288d1;
//   border-radius: 50px;
//   color: white;
//   font-size: 13px;
//   span {
//     background-color: rgba(0, 0, 0, 0.2);
//     padding: 6px;
//     border-radius: 50%;
//     margin-right: 5px;
//     margin-left: -5px;
//   }
// `;

// export const Header = styled(Box)`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: ${({ theme }) => theme.globalTokens.padding.p4};
//   margin: ${({ theme }) => theme.globalTokens.margin.m4};
// `;

// export const Title = styled(Typography)`
//   font-weight: ${({ theme }) => theme.globalTokens.fontWeight.fontBook};
//   color: ${({ theme }) => theme.palette.text.primary};
// `;

// export const SubTitle = styled(Typography)`
//   font-weight: ${({ theme }) => theme.globalTokens.fontWeight.fontBold};
//   color: ${({ theme }) => theme.palette.text.secondary};
// `;
