import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import { DropzoneRootProps } from "react-dropzone";

const getColor = (props: DropzoneRootProps) => {
  if (props.isDragAccept) {
    return "#2196f3";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const getBackgroundColor = (props: DropzoneRootProps) => {
  if (props.isDragAccept) {
    return "#f2f7ff";
  }
  return "${({ theme }) => theme.palette.background.paper}";
};

export const DragContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-width: 3px;
  border-radius: 5px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: ${(props) => getBackgroundColor(props)};
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  height: 224px;
`;

export const Container = styled(Paper)`
  && {
    background-color: ${({ theme }: any) => theme.palette.background.default};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    margin-bottom: 16px;
    border-radius: 15px;
    margin-right: 16px;
  }
`;

export const FileCard = styled.div`
  display: flex;
  align-items: center;
`;

export const FileIcon = styled.div`
  margin-right: 16px;
`;
