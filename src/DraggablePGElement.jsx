import React, { createElement, createRef, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggablePGElement = React.forwardRef(
  (
    {
      children,
      element,
      meta,
      setMeta,
      handleWhenElementMovedToContainer,
      setPGElements,
      pgElements,
      pgIndex,
      containerIndex,
      parentId,
      updatePgElements,
      moveCard,
      moveContainerCard
    },
    ref
  ) => {
    const draggableRef = useRef(null);

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

    const [{ handlerId }, drop] = useDrop({
      accept: ["hdPGElement", "hdElement"],
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item, monitor) {
        if (!draggableRef.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = pgIndex;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = draggableRef.current?.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        // Time to actually perform the action
        if(moveCard) {
          moveCard(dragIndex, hoverIndex, item, monitor);
        } else if(moveContainerCard) {
          moveContainerCard(dragIndex, hoverIndex, item, monitor);
        }
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });

    drag(drop(draggableRef));

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
    };

    return (
      <div style={{ padding: "10px" }} ref={draggableRef}>
        {element.name}: {element.id}
        {createComponent()}
        {children}
      </div>
    );
  }
);

export default DraggablePGElement;
