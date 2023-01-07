import React from "react";
import { useDrag } from "react-dnd";

function ControlPanel({ element, index }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "hdElement",
    item: { index, element },
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
  return (
    <div
      ref={drag}
      style={{ border: "2px solid black", margin: "10px" }}
    >
      <label>{element.name}</label>
    </div>
  );
}

export default ControlPanel;
