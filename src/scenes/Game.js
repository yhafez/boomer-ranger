import Phaser from "phaser";
import background from "../assets/dungeon-bg.jpg";
import hero from "../assets/hero.png";
import enemy from "../assets/enemy.png";
import boomerang from "../assets/boomerang.png";
import { accelerate, decelerate } from "../utils";

let avatar;
let cursors;
let weapon;

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "game" });
        window.GAME = this;
    },
    preload: function preload() {
        this.load.image("background", background);

        this.load.image("hero", hero);

        this.load.image("enemy", enemy);

        this.load.image("boomerang", boomerang);
    },

    create: function create() {
        // Stage background
        const bg = this.add.image(400, 300, "background");
        bg.setScale(1.5, 1.5);

        // Stage enemies
        const enemies = this.physics.add.group({
            key: "enemy",
            repeat: Math.ceil(Math.random() * 10),
            setScale: { x: 0.04, y: 0.04 },
            setXY: { x: 750, y: 300 },
        });

        enemies.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            // child.setVelocityX(150 - Math.random() * 300);
            child.setVelocityY(150 - Math.random() * 300);
            child.setBounce(1, 1);
            child.setCollideWorldBounds(true);
        });

        // Player avatar
        avatar = this.physics.add.image(80, 200, "hero");
        avatar.setCollideWorldBounds(true);
        avatar.setScale(0.06, 0.06);
        avatar.setBounce(1, 1);

        // Boomerang
        weapon = this.physics.add.image(0, 0, "boomerang");
        weapon.disableBody(false, true);
        console.log(weapon);

        // Keyboard inputs
        cursors = this.input.keyboard.createCursorKeys();
        console.log(cursors);

        // Process collision when boomerang hits enemy
        const processEnemyCollision = (weapon, enemy) => {
            enemy.destroy();
            weapon.setVelocityX(-300);
            const enemiesLeft = enemies.countActive();
            if (enemiesLeft === 0) {
                this.scene.start("winscreen");
            }
        };

        this.physics.add.collider(
            enemies,
            weapon,
            processEnemyCollision,
            null,
            this
        );
    },
    update: function () {
        const { velocity } = avatar.body;

        if (cursors.space.isDown && weapon.visible === false) {
            console.log(weapon);
            const { x: avatarX, y: avatarY } = avatar.getBottomLeft();

            weapon.enableBody(true, avatarX + 80, avatarY - 35, true, true);
            weapon.setCollideWorldBounds(true);
            weapon.setScale(0.05, 0.05);
            weapon.setAngularVelocity(500);
            weapon.setVelocityX(500);
            weapon.setBounce(1, 0);
        }

        //Weapon position
        const { x: weaponXLeft, y: weaponYBottom } = weapon.getBottomLeft();
        const { x: weaponXRight, y: weaponYTop } = weapon.getTopRight();

        // avatar position
        const { x: avatarXLeft, y: avatarYBottom } = avatar.getBottomLeft();
        const { x: avatarXRight, y: avatarYTop } = avatar.getTopRight();
        if (weaponXLeft < avatarXRight || weaponXRight < avatarXRight) {
            weapon.disableBody(false, true);
            weapon.setX(avatarXRight + 100);
        }

        if (cursors.shift.isDown) {
            //Weapon position
            const { x: weaponXLeft, y: weaponYBottom } = weapon.getBottomLeft();
            const { x: weaponXRight, y: weaponYTop } = weapon.getTopRight();

            // avatar position
            const { x: avatarXLeft, y: avatarYBottom } = avatar.getBottomLeft();
            const { x: avatarXRight, y: avatarYTop } = avatar.getTopRight();

            console.log(
                "weapon location",
                `Top: ${weaponYTop}`,
                `Bottom: ${weaponYBottom}`,
                `Left: ${weaponXLeft}`,
                `Right: ${weaponXRight}`
            );

            console.log(
                "avatar location",
                `Top: ${avatarYTop}`,
                `Bottom: ${avatarYBottom}`,
                `Left: ${avatarXLeft}`,
                `Right: ${avatarXRight}`
            );
        }

        if (cursors.up.isDown) avatar.setVelocityY(accelerate(velocity.y, -1));
        // if (cursors.right.isDown)
        //     avatar.setVelocityX(accelerate(velocity.x, 1));
        if (cursors.down.isDown) avatar.setVelocityY(accelerate(velocity.y, 1));
        // if (cursors.left.isDown)
        //     avatar.setVelocityX(accelerate(velocity.x, -1));
    },
});
