const pressurePlateFactoryFactory = (width: number, height: number, hue: number, saturationMidpoint: number = 30, lightnessMidpoint: number = 60) => {
    const palette: HSL[] = [
        [hue, saturationMidpoint, lightnessMidpoint + 9], 
        [hue, saturationMidpoint - 9, lightnessMidpoint],
        [hue, saturationMidpoint, lightnessMidpoint - 9],    
    ];
    const graphic = pressurePlateGraphicFactory(width * 32, height * 32, EDGE_TOP);
    return (x: number, y: number, id: IdFactory) => {
        const pressurePlate: PressurePlate = {
            id: id(),
            graphic, 
            palette, 
            entityType: ENTITY_TYPE_PRESSURE_PLATE, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            collisionMask: COLLISION_MASK_TERRAIN, 
            bounds: [x, y, width, height], 
            baseVelocity: 0, 
            boundsWithVelocity: [0, 0, 0, 0],
            edge: EDGE_TOP, 
            holding: new Map(), 
            handJointId: 0, 
            insertionJointId: 0, 
            inputs: {
                reads: {}, 
                states: {}, 
            } , 
            lastCollisions: [0, 0, 0, 0, 0], 
            gravityMultiplier: 0, 
            mass: 0, 
            toSpeak: [], 
            velocity: [0, 0], 
        }
        return [pressurePlate];
    }
};

