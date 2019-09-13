const tapeFactoryFactory = (script: number[], hue: number, into?: EntityFactory, scale = 1) => {
    const palette: HSL[] = [
        [hue, 99, 70], 
        [0, 0, 25],
        [0, 0, 99],
    ];
    return (x: number, y: number, id: IdFactory) => {        
        const tape: Tape = {
            entityType: ENTITY_TYPE_TAPE, 
            graphic: tapeGraphic, 
            palette, 
            bounds: rectangleCenterBounds(x, y, .5 * scale, .4 * scale), 
            // don't collide with other items
            collisionGroup: scale > 1 ? COLLISION_GROUP_PUSHABLES : COLLISION_GROUP_ITEMS, 
            collisionMask: scale > 1 ? COLLISION_MASK_PUSHABLES : COLLISION_MASK_ITEMS, 
            gravityMultiplier: 1, 
            eid: id(), 
            mass: scale, 
            velocity: [0, 0], 
            restitution: .4, 
            entityOrientation: 0,
            orientationStartTime: 0, 
            script: [...script], 
            hue, 
        }
        if (into) {
            const entities = into(x, y, id);
            const ee = entities[0] as EveryEntity;
            ee.holding[ee.insertionJointId] = tape;
            return entities;
        } else {
            return [tape];
        }
    }    
};