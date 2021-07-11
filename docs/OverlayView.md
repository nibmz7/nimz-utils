# OverlayView

## Purpose
- Allows creation of overlay views such as modal dialogues/tooltips/nested menus, rendered via portals. It can align views relative to a reference element or coordinate input. It realigns views that fall outside the screen viewport. A scrim is also added, which helps detect outside clicks and provides the possibility of styling it as a semi-transparent background for dialogues.

## Hook & Components

### [useOverlayView](../src/OverlayView/OverlayViewTransition.tsx)
  - **Role:** Simplify usage with OverlayView/OverlayViewTransition.

```javascript
interface Coordinate {
  x: number;
  y: number;
}

interface OverlayState {
  reference?: HTMLElement | Coordinate | null;
  isVisible?: boolean;
}

type EventWithCurrentTarget = { currentTarget?: HTMLElement; };

type ShowOverlay = (HTMLElement | Coordinate | EventWithCurrentTarget | null) => void;

type HideOverlay = () => void;

const [overlayState, showOverlay, hideOverlay] = useOverlayView();
  
```

### [OverlayView](../src/OverlayView/OverlayView.tsx)
  -  **Role:** Render overlay view without transitions. 

```javascript
type OverlayViewPosition = 'top' | 'bottom' | 'left' | 'right';
type OverlayViewAlignment = 'start' | 'center' | 'end';

<OverlayView
  portalId?: string;
  enableEventPropagation?: boolean;
  overlayState: OverlayState;
  onOutsideClick?: (e: SyntheticEvent) => void;
  position?: OverlayViewPosition;
  alignment?: OverlayViewAlignment;
  scrimClassName?: string;
  scrimLabel?: string;
>
  {child}
</OverlayView>
```

### [OverlayViewTransition](../src/OverlayView/OverlayViewTransition.tsx)
  -  **Role:** Render overlay view with transitions. 
  - **Note:** OverlayViewTransition will inject a [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) into the Child element and also merge with a callback ref if one was set.
  - **How to use:** The Child must implement the following CSS.  
    - **Initial style:** This should be the initial state of the element after the browser's first paint; i.e ```Opacity: 0```. Remember to set the transition duration.
    - **Style when visible:** Opacity: 1 etc. using ```[data-visibility="visible"]``` selector.
    - **Style when hidden:** Optional if the hidden style is the same as the initial using ```[data-visibility="hidden"]``` selector.
    - Refer to the examples below. 
```javascript
<OverlayViewTransition
  {...OverlayViewArgs}
  lastHideTransitionProperty?: string | undefined;
  prepareDimensions?: boolean | undefined;
  onUnmount?: (() => void) | undefined;
  onMount?: ((element: HTMLElement) => void) | undefined;
>
  {childWithRef}
</OverlayViewTransition>
```

```javascript
const MenuBox = styled.div`
  position: absolute;
  width: 200px;
  
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
  
  transform-origin: 100% 0;
  transition: 300ms;
  transition-property: transform, opacity;

  &[data-visibility='visible'] {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
`;

const CustomScrimClass = css`
  background-color: #0000001f !important;
  opacity: 0;
  transition: 0.3s opacity;

  &[data-visibility='visible'] {
    opacity: 1;
  }
`;

const Item = () => {
  
  const [menuState, showMenu, hideMenu] = useOverlayView();
  
  return (
    <ItemDiv>
      <p>Some content</>
      <MenuButton onClick={showMenu}>Open Menu</MenuButton>
      
      <OverlayViewTransition
        portalId="item-menu"
        overlayState={menuState}
        onOutsideClick={hideMenu}
        scrimClassName={CustomScrimClass}
      >
        <MenuBox>Some content</MenuBox>
      </OverlayViewTransition>
    </ItemDiv>
    
    /* --- OR Place them inside button --- */
    
     <ItemDiv>
      <p>Some content</>
      <MenuButton onClick={showMenu}>
        Open Menu
        
        <OverlayViewTransition
          portalId="item-menu"
          overlayState={menuState}
          onOutsideClick={hideMenu}
          scrimClassName={CustomScrimClass}
        >
          <MenuBox>Some content</MenuBox>
        </OverlayViewTransition>
        
      </MenuButton>
    </ItemDiv>
    
    /* --- OR Place them somewhere else --- */
    
    <>
      <ItemDiv>
        <p>Some content</>
        <MenuButton onClick={showMenu}>Open Menu</MenuButton>
      </ItemDiv>
    
      <OverlayViewTransition
        portalId="item-menu"
        overlayState={menuState}
        onOutsideClick={hideMenu}
        scrimClassName={CustomScrimClass}
       >
        <MenuBox>Some content</MenuBox>
      </OverlayViewTransition>
    </>
  )
}
```

## Note
- Scrim will have the following style set by default
```css
padding: '0';
background: 'none';
border: 'none';
position: 'fixed';
top: 0;
left: 0;
width: '100vw';
height: '100vh';
```
