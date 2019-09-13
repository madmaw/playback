const pressurePlateFactoryFactory = (
    width: number, 
    height: number, 
    [hue, baseSaturation, baseLighting]: HSL, 
    edge: Edge = EDGE_TOP, 
) => {
    const palette: HSL[] = [
        [hue, baseSaturation, baseLighting + 9], 
        [hue, baseSaturation - 9, baseLighting],
        [hue, baseSaturation, baseLighting - 9],    
        [hue, baseSaturation, baseLighting - 19], 
        [0, 0, 99], 
    ];
    const graphic = pressurePlateGraphicFactory(width * 32, height * 32, edge);
    return (x: number, y: number, id: IdFactory) => {
        const pressurePlate: PressurePlate = {
            eid: id(),
            graphic, 
            palette, 
            entityType: ENTITY_TYPE_PRESSURE_PLATE, 
            collisionGroup: COLLISION_GROUP_TERRAIN, 
            collisionMask: COLLISION_MASK_TERRAIN, 
            bounds: [x, y, width, height], 
            baseVelocity: 0, 
            holding: {}, 
            handJointId: 0, 
            insertionJointId: PRESSURE_PLATE_GRAPHIC_JOINT_ID_TAPE, 
            activeInputs: {
            }, 
            gravityMultiplier: 0, 
            toSpeak: [], 
            velocity: [0, 0], 
            autoRewind: 1, 
            //capabilities: [INSTRUCTION_ID_PLAY, INSTRUCTION_ID_REWIND, INSTRUCTION_ID_FAST_FORWARD, INSTRUCTION_ID_EJECT], 
            pressureEdge: edge, 
        }
        return [pressurePlate];
    }
};

