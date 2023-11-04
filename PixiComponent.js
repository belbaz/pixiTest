import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const PixiComponent = () => {
    const pixiContainer = useRef(null);

    useEffect(() => {
        // Créez une application PixiJS
        const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x1099bb });

        // Ajoutez la scène PixiJS au conteneur
        pixiContainer.current.appendChild(app.view);

        // Créez un sprite, par exemple un rectangle bleu
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x0000FF);
        rectangle.drawRect(0, 0, 200, 100);
        rectangle.endFill();

        // Ajoutez le rectangle à la scène
        app.stage.addChild(rectangle);
    }, []);

    return (
        <div ref={pixiContainer}></div>
    );
};

export default PixiComponent;
