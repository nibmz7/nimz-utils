# NIMZ Utils

## About
Ported utils from project [nimz-app](https://github.com/nibmz7/nimz-app)

## Installation & usage
```
yarn add @nimz/utils    ---or---    npm install @nimz/utils
``` 
```javascript
import { RouteTransition } from '@nimz/utils';
```

## Demo

| Browser Router | CSS Transition | Overlay View 
| --- | --- | ---
| ![Browser Router demo](https://github.com/nibmz7/nimz-utils/blob/main/assets/browser-router-demo.gif?raw=true) | ![CSS Transitionm demo](https://github.com/nibmz7/nimz-utils/blob/main/assets/css-transition-demo.gif?raw=true) | ![Overlay View demo](https://github.com/nibmz7/nimz-utils/blob/main/assets/overlay-view-demo.gif?raw=true)

## Utilities

- ### [Browser Router](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#browser-router)
  - #### Components 
    ##### [RouterProvider](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#routerprovider)
    ##### [Route](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#route)
    ##### [RouteTransition](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#routetransition)
    ##### [GroupRouteTransition](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#grouproutetransition)
    ##### [Link](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#link)
    ##### [RouteInfo](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#routeinfo)
  - #### Hooks
    ##### [useNavigate](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#usenavigate---go-replace--)
    ##### [useParams](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#useparamspath-string---paramid-string-string-)
    ##### [useRouteMatch](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Router/README.md#useroutematchpath-string--boolean)
    
- ### [CSS Transition](https://github.com/nibmz7/nimz-app/blob/main/core/utils/CSSTransition/README.md)
  - #### Components
    ##### [CSSTransition](https://github.com/nibmz7/nimz-app/blob/main/core/utils/CSSTransition/README.md#csstransition)
    ##### [GroupCSSTransition](https://github.com/nibmz7/nimz-app/blob/main/core/utils/CSSTransition/README.md#cssgrouptransition)
    ##### [ReducedMotionContext](https://github.com/nibmz7/nimz-app/blob/main/core/utils/CSSTransition/README.md#reducedmotioncontext)
    
- ### [Overlay View](https://github.com/nibmz7/nimz-app/blob/main/core/utils/OverlayView/README.md#overlayview)
  - #### Hook
    ##### [useOverlayView](https://github.com/nibmz7/nimz-app/blob/main/core/utils/OverlayView/README.md#useoverlayview)
  - #### Components
    ##### [OverlayView](https://github.com/nibmz7/nimz-app/blob/main/core/utils/OverlayView/README.md#overlayview-1)
    ##### [OverlayViewTransition](https://github.com/nibmz7/nimz-app/blob/main/core/utils/OverlayView/README.md#overlayviewtransition)
    
- ### [Portal](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Portal/README.md#portal)
  - #### Components
    ##### [PortalRenderer](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Portal/README.md#portalrenderer)
    ##### [Portal](https://github.com/nibmz7/nimz-app/blob/main/core/utils/Portal/README.md#portal-1)
    
- ### [useContextMenu](https://github.com/nibmz7/nimz-app/blob/main/core/utils/ContextMenu/README.md#usecontextmenu)
