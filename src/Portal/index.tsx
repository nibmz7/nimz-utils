import { nanoid } from 'nanoid';
import { createPortal } from 'react-dom';
import React, { useContext, useLayoutEffect, useMemo } from 'react';

import { PortalRendererContext } from './PortalRenderer';

/**
 * Implementation derived from https://www.jayfreestone.com/writing/react-portals-with-hooks/.
 */

interface PortalProps {
  id: string;
}

interface PortalWithFirewallProps {
  portalId: string;
}

interface PortalWrapperProps {
  id?: string;
  enableEventPropagation?: boolean;
}

const createParentElement = (id: string) => {
  const div = document.createElement('div');
  div.id = id;
  document.body.append(div);

  return div;
};

const Portal: React.FC<PortalProps> = ({ id, children }) => {
  const parentElement = useMemo(() => {
    return document.getElementById(id) || createParentElement(id);
  }, [id]);

  const rootElement = useMemo(() => {
    return document.createElement('div');
  }, []);

  useLayoutEffect(() => {
    parentElement.append(rootElement);

    return () => {
      rootElement.remove();
      if (parentElement.childElementCount === 0) parentElement.remove();
    };
  }, [id, parentElement, rootElement]);

  return createPortal(children, rootElement);
};

const PortalWithFirewall: React.FC<PortalWithFirewallProps> = ({
  portalId,
  children,
}) => {
  const { addView, removeView } = useContext(PortalRendererContext);

  const viewId = useMemo(() => nanoid(), []);

  useLayoutEffect(() => {
    addView(viewId, <Portal id={portalId}>{children}</Portal>);

    return () => {
      removeView(viewId);
    };
  }, [addView, children, removeView, viewId, portalId]);

  return null;
};

const PortalWrapper: React.FC<PortalWrapperProps> = ({
  id = 'portal-container',
  enableEventPropagation = false,
  children,
}) => {
  if (!children) return null;

  return enableEventPropagation ? (
    <Portal id={id}>{children}</Portal>
  ) : (
    <PortalWithFirewall portalId={id}>{children}</PortalWithFirewall>
  );
};

export default PortalWrapper;
