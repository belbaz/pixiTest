import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import gsap from 'gsap'; // Importer GreenSock Animation Platform (GSAP)
import './style.css';

const PixiComponent = () => {
    const pixiContainer = useRef(null);
    const [app, setApp] = useState(null);

    useEffect(() => {
        const initPixiApp = () => {
            const newApp = new PIXI.Application({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x282c34,
            });

            pixiContainer.current.appendChild(newApp.view);

            const houseTexture = PIXI.Texture.from('Sneakers.png'); // Assurez-vous d'avoir l'image sneakers.jpg dans le bon répertoire

            const fadeInDuration = 1; // Durée de l'animation de fondu en secondes

            const handleResize = () => {
                newApp.renderer.resize(window.innerWidth, window.innerHeight);

                const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

                // Supprimez les anciennes sneakerss et les textes
                newApp.stage.removeChildren();

                const numHouses = 6; // Nombre de sneakerss
                const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4; // Rayon du cercle (taille relative)

                for (let i = 0; i < numHouses; i++) {
                    const angle = (i / numHouses) * Math.PI * 2;
                    const x = center.x + radius * Math.cos(angle);
                    const y = center.y + radius * Math.sin(angle);

                    const house = new PIXI.Sprite(houseTexture);
                    house.anchor.set(0.25); // Centre l'origine du sprite
                    house.width = 200; // Largeur en pixels
                    house.height = 139; // Hauteur en pixels
                    // house.scale.set(0.20);

                    // Définir l'opacité à zéro pour le fondu en entrée
                    house.alpha = 0;
                    house.position.set(x, y);
                    house.interactive = true;
                    house.on('pointerdown', () => openModal(`sneakers ${i + 1}`));
                    newApp.stage.addChild(house);

                    // Animation de fondu en entrée
                    gsap.to(house, { alpha: 1, duration: fadeInDuration, delay: i * (fadeInDuration / numHouses) });

                    // Créez un texte en dessous de chaque sneakers
                    const houseText = new PIXI.Text(`sneakers ${i + 1}`, {
                        fontSize: 16,
                        fill: 0xffffff,
                        paddingLeft: 10,
                    });
                    houseText.anchor.set(0.5); // Centre le texte
                    houseText.position.set(x, y + house.height / 2 + 50); // Positionnez le texte en dessous de la sneakers
                    newApp.stage.addChild(houseText);
                }

                // Créez un texte au-dessus des sneakerss
                const titleStyle = new PIXI.TextStyle({
                    fontSize: 24,
                    fill: 0xffffff,
                });

                const title = new PIXI.Text('Sneakers World', titleStyle);
                title.anchor.set(0.5); // Centre le texte
                title.position.set(center.x, center.y - radius - 50); // Positionnez le texte au-dessus des sneakerss
                newApp.stage.addChild(title);
            };

            window.addEventListener('resize', handleResize);
            handleResize();
            setApp(newApp);
        };

        const openModal = (content) => {
            alert("Sneakers : " + content);
        };

        initPixiApp();
    }, []);

    return <div ref={pixiContainer}></div>;
};

export default PixiComponent;
