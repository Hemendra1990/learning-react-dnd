import React, { createElement, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import elements from "./Components";
import ControlPanel from "./ControlPanel";
import DraggablePGElement from "./DraggablePGElement";

export default function Playground() {
    const sharedMeta = {
        elements: []
    };
  const [meta, setMeta] = useState(sharedMeta);

  const [pgElements, setPGElements] = useState([]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "hdElement",
    drop: (item) => {
        const {index, element} = item;
        console.log(item);
        element.id = window.crypto.randomUUID();
        /* setMeta((prevMeta)=> {
            
            prevMeta.elements.push(element);
            return {
                ...prevMeta
            }
        });
        console.log(meta); */
        setPGElements(elements=> [...elements, element])
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

  return (
    <>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          border: "2px solid green",
        }}
      >
        {elements.map((element, index) => (
          <ControlPanel key={element.id} element={element} index={index} />
        ))}
      </div>


      <div
        ref={drop}
        style={{ margin: "20px", border: "solid 2px pink", minHeight: "50vh" }}
      >
        {pgElements.map((metaElement, index) => {
            return <DraggablePGElement key={metaElement.id} element={metaElement} meta={meta} setMeta={setMeta}/>
        })}
      </div>
    </>
  );
}
