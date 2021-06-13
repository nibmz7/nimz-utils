import React, { forwardRef } from 'react';

import useNavigate from './useNavigate';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  replace?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ replace = false, href, children, ...rest }, ref) => {
    const navigate = useNavigate();

    return (
      <a
        href={href}
        onClick={(event) => {
          rest.onClick?.(event);
          event.preventDefault();
          if (href) {
            if (replace) navigate.replace(href);
            else navigate.go(href);
          }
        }}
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

export default Link;
