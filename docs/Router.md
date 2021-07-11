# Browser Router

## Purpose
To enable CSS transitions based on URL changes and mount/unmount components at the start/end of their transitions.

## Components
  
### [RouterProvider](../src/utils/Router/RouterContext.tsx)
  - **Role:** Provides context to access [BrowserRouter](./Router/BrowserRouter.ts) object. To be placed at the root of the app.  
  - [Link To Example Usage](https://github.com/nibmz7/nimz-app/blob/5da977beb6bd252955804b53f423ad77e2f36caf/ui/index.tsx#L13)

```javascript
<RouterProvider>{children}</RouterProvider>
```
  
### [Route](../src/utils/Router/Route.tsx)
  - **Role:** Render children if the path matches the URL 
  
  ```javascript
  <Route path={string}>{children}</Route>
  ```
  
 ### [RouteTransition](../src/utils/Router/RouteTransition.tsx)
  - **Role:** Render Child if the path matches the URL. Child must be a DOM component or a component that accepts the ref property with React.forwardRef and assigns that ref to a corresponding DOM element. Look below for an example.
  - **Note:** RouteTransition will inject a [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) into the Child element and also merge with a callback ref if one was set.
  - **How to use:** The Child must implement the following CSS.  
    - **Initial style:** This should be the initial state of the element after the browser's first paint; i.e ```Opacity: 0```. Remember to set the transition duration.
    - **Style when visible:** Opacity: 1 etc. using ```[data-visibility="visible"]``` selector.
    - **Style when hidden:** Optional if the hidden style is the same as the initial using ```[data-visibility="hidden"]``` selector.
    - Refer to the examples below.  
  ```javascript
  <RouteTransition 
     path={string}
     lastHideTransitionProperty={string = 'opacity'}
     prepareDimensions={boolean = 'false'}
     onUnmount={() => void}
     onMount={(element: HTMLElement) => void}
  >
    {child}
  </RouteTransition>
  ```

Prop | Type | Description | Values
--- | --- | --- | ---
`path` | `string` | URL Path |  `/note/:id` &#124; `/note/*` &#124; `/note/123`
`lastHideTransitionProperty` | `string` | Last [transition-property](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property) to finish so the component can be unmounted |`opacity` - default
`prepareDimensions` | `boolean` | Will append `--client-height` & `--client-width` [properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to the element's style after the first paint | `true` &#124; `false`
`onUnmount` | `() => void` | For cases where you don't have access to the element's ref  | -
`onMount` | `(node: HTMLElement) => void` | For cases where you don't have access to the element's ref | -
  
  ```javascript
  /* EXAMPLE - 1 */
  
  const HomeDiv = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: red;
    opacity: 0;
    transition: .3s opacity;

    &[data-visibility='visible'] {
      opacity: 1;
    }

    &[data-visibility='hidden'] {
      opacity: 0; /* Can be omitted as it matches the inital state */
    }
  `;
 
  <RouteTransition path="/home">
    <HomeDiv />
  </RouteTransition>
  ```
  
  ```javascript
  /* EXAMPLE - 2 */
  
  <RouteTransition path="/home">
    <div className="home" />
  </RouteTransition>
  ```
  
  ```javascript
  /* EXAMPLE - 3 */
  
  const Home = forwardRef(_, refCallback) => {
    return (
      <div className="home" ref={refCallback} />
      /* --- OR --- */
      <div 
        className="home" 
        ref={(node) => {
          refCallback(node);
          console.log(node); /* Use it for something else */ 
        }} />
    )
  }
  
  <RouteTransition path="/home">
    <Home />
  </RouteTransition>
  ```
  
 ### [GroupRouteTransition](../src/utils/Router/RouteTransition.tsx)
  - **Role:** It does the same thing as RouteTransition, but it can handle an array of DOM components/refForwarded components. It loops through children and wraps each child element with RouteTransition.
  - Refer to the example below
   
  ```javascript
  <GroupRouteTransition 
     path={string}
     lastHideTransitionProperty={string = 'opacity'}
     prepareDimensions={boolean = 'false'}
  >
    {children}
  </GroupRouteTransition>
  ```
  
  ```javascript
  /* EXAMPLE */
  
  const Home = () => {
    return (
      <GroupRouteTransition path="/home">
        <HomeAppBar />
        <HomeSideBar />
        <HomePanel />
      </GroupRouteTransition>
    )
  }
  
  const Notes = forwardRef(_, refCallback) => {
    return (
      <NotesContainer ref={refCallback}>
        <NotesList />
        <RouteTransition path="/notes/:id">
          <NotesDetails />
        </RouteTransition>
      </NotesContainer>
    )
  }
  
  const App = () => {
    return (
      <>
        <RouteInfo path="/home/*">
          <Home />
        </RouteInfo>
        <RouteTransition path="/notes/*">
          <Notes />
        </RouteTransition>
      </>
    )
  }
  ```
### [Link](../src/utils/Router/Link.tsx)
   
  ```javascript
  <Link replace={boolean} {...HTMLAnchorElementProps} />
  ```
  
### [RouteInfo](../src/utils/Router/Route.tsx)
  - **Role:** Does nothing except to allow tagging paths on parent components to provide better context and improve code readability. It renders the children prop passed to it.
  
## Hooks
  
### [useNavigate() => ```{ go, replace } ```](../src/utils/Router/useNavigate.ts)
  - **Role:** You must use this hook to navigate to a new URL as this will help notify the BrowserRouter; this does not apply to back navigation as that will trigger onPopState.
  - `go(path: string) => void`
    - Uses [history.pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
    - It will trigger [history.back](https://developer.mozilla.org/en-US/docs/Web/API/History/back) if path argument equals to the previously visited path
  - `replace(path: string) => void`
    - Uses [history.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
  ```javascript
  const navigate = useNavigate();
  navigate.go('/notes/123');
  ```
  
### [useParams(path: string) => ```{ [paramId: string]: string }```](../src/utils/Router/useParams.ts)
  - **Role:** Returns an object mapping of the paramId to the actual value
  - **Note:** The value will only update when a match occurs. If the current URL does not match the path argument, it will not update the value to an empty object but will instead retain the old/its current value.
  
  ```javascript
  const { userId, noteId } = useParams('/users/:userId/notes/:noteId');
  const { uid } = useParams('/users/:uid/*');
  ```
  
### [useRouteMatch(path: string) => ```boolean```](../src/utils/Router/useRouteMatch.ts)  
    - **Role:** Return a boolean to indicate if the path matches the URL
  
  ```javascript
  const match = useRouteMatch('/users/:userId/notes/:noteId');
  ```
