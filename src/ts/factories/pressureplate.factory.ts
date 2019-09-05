const pressurePlateFactoryFactory = (
    width: number, 
    height: number, 
    hue: number, 
    saturationMidpoint: number = 30, 
    lightnessMidpoint: number = 60, 
    script?: number[], 
    tapeColour?: HSL
) => {
    const palette: HSL[] = [
        [hue, saturationMidpoint, lightnessMidpoint + 9], 
        [hue, saturationMidpoint - 9, lightnessMidpoint],
        [hue, saturationMidpoint, lightnessMidpoint - 9],    
        [hue, saturationMidpoint, lightnessMidpoint - 19], 
        [0, 0, 100], 
    ];
    const graphic = pressurePlateGraphicFactory(width * 32, height * 32, EDGE_TOP);
    const tapeGenerator = script && tapeFactoryFactory(script, tapeColour);
    return (x: number, y: number, id: IdFactory) => {
        const tape = tapeGenerator && tapeGenerator(x, y, id);        
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
            holding: {[PRESSURE_PLATE_GRAPHIC_JOINT_ID_TAPE]: tape && tape[0]}, 
            handJointId: 0, 
            insertionJointId: PRESSURE_PLATE_GRAPHIC_JOINT_ID_TAPE, 
            activeInputs: {
                reads: {}, 
                states: {}, 
            } , 
            lastCollisions: [0, 0, 0, 0, 0], 
            gravityMultiplier: 0, 
            mass: 0, 
            toSpeak: [], 
            velocity: [0, 0], 
            autoRewind: 1, 
            capabilities: [INSTRUCTION_ID_PLAY, INSTRUCTION_ID_REWIND, INSTRUCTION_ID_FAST_FORWARD, INSTRUCTION_ID_EJECT], 
        }
        return [pressurePlate];
    }
};

