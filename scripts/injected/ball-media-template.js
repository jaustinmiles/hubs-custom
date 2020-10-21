let scene = document.querySelector("a-scene");
if (scene.hasLoaded) {
    run();
} else {
    scene.addEventListener('loaded', run);
}



function run() {
    let assets = scene.querySelector("a-assets");

    let newTemplate = document.createElement("template");
    newTemplate.id = "interactable-ball-media";
    let newEntity = document.createElement("a-entity");
    newEntity.setAttribute("class", "interactable");
    let bh = document.createAttribute("body-helper");
    bh.value = "type: dynamic; mass: 1; collisionFilterGroup: 1; collisionFilterMask: 15;";
    newEntity.setAttributeNode(bh);
    newEntity.setAttribute("set-unowned-body-kinematic", "");
    newEntity.setAttribute("is-remote-hover-target", "");
    bh = document.createAttribute("tags")
    bh.value = "isHandCollisionTarget: true; isHoldable: true; offersHandConstraint: true; offersRemoteConstraint: true; inspectable: true;"
    newEntity.setAttributeNode(bh);
    newEntity.setAttribute("destroy-at-extreme-distances", "");
    newEntity.setAttribute("scalable-when-grabbed", "");
    newEntity.setAttribute("set-xyz-order", "");
    newEntity.setAttribute("matrix-auto-update", "");
    newEntity.setAttribute("hoverable-visuals", "");
    newTemplate.content.appendChild(newEntity);
    assets.appendChild(newTemplate);
    
    
    
    const vectorRequiresUpdate = epsilon => {
        return () => {
        let prev = null;

        return curr => {
            if (prev === null) {
            prev = new THREE.Vector3(curr.x, curr.y, curr.z);
            return true;
            } else if (!NAF.utils.almostEqualVec3(prev, curr, epsilon)) {
            prev.copy(curr);
            return true;
            }

            return false;
        };
        };
    };

    console.log(NAF.schemas);

    NAF.schemas.add({
        template: "#interactable-ball-media",
        components: [
        {
            component: "position",
            requiresNetworkUpdate: vectorRequiresUpdate(0.001)
        },
        {
            component: "rotation",
            requiresNetworkUpdate: vectorRequiresUpdate(0.5)
        },
        {
            component: "scale",
            requiresNetworkUpdate: vectorRequiresUpdate(0.001)
        },
        "media-loader",
        "pinnable"
        ]
    });
    console.log(NAF.schemas);
}