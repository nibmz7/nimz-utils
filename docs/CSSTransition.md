# Purpose 
To enable CSS transitions based on the visible prop and mount/unmount components at the start/end of their transitions. 

### [CSSTransition](../src/CSSTransition/CSSTransition.tsx)
  - **Role:** Render Child if visible prop is set to true. Child must be a DOM component or a component that accepts the ref property with React.forwardRef and assigns that ref to a corresponding DOM element. Look below for an example.
  - **Note:** CSSTransition will inject a [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) into the Child element and also merge with a callback ref if one was set.
  - **How to use:** The Child must implement the following CSS.  
    - **Initial style:** This should be the initial state of the element after the browser's first paint; i.e ```Opacity: 0```. Remember to set the transition duration.
    - **Style when visible:** Opacity: 1 etc. using ```[data-visibility="visible"]``` selector.
    - **Style when hidden:** Optional if the hidden style is the same as the initial using ```[data-visibility="hidden"]``` selector.
    - Refer to the examples below.  
    
```javascript
<CSSTransition 
   visible={boolean}
   lastHideTransitionProperty={string = 'opacity'}
   prepareDimensions={boolean = 'false'}
   onUnmount={() => void}
   onMount={(element: HTMLElement) => void}
>
  {child}
</CSSTransition>
```

Prop | Type | Description | Values
--- | --- | --- | ---
`visible` | `boolean` | To show or not to show the view, that is the question |  `true` &#124; `false`
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

const [shouldShowHome, setShowHome] = useState(false);

<CSSTransition visible={shouldShowHome}>
  <HomeDiv />
</CSSTransition>
```

### [CSSGroupTransition](../src/CSSTransition/CSSTransition.tsx)
  - **Role:** It does the same thing as CSSTransition, but it can handle an array of DOM components/refForwarded components. It loops through children and wraps each child element with CSSTransition.
  - Refer to the example below.
   
```javascript
<CSSGroupTransition 
   path={string}
   lastHideTransitionProperty={string = 'opacity'}
   prepareDimensions={boolean = 'false'}
>
  {children}
</CSSGroupTransition>
  ```
  
  ```javascript
    const Note = () => {
      const [shouldShowButtons, setShowButtons] = useState(false);
      return (
        <NoteDiv>
          <p>Some content</p>
          <CSSGroupTransition
            visible={shouldShowButtons}
            lastHideTransitionProperty="transform"
          >
            <ButtonOneSlideRight />
            <ButtonTwoSlideLeft />
            <ButtonTwoSlideFromTop />
          </CSSGroupTransition>
        </NoteDiv>
      )
    }
  ```
  
### [ReducedMotionContext](../src/CSSTransition/ReducedMotionContext.tsx)
  - **Role:** Provides a way to disable all transitions. Save current setting to local storage.
  
  ```javascript
  
  /* Step 1 - Wrap ReducedMotionContextProvider at the root of your app */
  
  <ReducedContextProvider>
    <App />
  </ReducedContextProvider> 
  
  /* Step 2 - Access getters & setters in your component. */
  /*   
    You will need the reducedMotionEnabled value for your   
    own presentational purpose only as disabling of transitions   
    will be handled automatically by CSSTransition. 
  */
  
  const { reducedMotionEnabled, setReducedMotionEnabled } = useContext(ReducedMotionContext);
  
```
