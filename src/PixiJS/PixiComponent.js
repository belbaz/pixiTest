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
        let renderer = PIXI.autoDetectRenderer({backgroundColor: 0x00000}); // Changer la couleur de fond ici
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
        blueBorder.lineStyle(15, 0x00005F); // Line style: 5 pixels width, blue color
        blueBorder.drawRect(0, 0, renderer.width, renderer.height); // Draw a rectangle around the scene
        sceneContainer.addChild(blueBorder);
        // Create the stage
        const stage = new PIXI.Container();

        let spriteSheet = PIXI.Texture.from('graphics-sprites 2d-game-character.png');
        let characterTextures = {
            down: [],
            left: [],
            right: [],
            up: []
        };

        // Utilisez une boucle pour extraire chaque sprite de la feuille de sprites
        for (let i = 1; i < 6; i++) {
            let frame = new PIXI.Rectangle(i * 100, 0, 100, 100); // Remplacez 0 par la ligne appropriée pour chaque direction
            characterTextures.down.push(new PIXI.Texture(spriteSheet.baseTexture, frame));
            frame = new PIXI.Rectangle(i * 100, 100, 100, 100);
            characterTextures.up.push(new PIXI.Texture(spriteSheet.baseTexture, frame));
            frame = new PIXI.Rectangle(i * 100, 200, 100, 100);
            characterTextures.right.push(new PIXI.Texture(spriteSheet.baseTexture, frame));
        }
        // Create the "player" using the texture
        const playerBox = new PIXI.Sprite(characterTextures.down[0]);
        playerBox.anchor.set(0.5); // Centre l'origine du sprite
        playerBox.position.set(renderer.width / 2, renderer.height / 2); // Positionnez le sprite au centre de la scène



        // Créez un style pour votre texte
        let style = new PIXI.TextStyle({
            fontFamily: 'Arial', // Changez la police ici
            fontSize: 36, // Changez la taille de la police ici
            fill: '#ffffff', // Changez la couleur du texte ici
            stroke: '#000000', // Changez la couleur du contour ici
            strokeThickness: 4, // Changez l'épaisseur du contour ici
        });

// Créez le texte
        let houseText = new PIXI.Text('Maison 1', style);
        houseText.anchor.set(0.5); // Centre l'origine du texte
        houseText.position.set(renderer.width / 2, renderer.height / 4); // Positionnez le texte au-dessus du centre de la scène

