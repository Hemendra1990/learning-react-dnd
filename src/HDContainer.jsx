import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggablePGElement from "./DraggablePGElement";

function HDContainer({ element, meta, setMeta }) {
  const [containerChildren, setContainerChildren] = useState([]);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["hdPGElement"],
    drop: (item) => {
      const { index, element } = item;
      console.log('Container Item', item);
      element.attributes = element.attributes || {};
      element.attributes.children = element.attributes.children || [];
      element.attributes.children.push(item);

      setContainerChildren(element.attributes.children);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }
  return <div ref={drop} style={{minHeight:"100px", border: "1px dashed gray", margin: "20px"}}>
    {
        containerChildren.map(childElement => {
            return <div key={childElement.element.id}>
                {childElement.element.name}
                <DraggablePGElement  element={childElement.element} meta={meta} setMeta={setMeta}/>
            </div>
        })
    }
  </div>;
}

export default HDContainer;
