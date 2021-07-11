# NIMZ Utils

## About
Ported utils from project [nimz-app](https://github.com/nibmz7/nimz-app)

## Installation & usage

```
# NPM
npm install nimz-utils

# Yarn
yarn add nimz-utils  
``` 

```javascript
import { RouteTransition } from 'nimz-utils';
```

## Demo

| Browser Router | CSS Transition | Overlay View 
| --- | --- | ---
| ![Browser Router demo](https://github.com/nibmz7/nimz-utils/blob/main/assets/browser-router-demo.gif?raw=true) | ![CSS Transitionm demo](https://github.com/nibmz7/nimz-utils/blob/main/assets/css-transition-demo.gif?raw=true) | ![Overlay View demo](https://github.com/nibmz7/nimz-utils/blob/main/assets/overlay-view-demo.gif?raw=true)

## Utilities

- ### [Browser Router](./docs/Router.md#browser-router)
  - #### Components 
    ##### [RouterProvider](./docs/Router.md#routerprovider)
    ##### [Route](./docs/Router.md#route)
    ##### [RouteTransition](./docs/Router.md#routetransition)
    ##### [GroupRouteTransition](./docs/Router.md#grouproutetransition)
    ##### [Link](./docs/Router.md#link)
    ##### [RouteInfo](./docs/Router.md#routeinfo)
  - #### Hooks
    ##### [useNavigate](./docs/Router.md#usenavigate---go-replace--)
    ##### [useParams](./docs/Router.md#useparamspath-string---paramid-string-string-)
    ##### [useRouteMatch](./docs/Router.md#useroutematchpath-string--boolean)
    
- ### [CSS Transition](./docs/CSSTransition.md)
  - #### Components
    ##### [CSSTransition](./docs/CSSTransition.md#csstransition)
    ##### [GroupCSSTransition](./docs/CSSTransition.md#cssgrouptransition)
    ##### [ReducedMotionContext](./docs/CSSTransition.md#reducedmotioncontext)
    
- ### [Overlay View](./docs/OverlayView.md#overlayview)
  - #### Hook
    ##### [useOverlayView](./docs/OverlayView.md#useoverlayview)
  - #### Components
    ##### [OverlayView](./docs/OverlayView.md#overlayview-1)
    ##### [OverlayViewTransition](./docs/OverlayView.md#overlayviewtransition)
    
- ### [Portal](./docs/Portal.md#portal)
  - #### Components
    ##### [PortalRenderer](./docs/Portal.md#portalrenderer)
    ##### [Portal](./docs/Portal.md#portal-1)
    
- ### [useContextMenu](./docs/ContextMenu.md#usecontextmenu)
