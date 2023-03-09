import React, { useEffect, useState } from "react";

import "../CSS/App/App.css";
import Rectangle from "../Components/Rectangle";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState(null);

  const getImages = async () => {
    // Get images
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(json => setImages(json))
  }

  useEffect(() => {
    // First load
    getImages();
  }, [])

  const getObjImage = () => {
    let image = null;
    for(let i = 0; i < images.length; i++) {
      image = moveableComponents.filter(moveable => moveable.id === images[i].id);
      // Si está vacío significa que la imagen esá disponible
      console.log("image", image);
      if (image.length === 0) {
        // Se asigna el objeto de la posición que se encontró vacío.
        image = images[i];
        break;
      }
    }
    return image;
  }

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    console.log(moveableComponents);
    setMoveableComponents([
      ...moveableComponents,
      {
        id: images[moveableComponents.length].id,
        transform: "translate(0px, 0px)",
        width: 100,
        height: 100,
        image: images[moveableComponents.length].url,
        updateEnd: true
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    // Update moveable size and position
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  const removeMoveable = (id) => {
    // Remove a moveable component
    const updatedMoveables = moveableComponents.filter((_, index) => index !== id);
    setMoveableComponents(updatedMoveables);
  }

  return (
    <main style={{ height : "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div id="parent">
        {moveableComponents.map((item, index) => (
          <Rectangle
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            index={index}
            removeMoveable={removeMoveable}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
