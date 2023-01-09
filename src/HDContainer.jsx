import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import DraggablePGElement from "./DraggablePGElement";

function HDContainer({ element , meta, setMeta, handleWhenElementMovedToContainer, setPGElements, pgElements, pgIndex }) {
  const containerElement = element;

  const [containerChildren, setContainerChildren] = useState([]);

  containerElement.attributes = containerElement.attributes || {};
      containerElement.attributes.children = containerElement.attributes.children || [];

      /* useEffect(()=>{
        
      }, [containerChildren]) */

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["hdPGElement", "hdElement"],
    hover: (item, monitor)=>{
      console.log(item, monitor);
    },
    drop: (item, monitor) => {
      //console.log('Container Item', item);

      //check if the element is already dropped or not
      if(monitor.didDrop()) {
        return;
      }

      console.log(setPGElements, pgElements, findElement);

      if(monitor.getItemType() === "hdElement") {
        const newId = window.crypto.randomUUID()
        //containerElement.attributes.children.push({...item.element, id: newId});
        setContainerChildren(children => [...children, {...item.element, id: newId}]);
        setPGElements((prevPGElements) => {
          let foundElement = null;
          for (let obj of prevPGElements) {
            foundElement = findElement(obj, containerElement.id);
            if (foundElement) {
              foundElement.attributes = foundElement.attributes || {};
              foundElement.attributes.children = foundElement.attributes.children || [];
              foundElement.attributes.children.push({...item.element, id: newId});
              break;
            }
          }
          return [
            ...prevPGElements,
          ]
        });
      } else if(monitor.getItemType() === "hdPGElement"){
        //Remove from the main pgElements and add as the child of the container.
        setContainerChildren(children => [...children, {...item.element}]);
        //console.log(pgElements);
        //console.log(setPGElements);
        handleWhenElementMovedToContainer(item.element, item.index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [pgElements]);

  function findElement(obj, elementId) {
    if (obj.id && obj.id === elementId) {
      return obj;
    }
    if (obj.attributes && obj.attributes.children) {
      for (let child of obj.attributes.children) {
        const result = findElement(child, elementId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  const isActive = canDrop && isOver;
  let backgroundColor = "";
  if (isActive) {
    backgroundColor = "gray";
  } else if (canDrop) {
    backgroundColor = "";
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
        containerChildren.map((childElement, containerIndex) => {
            return <div key={childElement.id} style={{marginTop: 10, marginBottom: 10}}>
                <DraggablePGElement 
                element={childElement} 
                pgIndex={pgIndex} 
                meta={meta} 
                setMeta={setMeta}
                setPGElements={setPGElements}
              pgElements = {pgElements}
                containerIndex={containerIndex}/>
            </div>
        })
    }
  </div>;
}

export default HDContainer;
