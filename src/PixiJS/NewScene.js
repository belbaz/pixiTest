// NewScene.js
import * as PIXI from 'pixi.js';

export function load(renderer) {
    // Créez un nouveau renderer

    // Créez une nouvelle scène
    let stage = new PIXI.Container();

    // Créez un style pour votre texte
    let style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
    });

    // Créez le texte
    let text = new PIXI.Text('Bonjour ', style);
    text.anchor.set(0.5);
    text.position.set(renderer.width / 2, renderer.height / 2);

    // Ajoutez le texte à la scène
    stage.addChild(text);

    // Ajoutez une boucle d'animation
    function animate() {
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

    // Commencez l'animation
    animate();
}