// Ajoutez le texte à la scène
        stage.addChild(houseText);

        // Créez la boule
        let ball = new PIXI.Graphics();
        ball.beginFill(0xFF0000); // Changez la couleur de la boule ici
        ball.drawCircle(0, 0, 15); // Changez la taille de la boule ici
        ball.endFill();
        ball.position.set(renderer.width / 2, renderer.height / 2.7); // Positionnez la boule au centre de la scène
        stage.addChild(ball);

        // Load the texture for the "house"
        // const houseTexture = PIXI.Texture.from('maison.png');
        // Create the "house" using the texture
        // const houseBox = new PIXI.Sprite(houseTexture);
        // houseBox.anchor.set(0.25); // Centre l'origine du sprite
        // houseBox.width = 200; // Largeur en pixels
        // houseBox.height = 139;
        // houseBox.position.set(renderer.width / 3, renderer.height / 4); // Positionnez le sprite au-dessus du centre de la scène
        // houseBox.interactive = true; // Rendre la maison interactive
        // houseBox.on('pointerdown', () => { // Ajouter un écouteur d'événements pour déplacer le personnage vers la maison lorsqu'on clique dessus
        //     const distance = Math.sqrt(Math.pow(houseBox.position.x - playerBox.position.x, 2) + Math.pow(houseBox.position.y - playerBox.position.y, 2));
        //     const duration = distance / 100; // Durée de l'animation en secondes, dépend de la distance
        //     gsap.to(playerBox.position, { x: houseBox.position.x, y: houseBox.position.y - houseBox.height, duration: duration });
        // });
        // Create a text for the prompt
        const promptText = new PIXI.Text("Rentrer dans cette maison ?", { fill: 0xffffff });
        promptText.anchor.set(0.5);
        promptText.visible = false; // Hide the text initially
        stage.addChild(sceneContainer);
        stage.addChild(promptText);
        // Add boxes to the stage
        stage.addChild(playerBox);
        // stage.addChild(houseBox);
        animate();

        // Ajoutez ces lignes avant vos contrôles de mouvement
        let houseRect = new PIXI.Rectangle(houseText.position.x, houseText.position.y, houseText.width, houseText.height);
        let playerRect = new PIXI.Rectangle(playerBox.position.x, playerBox.position.y, playerBox.width, playerBox.height);
        let rightStepCounter = 0;
        let downStepCounter = 0;
        let upStepCounter = 0;
        let isWalking = false;
        function animate() {
            // Render the stage
            renderer.render(stage);
            // Check the distance between the player and the house
            const distance = Math.sqrt(Math.pow(houseText.position.x - playerBox.position.x, 2) + Math.pow(houseText.position.y - playerBox.position.y, 2));
            if (distance < 100) {
                // If the player is close to the house, show the prompt
                promptText.visible = true;
                promptText.position.set(playerBox.position.x, playerBox.position.y - playerBox.height / 2 - promptText.height);
            } else {
                // If the player is not close to the house, hide the prompt
                promptText.visible = false;
            }
            // Modifiez la partie du code qui gère le mouvement vers la gauche comme suit :
            if (keys[37] && playerBox.position.x - 3 > 0 && !houseRect.contains(playerRect.x - 3, playerRect.y)) { // gauche
                if (!isWalking) {
                    isWalking = true;
                    playerBox.texture = characterTextures.right[rightStepCounter % 5];
                    playerBox.scale.x = -1;
                    rightStepCounter++;

                    setTimeout(() => {
                        isWalking = false;
                    }, 200); // Ajoutez le temps d'attente ici (200 millisecondes dans cet exemple)
                }
                playerBox.position.x -= 2;
            }
            if (keys[38] && playerBox.position.y - 5 > 0 && !houseRect.contains(playerRect.x, playerRect.y - 3)) { // haut
                if (!isWalking) {
                    isWalking = true;
                    playerBox.texture = characterTextures.up[upStepCounter % 5];
                    playerBox.scale.x = 1;
                    upStepCounter++;
                    setTimeout(() => {
                        isWalking = false;
                    }, 200);
                }
                playerBox.position.y -= 2;
            }
            // Modifiez la partie du code qui gère le mouvement vers la droite comme suit :
            if (keys[39] && playerBox.position.x + 5 < renderer.width && !houseRect.contains(playerRect.x + 3, playerRect.y)) { // droite
                if (!isWalking) {
                    isWalking = true;
                    playerBox.texture = characterTextures.right[rightStepCounter % 5];
                    playerBox.scale.x = 1;
                    rightStepCounter++;

                    setTimeout(() => {
                        isWalking = false;
                    }, 200);
                }
                playerBox.position.x += 2;
            }
            if (keys[40] && playerBox.position.y + 5 < renderer.height && !houseRect.contains(playerRect.x, playerRect.y + 3)) { // bas
                if (!isWalking) {
                    isWalking = true;
                    playerBox.texture = characterTextures.down[downStepCounter % 5];
                    playerBox.scale.x = 1;
                    downStepCounter++;

                    setTimeout(() => {
                        isWalking = false;
                    }, 200);
                }
                playerBox.position.y += 2;
            }
            checkCollision();
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

        // Ajoutez un écouteur d'événements pour vérifier si le personnage touche la boule
        function checkCollision() {
            let playerRect = new PIXI.Rectangle(playerBox.position.x, playerBox.position.y, playerBox.width, playerBox.height);
            let ballRect = new PIXI.Rectangle(ball.position.x, ball.position.y, ball.width, ball.height);
            if (playerRect.intersects(ballRect)) {
                // Chargez la nouvelle scène
                import('./NewScene.js').then((NewScene) => {
                    NewScene.load(renderer);
                });
            }
        }

    }, []);
    return <div ref={pixiContainer} className="pixi-container"></div>;
};

export default PixiComponent;

