import React, { createElement, createRef } from "react";
import { useDrag } from "react-dnd";

const DraggablePGElement = React.forwardRef((
  { children, element, meta, setMeta, 
    handleWhenElementMovedToContainer, setPGElements, pgElements, 
    pgIndex, containerIndex, parentId, updatePgElements }, ref) => {
  
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
        containerIndex,
        parentId,
        updatePgElements,
    });
  }

  return <div style={{padding: "10px"}} ref={drag}>
    {element.name}: {element.id}
    {createComponent()}
    {children}
  </div>;
});

export default DraggablePGElement;
