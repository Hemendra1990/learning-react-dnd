import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggablePGElement from "./DraggablePGElement";

function HDContainer({ element , meta, setMeta, handleWhenElementMovedToContainer }) {
  const containerElement = element;

  const [containerChildren, setContainerChildren] = useState([]);

  containerElement.attributes = containerElement.attributes || {};
      containerElement.attributes.children = containerElement.attributes.children || [];

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["hdPGElement", "hdElement"],
    drop: (item, monitor) => {
      console.log('Container Item', item);

      //check if the element is already dropped or not
      if(monitor.didDrop()) {
        return;
      }

      if(monitor.getItemType() === "hdElement") {
        const newId = window.crypto.randomUUID()
        containerElement.attributes.children.push({...item.element, id: newId});
        setContainerChildren(children => [...children, {...item.element, id: newId}]);
      } else if(monitor.getItemType() === "hdPGElement"){
        //Remove from the main pgElements and add as the child of the container.
        /* setContainerChildren(children => [...children, {item, id: window.crypto.randomUUID()}]);
        handleWhenElementMovedToContainer(element); */
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = "";
  if (isActive) {
    backgroundColor = "green";
  } else if (canDrop) {
    backgroundColor = "lightgreen";
  }
  return <div ref={drop} style={
    {
      minHeight:"100px", 
      minWidth:'50vw', 
      margin: "20px", 
      border: "1px dashed gray",
      backgroundColor: backgroundColor,
    }
    }>
    {
        containerChildren.map(childElement => {
            return <div key={childElement.id}>
                {console.log('Rendering Container elements: ', childElement)}
                <DraggablePGElement  element={childElement} meta={meta} setMeta={setMeta}/>
            </div>
        })
    }
  </div>;
}

export default HDContainer;
