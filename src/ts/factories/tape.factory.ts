const tapeFactoryFactory = (script: number[], hsl: HSL) => {
    const palette: HSL[] = [
        hsl, 
        [0, 0, 25],
        [0, 0, 100],
    ];
    return (x: number, y: number, id: IdFactory) => {
        
        const tape: Tape = {
            entityType: ENTITY_TYPE_TAPE, 
            graphic: tapeGraphic, 
            palette, 
            bounds: rectangleCenterBounds(x, y, .42, .27), 
            // don't collide with other items
            collisionGroup: COLLISION_GROUP_ITEMS, 
            collisionMask: COLLISION_MASK_ITEMS, 
            gravityMultiplier: 1, 
            id: id(), 
            lastCollisions: [0, 0, 0, 0, 0], 
            mass: .05, 
            boundsWithVelocity: [0, 0, 0, 0], 
            velocity: [0, 0], 
            restitution: .4, 
            facing: 0,
            orientationStartTime: 0, 
            script: [...script], 
        }
        return [tape];
    }    
};