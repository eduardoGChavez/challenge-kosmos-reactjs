
import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import "../CSS/Components/Rectangle.css";

const Rectangle = ({
  updateMoveable,
  top,
  left,
  transform,
  width,
  height,
  index,
  color,
  image,
  id,
  setSelected,
  isSelected,
  updateEnd,
  removeMoveable,
}) => {
  useEffect(() => {

    let example = document.getElementById("parent")
    console.log("example.style.height", example.style.height);
  }, [])
  const [frame, setFrame] = React.useState({
      translate: [0,0],
      clipStyle: "inset",
  });

  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();
  
  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
      image,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = async (e) => {
    let newWidth = e.lastEvent?.width;
    let newHeight = e.lastEvent?.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    const { lastEvent } = e;
    const { drag } = lastEvent;
    const { beforeTranslate } = drag;

    const absoluteTop = top + beforeTranslate[1];
    const absoluteLeft = left + beforeTranslate[0];

    updateMoveable(
      id,
      {
        top: absoluteTop,
        left: absoluteLeft,
        width: newWidth,
        height: newHeight,
        color,
        image,
      },
      true
    );
  };

  const handleOnDrag = (e) => {
    const parentHeight = document.getElementById("parent").clientHeight;
    const parentWidth = document.getElementById("parent").clientWidth;
    const positionX = e.translate[0];
    const positionY = e.translate[1];
    const totalHeight = positionY + e.height;
    const totalWidth = positionX + e.width;
    if( positionX >= 0 && positionY >= 0 && 
        totalHeight < parentHeight && totalWidth < parentWidth
      ){
      ref.current.style.transform = `translate(${positionX}px, ${positionY}px)`;
      updateMoveable(id, {  
        top: e.top,
        left: e.left,
        transform: `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`,
        image,
        width,
        height,
        color,
      });
    }
  }

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          width: width,
          height: height,
          backgroundImage: `url(${image})`,
          backgroundSize: "100% 100%",
        }}
        onClick={() => setSelected(id)}
      >
        <div className="buttonContainer"
        >
          <button onClick={_ => removeMoveable(index)}>X</button>
        </div>
      </div>
      
      <Moveable
        target={isSelected && ref}
        resizable
        draggable
        onDrag={e => {
          handleOnDrag(e);
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

export default Rectangle;