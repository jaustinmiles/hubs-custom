import ball from "../assets/models/custom/ball.glb";
// import ball from "../assets/models/DuckyMesh.glb";

import { TYPE } from "three-ammo/constants";
import { THREE } from "aframe";
import { array } from "prop-types";

const COLLISION_LAYERS = require("../constants").COLLISION_LAYERS;

const FORWARD = new THREE.Vector3(0, 0, -1);
const q = new THREE.Quaternion();
const vecHelper = new THREE.Vector3();
const p0 = new THREE.Vector3();

AFRAME.registerComponent("ball", {
    schema: {
        throwBall: {type: "string"},
        camera: { type: "selector" },
        spawnerScale: {default: 1},
        balls: {default: []}
    },

    init: (() => {
        return function () {
            this.balls = this.data.balls;
            const spawnerEntity = document.createElement("a-entity");
            const url = new URL(ball, window.location.href).href;
            const spawnEvent = "throwBall";

            spawnerEntity.setAttribute("super-spawner", {
                src: url,
                template: "#interactable-ball-media",
                spawnScale: { x: this.data.spawnedScale, y: this.data.spawnedScale, z: this.data.spawnedScale },
                spawnEvent
            });

            this.spawnEvent = spawnEvent;
            let position = this._getPosition();
            spawnerEntity.object3D.position.copy(position);
            spawnerEntity.object3D.matrixNeedsUpdate = true;
            this.el.appendChild(spawnerEntity);
            this.el.addEventListener("spawned-entity-loaded", (target) => {
                console.log(target);
                let ent = document.getElementById(target.detail.target.id);
                this.balls.push(ent);
                console.log(ent);
                console.log(ent.object3D.children[0].children[0].children[0].children[0])
            })
            console.log(this);
        }
    } )(),

    tick() {
        const {throwBall, camera, spawnerScale} = this.data;
        const userinput = AFRAME.scenes[0].systems.userinput;
        if (userinput.get(throwBall)) {
            this.el.sceneEl.emit(this.spawnEvent);
        }
    },

    _getPosition() {
        let position = new THREE.Vector3();
        const cameraObject = this.data.camera.object3D;
        position.copy(cameraObject.parent.el.object3D.position);
        cameraObject.matrixWorld.decompose(p0, q, vecHelper);
        let direction = new THREE.Vector3();
        direction
            .copy(FORWARD)
            .applyQuaternion(q)
            .normalize();
        direction.multiplyScalar(3).add(new THREE.Vector3(0, 2, 0));
        console.log(direction);
        position.add(direction);
        return position;
    }
})
