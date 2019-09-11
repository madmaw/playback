const mainframeFactoryFactory = (hue: number) => {
    const palette: HSL[] = [
        [hue, 30, 60], 
        [hue, 20, 50],
        [hue, 30, 40],
        [0, 0, 30], 
        [0, 0, 10], 
    ];
    return (x: number, y: number, id: IdFactory) => {
        const mainframe: Robot = {
            entityType: ENTITY_TYPE_ROBOT, 
            graphic: mainframeGraphic, 
            palette, 
            bounds: rectangleCenterBounds(x, y, 1, 1.5),
            // only collide with robots on the bottom or top
            // don't collide with items at all
            collisionMask: COLLISION_MASK_BACKGROUNDED, 
            collisionGroup: COLLISION_GROUP_BACKGROUNDED, 
            gravityMultiplier: 0, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0],
            mass: 0, 
            nextInstructionTime: 0, 
            nextScriptIndex: 0, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY/3, 
            boundsWithVelocity: [0, 0, 0, 0], 
            facing: 1, 
            orientationStartTime: 0, 
            activeInputs: {
                reads: {}, 
                states: {}, 
            }, 
            hue, 
            holding: {},  
            handJointId: 0, 
            instructionsHeard: [],             
            capabilities: [
                INSTRUCTION_ID_DO_NOTHING, 
                INSTRUCTION_ID_SAVE,
            ], 
        };
        return [mainframe];        
    };
}