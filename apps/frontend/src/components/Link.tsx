import React from "react";
import { Link as DOMLink, useLocation } from "react-router-dom";

/**
 * @interface PaginationLinkProps
 * @property {number} page - The page number for the link destination.
 * @property {React.ReactNode} children - The content to be displayed inside the link.
 * @property {boolean} [disabled] - If true, the link will be disabled.
 */
interface PaginationLinkProps {
  page: number;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Renders a crawlable link for use within Ant Design's Pagination component.
 * It uses react-router-dom's Link to create an `<a>` tag with a valid `href`.
 * @param {PaginationLinkProps} props - The props for the PaginationLink component.
 * @returns {React.ReactElement} A crawlable link element.
 */
export const Link: React.FC<PaginationLinkProps> = ({
  page,
  children,
  disabled,
}) => {
  const { pathname, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  searchParams.set("page", String(page));

  return (
    <DOMLink to={`${pathname}?${searchParams.toString()}`}>{children}</DOMLink>
  );
};
