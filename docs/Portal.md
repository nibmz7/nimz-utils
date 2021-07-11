# Portal

## Purpose
Utility for rendering [portals](https://reactjs.org/docs/portals.html) through a declarative component. Takes care of adding/removing Portal's root and parent containers. Isolates event propagation in Portal as the default behaviour.

## Components

### [PortalRenderer](../src/utils/Portal/PortalRenderer.tsx)
  - **Role:** Provides a portal for the Portal if you want to isolate the Portal's event bubbling in React.
  - **How:** Place this near the top of your React App.
```javascript
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
        <PortalRenderer>
          <App />
        </PortalRenderer>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
```

### [Portal](../src/utils/Portal/index.tsx)
  - **Role:** Declare Portals easily with this wrapper from anywhere in your react tree.
```javascript
  <Portal id={string = 'portal-container'} enableEventPropagation={boolean = false}>
    {children}
  </Portal>
```
