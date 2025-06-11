import { MoreVert, SvgIconComponent } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import MaterialMenu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { MouseEventHandler, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  icon?: SvgIconComponent;
  title: ReactNode;
};

export default function Menu({
  children,
  title,
  icon: Icon = MoreVert,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={title}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Icon sx={{ width: 32, height: 32 }} />
        </IconButton>
      </Tooltip>
      <MaterialMenu
        anchorEl={anchorEl}
        id="more-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {children}
      </MaterialMenu>
    </>
  );
}
