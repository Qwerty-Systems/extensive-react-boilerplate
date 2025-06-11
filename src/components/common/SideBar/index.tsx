"use client";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import clsx from "clsx";
import React, { useEffect, useState, ReactNode } from "react";
import { SwipeableDrawerProps } from "@mui/material/SwipeableDrawer/SwipeableDrawer";
import Paper from "@mui/material/Paper";

/**
 * Props for the PageCardedSidebar component.
 */
interface PageCardedSidebarProps {
  open: boolean;
  position?: SwipeableDrawerProps["anchor"];
  variant?: SwipeableDrawerProps["variant"];
  onClose: (open: boolean) => void;
  onOpen?: () => void;
  content?: ReactNode;
}

/**
 * The PageCardedSidebar component is a sidebar for the PageCarded component.
 */

export const Sidebar: React.FC<PageCardedSidebarProps> = ({
  open,
  position,
  variant,
  onClose,
  onOpen,
  content,
}) => {
  // Maintain internal state to handle the drawer's open/close state
  const [isOpen, setOpen] = useState(open);

  // Synchronize internal state with the open prop from the parent
  useEffect(() => {
    setOpen(open);
  }, [open]);

  // Function to toggle the drawer's state (open or close)
  const handleToggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose(false); // Trigger onClose when closing
    }
    if (newOpen && onOpen) {
      onOpen(); // Trigger onOpen when opening
    }
  };

  return (
    <Paper sx={{ display: { xl: "none", xs: "block" } }}>
      <SwipeableDrawer
        variant="temporary"
        anchor={position}
        open={isOpen}
        onOpen={() => handleToggleDrawer(true)}
        onClose={() => handleToggleDrawer(false)}
        disableSwipeToOpen
        classes={{
          root: clsx("PageCarded-sidebarWrapper", variant),
          paper: clsx("PageCarded-sidebar", variant, "PageCarded-rightSidebar"),
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        BackdropProps={{
          classes: {
            root: "PageCarded-backdrop",
          },
        }}
        style={{ position: "absolute" }}
      >
        {content}
      </SwipeableDrawer>
    </Paper>
  );
};
