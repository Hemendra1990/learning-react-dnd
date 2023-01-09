import React, { createElement, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import elements from "./Components";
import ControlPanel from "./ControlPanel";
import DraggablePGElement from "./DraggablePGElement";

const Playground = () => {
    const sharedMeta = {
        elements: []
    };
  const [meta, setMeta] = useState(sharedMeta);

  const [pgElements, setPGElements] = useState([]);

  function deleteElement(array, element) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === element) {
        array.splice(i, 1);
        return array;
      } else {
        deleteElement(array[i].children, element);
      }
    }
    return array;
  }

  function handleWhenElementMovedToContainer(item, index) {
    /* console.log(item);
    console.log(index); */
    const itemAtIndex = pgElements.findIndex(ele => ele.id === item.id);
    pgElements.splice(itemAtIndex, 1);
    setPGElements([...pgElements]);
    console.log('pgElements Length: ', pgElements.length);
  }

  const [{ canDrop, isOver, getDropResult }, drop] = useDrop(() => ({
    accept: ["hdElement", "hdPGElement"],
    canDrop: (item, monitor) => {
      /* console.log("Type: ",monitor.getItemType()); */
      return true;
    },
    drop: (item, monitor) => {
        //Check if the element is already dropped somewhere, could be a case of Container
        if(monitor.didDrop()) {
          return;
        }
        const {index, element} = item;
        /* console.log(item); */
        const id = window.crypto.randomUUID();
        /* console.log(pgElements); */
        if(monitor.getItemType() === "hdPGElement") {
          //Do not create any new element, just reorder them
          const ele = pgElements.find(ele => ele.id === element.id);
          if(!ele) {
            setPGElements(elements => [...elements, {...element, id}])
          }

        } else { //add to the plaground and create the element
          setPGElements(elements => [...elements, {...element, id}])
        }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      getDropResult: monitor.getDropResult()
    }),
  }), [pgElements]);
  const isActive = canDrop && isOver;
  let backgroundColor = "";
  if (isActive) {
    backgroundColor = "lightgreen";
  } else if (canDrop) {
    backgroundColor = "green";
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          flexWrap: "wrap",
          border: "2px solid green",
        }}
      >
        {elements.map((element, index) => (
          <ControlPanel key={element.id} element={element} index={index} />
        ))}
      </div>


      <div
        ref={drop}
        style={
          { 
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "20px", 
            border: "solid 2px #222", 
            minHeight: "50vh",
            backgroundColor:backgroundColor
          }
        }
      >
        {console.log("pg Elements:",pgElements.length, pgElements)}
        {pgElements.map((element, index) => (
            <DraggablePGElement 
              key={element.id} 
              element={element} 
              meta={meta} 
              setMeta={setMeta}
              setPGElements={setPGElements}
              pgElements = {pgElements}
              pgIndex = {index}
              handleWhenElementMovedToContainer={handleWhenElementMovedToContainer}/>)
        )}
      </div>
    </>
  );
}

export default Playground;
