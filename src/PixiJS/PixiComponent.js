import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import gsap from 'gsap'; // Importer GreenSock Animation Platform (GSAP)
import "./style.css"

const PixiComponent = () => {
    const pixiContainer = useRef(null);
    let keys = {};
    const onKeyDown = (e) => {
        keys[e.keyCode] = true;
    };

    const onKeyUp = (e) => {
        keys[e.keyCode] = false;
    };

    useEffect(() => {
        // Set up Pixi.js
        const renderer = PIXI.autoDetectRenderer({ backgroundColor: 0xFFFFFF  }); // Changer la couleur de fond ici
        pixiContainer.current.innerHTML = ""; // Clear the container
        pixiContainer.current.appendChild(renderer.view);
        // Create a container for the scene and the blue border
        const sceneContainer = new PIXI.Container();
        // const backgroundTexture = PIXI.Texture.from('background.png');
        // const background = new PIXI.Sprite(backgroundTexture);
        // background.width = renderer.width;
        // background.height = renderer.height;
        // sceneContainer.addChild(background);
        const blueBorder = new PIXI.Graphics();
        blueBorder.lineStyle(15, 0x0000FF); // Line style: 5 pixels width, blue color
        blueBorder.drawRect(0, 0, renderer.width, renderer.height); // Draw a rectangle around the scene
        sceneContainer.addChild(blueBorder);
        // Create the stage
        const stage = new PIXI.Container();
        // Load the textures for the "player"
        const characterTextures = {
            up: PIXI.Texture.from('character/character_up.png'),
            down: [PIXI.Texture.from('character/character_down1.png'), PIXI.Texture.from('character/character_down2.png'), PIXI.Texture.from('character/character_down3.png')
                , PIXI.Texture.from('character/character_down4.png'), PIXI.Texture.from('character/character_down5.png'), PIXI.Texture.from('character/character_down6.png')],
            left: PIXI.Texture.from('character/character_right1.png'),
            right: [PIXI.Texture.from('character/character_right1.png'), PIXI.Texture.from('character/character_right2.png'), PIXI.Texture.from('character/character_right3.png')],
        };
        // Create the "player" using the texture
        const playerBox = new PIXI.Sprite(characterTextures.down[0]);
        playerBox.anchor.set(0.5); // Centre l'origine du sprite
        playerBox.position.set(renderer.width / 2, renderer.height / 2); // Positionnez le sprite au centre de la scène
        // Load the texture for the "house"
        const houseTexture = PIXI.Texture.from('maison.png');
        // Create the "house" using the texture
        const houseBox = new PIXI.Sprite(houseTexture);
        houseBox.anchor.set(0.25); // Centre l'origine du sprite
        houseBox.width = 200; // Largeur en pixels
        houseBox.height = 139;
        houseBox.position.set(renderer.width / 2, renderer.height / 4); // Positionnez le sprite au-dessus du centre de la scène
        houseBox.interactive = true; // Rendre la maison interactive
        houseBox.on('pointerdown', () => { // Ajouter un écouteur d'événements pour déplacer le personnage vers la maison lorsqu'on clique dessus
            const distance = Math.sqrt(Math.pow(houseBox.position.x - playerBox.position.x, 2) + Math.pow(houseBox.position.y - playerBox.position.y, 2));
            const duration = distance / 100; // Durée de l'animation en secondes, dépend de la distance
            gsap.to(playerBox.position, { x: houseBox.position.x, y: houseBox.position.y - houseBox.height, duration: duration });
        });
        // Create a text for the prompt
        const promptText = new PIXI.Text("Rentrer dans cette maison ?", { fill: 0xffffff });
        promptText.anchor.set(0.5);
        promptText.visible = false; // Hide the text initially
        stage.addChild(sceneContainer);
        stage.addChild(promptText);
        // Add boxes to the stage
        stage.addChild(playerBox);
        stage.addChild(houseBox);
        animate();

        let rightStepCounter = 0;
        let downStepCounter = 0;
        function animate() {
            // Render the stage
            renderer.render(stage);
            // Check the distance between the player and the house
            const distance = Math.sqrt(Math.pow(houseBox.position.x - playerBox.position.x, 2) + Math.pow(houseBox.position.y - playerBox.position.y, 2));
            if (distance < 100) {
                // If the player is close to the house, show the prompt
                promptText.visible = true;
                promptText.position.set(playerBox.position.x, playerBox.position.y - playerBox.height / 2 - promptText.height);
            } else {
                // If the player is not close to the house, hide the prompt
                promptText.visible = false;
            }
            // Modifiez la partie du code qui gère le mouvement vers la gauche comme suit :
            if (keys[37] && playerBox.position.x - 3 > 0) { // gauche
                playerBox.position.x -= 3;
                playerBox.texture = characterTextures.right[rightStepCounter % 3];
                playerBox.scale.x = -1;
                rightStepCounter++;
            }
            if (keys[38] && playerBox.position.y - 5 > 0) { // haut
                playerBox.position.y -= 3;
                playerBox.texture = characterTextures.up;
                playerBox.scale.x = 1;
            }
            // Modifiez la partie du code qui gère le mouvement vers la droite comme suit :
            if (keys[39] && playerBox.position.x + 5 < renderer.width) { // droite
                playerBox.position.x += 3;
                playerBox.texture = characterTextures.right[rightStepCounter % 3];
                playerBox.scale.x = 1;
                rightStepCounter++;
            }
            if (keys[40] && playerBox.position.y + 5 < renderer.height) { // bas
                playerBox.position.y += 3;
                playerBox.texture = characterTextures.down[downStepCounter % 6];
                playerBox.scale.x = 1;
                downStepCounter++;
            }
            requestAnimationFrame(animate);
        }
        window.addEventListener('keydown', function(e) {
            keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function(e) {
            keys[e.keyCode] = false;
        });
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);
    return <div ref={pixiContainer} className="pixi-container"></div>;
};

export default PixiComponent;

