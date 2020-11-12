const { THREE } = require("aframe");
const { Vector3 } = require("three");
const { Vector2 } = require("three");

AFRAME.registerComponent("goal-post", {
    schema: {
        
    },

    init: function()  {
        const material = new THREE.MeshBasicMaterial({color:0xffff00});
        
        const sideGeometryL = new THREE.CylinderGeometry(0.125, 0.125, 5, 20, 20);
        const sideCylinderL = new THREE.Mesh(sideGeometryL, material);

        const sideGeometryR = new THREE.CylinderGeometry(0.125, 0.125, 5, 20, 20);
        const sideCylinderR = new THREE.Mesh(sideGeometryR, material);

        const topGeometry = new THREE.CylinderGeometry(0.125, 0.125, 10, 20, 20);
        const topCylinder = new THREE.Mesh(topGeometry, material);

        sideCylinderL.position.set(-5, 2.5, 0);
        sideCylinderR.position.set(5, 2.5, 0);
        topCylinder.rotation.setFromVector3(new THREE.Vector3(0, 0, Math.PI / 2));
        topCylinder.position.set(0, 5, 0);

        this.topCylinder = topCylinder;
        this.sideCylinderR = sideCylinderR;
        this.sideCylinderL = sideCylinderL;

        var group = new THREE.Group();
        group.add(sideCylinderL);
        group.add(sideCylinderR);
        group.add(topCylinder);

        this.goalPost = group;
        this.el.setObject3D('goal', group);
    },

    tick: function() {
        let v1 = new THREE.Vector3(1, 0, 0);
        let q1 = new THREE.Quaternion();
        q1.setFromEuler(this.el.getObject3D('goal').rotation);
        v1.applyQuaternion(q1);
        let v2 = new THREE.Vector3(0, -1, 0);
        v2.applyQuaternion(q1);
        let cross = v1.cross(v2);
        let worldPos = new THREE.Vector3();
        this.el.getObject3D('goal').getWorldPosition(worldPos);
        let dist = Math.sqrt(worldPos.x**2 + worldPos.y**2 + worldPos.z**2)
        let intersectionPlane = new THREE.Plane(cross.normalize(), dist)
        let balls = document.getElementById("ball").components["ball"].balls;
        balls.forEach(ball => {
            let topBound = new THREE.Vector3();
            let leftBound = new THREE.Vector3();
            let rightBound = new THREE.Vector3();

            this.topCylinder.getWorldPosition(topBound);
            this.sideCylinderL.getWorldPosition(leftBound);
            this.sideCylinderR.getWorldPosition(rightBound);

            let ballWorld = new THREE.Vector3();
            

            let obj = ball.object3D.children[0].children[0].children[0].children[0]

            obj.geometry.computeBoundingSphere();
            obj.getWorldPosition(ballWorld);
            let boundingSphere = obj.geometry.boundingSphere;
            boundingSphere.translate(ballWorld).translate(new Vector3(0, 0, 0));
            let worldScale = new THREE.Vector3();
            obj.getWorldScale(worldScale);



            if (intersectionPlane.intersectsSphere(boundingSphere)
            && this.checkBetweenGoalPosts(leftBound, rightBound, topBound, ballWorld)) {
                console.log('hit');
            }

        })

    },

    checkBetweenGoalPosts: function (leftBound, rightBound, topBound, position) {
        if (((leftBound.x < position.x && rightBound.x > position.x) || 
            (leftBound.x > position.x && rightBound.x < position.x))
            && position.y < topBound.y) {
                return true
        } else {
            return false
        }
         
    }
})

