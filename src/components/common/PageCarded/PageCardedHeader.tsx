import clsx from "clsx";
import React, { ReactNode } from "react";

/**
 * Props for the PageCardedHeader component.
 */
type PageCardedHeaderProps = {
  header?: ReactNode;
};

/**
 * The PageCardedHeader component is a header for the PageCarded component.
 */
export const PageCardedHeader = ({ header }: PageCardedHeaderProps) => {
  //<div className={clsx('FusePageCarded-header', 'container')}>{header}</div>
  return <div className={clsx("PageCarded-header", "container")}>{header}</div>;
};
