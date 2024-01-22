import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import "./style.css"
import playerImage from "../images/graphics-sprites 2d-game-character.png"
import maisonImage from "../images/maison.png"

const PixiComponent = () => {
    const pixiContainer = useRef(null);
    let keys = {};
    const onKeyDown = (e) => {
        keys[e.keyCode] = true;
    };

    const onKeyUp = (e) => {
        keys[e.keyCode] = false;
    };
    const windowSize = useRef([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        // Set up Pixi.js
        let renderer = PIXI.autoDetectRenderer({
            backgroundColor: 0x000000, // Changer la couleur de fond ici
            width: windowSize.current[0],
            height: windowSize.current[1]
        });
        pixiContainer.current.innerHTML = ""; // Clear the container
        pixiContainer.current.appendChild(renderer.view);
        // Create a container for the scene and the blue border
        const sceneContainer = new PIXI.Container();
        const maison = new PIXI.Sprite(PIXI.Texture.from(maisonImage));
        maison.width = 588 / 3;
        maison.height = 678 / 3;
        maison.position.set(renderer.width / 2.9, renderer.height / 3.9); // Positionnez le sprite au centre de la scène
        sceneContainer.addChild(maison);
        const border = new PIXI.Graphics();
        border.lineStyle(15, 0xe1dbdb); // Line style: 5 pixels width, blue color
        border.drawRect(0, 0, renderer.width, renderer.height - 60); // Draw a rectangle around the scene
        sceneContainer.addChild(border);
        // Create the stage
        const stage = new PIXI.Container();
        let spriteSheet = PIXI.Texture.from(playerImage);
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
        const player = new PIXI.Sprite(characterTextures.down[0]);
        player.anchor.set(0.5); // Centre l'origine du sprite
        player.position.set(renderer.width / 2, renderer.height / 2);
        sceneContainer.addChild(player);

        // Créez le texte
        let styleText = new PIXI.TextStyle({
            fontFamily: 'Verdana', // Remplacez "NouvellePolice" par le nom de la police que vous souhaitez utiliser
            fontSize: 32, // Remplacez par la taille de police souhaitée
            fill: 0xFFFFFF, // Couleur du texte en hexadécimal
            align: 'center', // Alignement du texte
        });
        // Créez le texte
        let houseText = new PIXI.Text('Chat', styleText);
        houseText.anchor.set(0.5); // Centre l'origine du texte
        houseText.position.set(renderer.width / 2.63, renderer.height / 4.1); // Positionnez le texte au-dessus du centre de la scène

        // Create a text for the prompt
        const promptText = new PIXI.Text("Rentrer dans cette maison ?", { fill: 0xffffff });
        promptText.anchor.set(0.5);
        promptText.visible = false; // Hide the text initially
        stage.addChild(sceneContainer);
        stage.addChild(promptText);
        stage.addChild(houseText);
        animate();

        // Ajoutez ces lignes avant vos contrôles de mouvement
        let houseRect = new PIXI.Rectangle(houseText.position.x, houseText.position.y, houseText.width, houseText.height);
        let playerRect = new PIXI.Rectangle(player.position.x, player.position.y, player.width, player.height);
        let rightStepCounter = 0;
        let downStepCounter = 0;
        let upStepCounter = 0;
        let isWalking = false;
        function animate() {
            // Render the stage
            renderer.render(stage);
            // Check the distance between the player and the house
            const distance = Math.sqrt(Math.pow(maison.position.x - player.position.x, 2) + Math.pow(maison.position.y - player.position.y, 2));
            if (distance < 250) {
                // If the player is close to the house, show the prompt
                promptText.visible = true;
                promptText.position.set(player.position.x, player.position.y - player.height / 2 - promptText.height);
            } else {
                // If the player is not close to the house, hide the prompt
                promptText.visible = false;
            }
            const timeOut = 100;
            // Modifiez la partie du code qui gère le mouvement vers la gauche comme suit :
            if (keys[37] && player.position.x - 3 > 0 && !houseRect.contains(playerRect.x - 3, playerRect.y)) { // gauche
                if (!isWalking) {
                    isWalking = true;
                    player.texture = characterTextures.right[rightStepCounter % 5];
                    player.scale.x = -1;
                    rightStepCounter++;

                    setTimeout(() => {
                        isWalking = false;
                    }, timeOut); // Ajoutez le temps d'attente ici (200 millisecondes dans cet exemple)
                }
                player.position.x -= 2;
            }
            if (keys[38] && player.position.y - 5 > 0 && !houseRect.contains(playerRect.x, playerRect.y - 3)) { // haut
                if (!isWalking) {
                    isWalking = true;
                    player.texture = characterTextures.up[upStepCounter % 5];
                    player.scale.x = 1;
                    upStepCounter++;
                    setTimeout(() => {
                        isWalking = false;
                    }, timeOut);
                }
                player.position.y -= 2;
            }
            // Modifiez la partie du code qui gère le mouvement vers la droite comme suit :
            if (keys[39] && player.position.x + 5 < renderer.width && !houseRect.contains(playerRect.x + 3, playerRect.y)) { // droite
                if (!isWalking) {
                    isWalking = true;
                    player.texture = characterTextures.right[rightStepCounter % 5];
                    player.scale.x = 1;
                    rightStepCounter++;

                    setTimeout(() => {
                        isWalking = false;
                    }, timeOut);
                }
                player.position.x += 2;
            }
            if (keys[40] && player.position.y + 5 < renderer.height && !houseRect.contains(playerRect.x, playerRect.y + 3)) { // bas
                if (!isWalking) {
                    isWalking = true;
                    player.texture = characterTextures.down[downStepCounter % 5];
                    player.scale.x = 1;
                    downStepCounter++;

                    setTimeout(() => {
                        isWalking = false;
                    }, timeOut);
                }
                player.position.y += 2;
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
// Ajoutez un écouteur d'événements pour le redimensionnement de la fenêtre
// Define the resize function
        const onResize = () => {
            // Update the renderer size
            renderer.resize(window.innerWidth, window.innerHeight);
            // Update the position of the elements based on the new window size
            player.position.set(renderer.width / 2, renderer.height / 2);
            maison.position.set(renderer.width / 2, renderer.height / 2.7);
            houseText.position.set(renderer.width / 2, renderer.height / 4);
        };

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('resize', onResize);
        };

// Ajoutez un écouteur d'événements pour vérifier si le personnage touche la boule
        function checkCollision() {
            let playerRect = new PIXI.Rectangle(player.position.x, player.position.y, player.width, player.height);
            let maisonRect = new PIXI.Rectangle(maison.position.x, maison.position.y, maison.width, maison.height);
            if (playerRect.intersects(maisonRect)) {
                // Chargez la nouvelle scène
                import('./NewScene.js').then((NewScene) => {
                    NewScene.load(renderer);
                });
            }
        }


    }, []);

    return (
        <div>
            <p style={{
                color: "white", position: "relative",
                margin: "auto",
                alignItems: "center",
                justifyContent: "center", display: "flex", fontFamily: "Arial", fontSize: "37px", paddingTop: "15px"
            }}>Sneakers World</p>
            <div ref={pixiContainer} className="pixi-container"></div>
        </div>
    );
};

export default PixiComponent;

