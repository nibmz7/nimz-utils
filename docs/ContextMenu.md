# [useContextMenu](../src/ContextMenu/useContextMenu.ts)

## Purpose
- Allow long press for mobile devices and right click on desktops to trigger an event mainly used for showing context menus. 

```javascript
  const NoteItem = () => {
    const contextMenuListeners = useContextMenu((event, coordinate) => {
      const { x, y } = coordinate;
      console.log(event, x, y);
    });
  
    return (
      <NoteItemDiv {...contextMenuListeners}>
        <p>Some content</p>
      </NoteItemDiv>
    )
  }
```
