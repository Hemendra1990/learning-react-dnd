import React, { useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import DraggablePGElement from "./DraggablePGElement";
import ContainerHelper from "./_helpers/ContainerHelper";

function HDContainer({ element , meta, setMeta, handleWhenElementMovedToContainer, 
  setPGElements, pgElements, pgIndex, updatePgElements }) {
  const containerElement = element;
  const helper = new ContainerHelper();

  const [containerChildren, setContainerChildren] = useState([]);

  containerElement.attributes = containerElement.attributes || {};
  containerElement.attributes.children = containerElement.attributes.children || [];

  useEffect(()=> {
    console.log('Container children test', element);
  }, [element]);

  const [{ canDrop, isOver, isOverCurrent }, drop] = useDrop(() => ({
    accept: ["hdPGElement", "hdElement"],

    drop: (item, monitor) => {
      //check if the element is already dropped or not
      if(monitor.didDrop()) {
        return;
      }

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
              foundElement.attributes.children.push({...item.element, id: newId, parentId: containerElement.id});
              break;
            }
          }
          return [
            ...prevPGElements,
          ]
        });
      } else if(monitor.getItemType() === "hdPGElement"){
        const helper = new ContainerHelper();
        pgElements = helper.updateParent(pgElements, item.element.id, containerElement.id);
        //check 
        console.log(setPGElements, pgElements, findElement);
        setPGElements([...pgElements]);
        
        const newObj = helper.findNodeAndParent(pgElements, containerElement.id)
        console.log('New Obj', newObj);
        setContainerChildren([...newObj?.node?.attributes.children]);
        updatePgElements([...pgElements]);

      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isOverCurrent: monitor.isOver({ shallow: true }),
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

  const moveContainerCard = useCallback((dragIndex, hoverIndex, item, monitor) => {
    if(dragIndex !== undefined && hoverIndex !== undefined) {
      console.log({dragIndex, hoverIndex});
      const {node, parent} = helper.findNodeAndParent(pgElements, item.element.id);
      /* if(node && pgElements[hoverIndex]) {//check if any element is already there at the index or not
        const [draggedItem] = pgElements.splice(dragIndex, 1);
        pgElements.splice(hoverIndex, 0, draggedItem);
      } */
    }

  }, [pgElements])

  const isActive = canDrop && isOver;
  let backgroundColor = "";
  /* if (isActive) {
    backgroundColor = "";
  } else if (canDrop) {
    backgroundColor = "gray";
  } */

  if(isOverCurrent) {
    backgroundColor="#DCDCDC";
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
        
        element?.attributes?.children.map((childElement, containerIndex) => {
            return <div key={childElement.id} style={{marginTop: 10, marginBottom: 10}}>
                <DraggablePGElement 
                element={childElement} 
                pgIndex={pgIndex} 
                meta={meta} 
                setMeta={setMeta}
                setPGElements={setPGElements}
                parentId={containerElement.id}
                pgElements = {pgElements}
                moveContainerCard = {moveContainerCard}
                containerIndex={containerIndex}/>
            </div>
        })
    }
  </div>;
}

export default HDContainer;
