import React, { createElement } from "react";
import { useDrag } from "react-dnd";

const DraggablePGElement = React.forwardRef((
  { element, meta, setMeta, handleWhenElementMovedToContainer, setPGElements, pgElements, pgIndex, containerIndex }, ref) => {
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "hdPGElement",
    item: { pgIndex, element },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        //alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const createComponent = () => {
    return React.createElement(element.component, {
        key: element.id,
        element: element,
        meta,
        setMeta,
        handleWhenElementMovedToContainer,
        setPGElements,
        pgElements,
        pgIndex,
        containerIndex
    });
  }

  return <div style={{border: "2px solid #777"}} ref={drag}>
    {createComponent()}
  </div>;
});

export default DraggablePGElement;
