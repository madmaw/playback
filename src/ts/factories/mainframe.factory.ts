const mainframeFactoryFactory = (hue: number) => {
    const palette: HSL[] = [
        [hue, 40, 60],
        [0, 0, 30], 
        [0, 0, 9], 
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
            eid: id(), 
            nextInstructionTime: 0, 
            nextScriptIndex: 0, 
            velocity: [0, 0], 
            baseVelocity: BASE_VELOCITY/3, 
            entityOrientation: 1, 
            orientationStartTime: 0, 
            activeInputs: {
            }, 
            hue, 
            holding: {},  
            capabilities: [
                INSTRUCTION_ID_DO_NOTHING, 
                INSTRUCTION_ID_SAVE,
            ], 
        };
        return [mainframe];        
    };
}