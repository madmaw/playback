const bossFactoryFactory = (hue: number, entityFactory?: EntityFactory, asspullFactory?: () => Asspull) => {
    return (x: number, y: number, id: IdFactory) => {
        const boss: Robot = {
            graphic: playerGraphic, 
            palette: bossPalette, 
            entityType: ENTITY_TYPE_ROBOT, 
            bounds: rectangleCenterBounds(x, y, 1.5, 1.9),
            collisionGroup: COLLISION_GROUP_PLAYER, 
            collisionMask: COLLISION_MASK_PLAYER, 
            gravityMultiplier: 1, 
            entityOrientation: ORIENTATION_RIGHT, 
            orientationStartTime: 0, 
            eid: id(),
            mass: 49, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY, 
            airTurn: 1, 
            activeInputs: {}, 
            holding: {
                [PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND]: entityFactory && entityFactory(x, y, id)[0] as MovableEntity, 
            },  
            hue, 
            handJointId: PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND,
            insertionJointId: PLAYER_GRAPHIC_JOINT_ID_TAPE_DECK,
            capabilities: INSTRUCTIONS.map((instruction, i) => i),
            nextScriptIndex: 0, 
            asspull: asspullFactory && asspullFactory(), 
        };    
        return [boss];    
    }
};