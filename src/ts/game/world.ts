type World = {
    rooms: Room[][];
    currentRoom: Vector;
    size: Vector;
    idFactory: IdFactory;
    age: number;
    previousFrames?: string[];
    player: Player;
    instructionSounds: {[_:number]: Sound};
    lastSaved?: number;
    lastShaken?: number, 
    shakeSound?: Sound, 
};

const createWorld = (audioContext: AudioContext, w: number, h: number, roomFactory: RoomFactory) => {
    // leave some space for persistent ids, start at 99
    let nextId = MAX_PERSISTENT_ID_PLUS_1;
    const idFactory = () => nextId++;
    let player: Player;
    let startX: number;
    let startY: number;
    const rooms = array2DCreate(w, h, (x, y) => {
        const room = roomFactory && roomFactory(x, y, idFactory)
        let found: Entity | MovableEntity;
        const cb = (e: Entity | MovableEntity) => {
            if (e) {
                const ee = e as EveryEntity;
                if (e.entityType == ENTITY_TYPE_PLAYER) {
                    found = e;
                }
                objectIterate(ee.holding, cb);    
            }
        };
        room && room.updatableEntities.forEach(cb);
        if (found) {
            player = found as Player;
            startX = x;
            startY = y;
        }
        return room;
    });
    
    const instructionSounds: {[_:number]: Sound} = {
        //[SOUND_ID_JUMP]: vibratoSoundFactory(audioContext, .5, .1, 1, .2, 'square', 440, 220),  
        //[SOUND_ID_JUMP]: vibratoSoundFactory(audioContext, .2, 0, .1, .05, 'triangle', 500, 2e3, 599),  
        //[SOUND_ID_JUMP]: vibratoSoundFactory(audioContext, .3, 0, .1, .05, 'triangle', 400, 700, 900, 'sine', 60),  
        //[SOUND_ID_THROW]: vibratoSoundFactory(audioContext, .3, 0, .3, .4, 'square', 440, 660, 500),  
        //[SOUND_ID_THROW]: dtmfSoundFactory(audioContext, 697, 1209, .1),  
        [INSTRUCTION_ID_JUMP]: vibratoSoundFactory(audioContext, .3, 0, .2, .05, 'triangle', 499, 699, 399, 'sine', 60),  
        [INSTRUCTION_ID_THROW]: vibratoSoundFactory(audioContext, .2, 0, .2, .05, 'triangle', 499, 2e3, 599),  
        //[INSTRUCTION_ID_DO_NOTHING]: dtmfSoundFactory(audioContext, 350, 440, INSTRUCTION_DURATION), 
        [INSTRUCTION_ID_REWIND]: vibratoSoundFactory(audioContext, .2, 0, .1, .05, 'sine', 1440, 2999, 999, 'sawtooth', 199),
        [INSTRUCTION_ID_FAST_FORWARD]: vibratoSoundFactory(audioContext, .2, 0, .1, .05, 'sine', 2999, 1440, 2000, 'triangle', 199),
        [INSTRUCTION_ID_LEFT]: boomSoundFactory(audioContext, .05, .01, 2e3, .1, .05), 
        [INSTRUCTION_ID_RIGHT]: boomSoundFactory(audioContext, .05, .01, 2e3, .1, .05),  
        [INSTRUCTION_ID_EJECT]: vibratoSoundFactory(audioContext, .2, 0, .2, .05, 'triangle', 299, 2e3, 699),  
        [INSTRUCTION_ID_DROP]: vibratoSoundFactory(audioContext, .2, 0, .2, .05, 'triangle', 199, 2e3, 599),  
        [INSTRUCTION_ID_PICK_UP]: vibratoSoundFactory(audioContext, .2, 0, .2, .05, 'triangle', 699, 2e3, 599),  
        [INSTRUCTION_ID_SHOOT]: boomSoundFactory(audioContext, .3, .01, 399, 1, .5), 
        [INSTRUCTION_ID_STOP]: boomSoundFactory(audioContext, .1, 0, 1e3, .5, .4), 
        [INSTRUCTION_ID_RECORD]: vibratoSoundFactory(audioContext, .3, 0, .2, .05, 'triangle', 799, 1e3, 499, 'sawtooth', 99), 
        [INSTRUCTION_ID_ASSPULL]: vibratoSoundFactory(audioContext, .2, 0, .2, .05, 'triangle', 299, 2e3, 599),   
    };
    // for (let instruction = 0; instruction < 10; instruction++) {
    //     // numeric, use DTMF
    //     instructionSounds[instruction] = dtmfSoundFactory(
    //         audioContext, 
    //         DTMF_FREQUENCIES_1[instruction % DTMF_FREQUENCIES_1.length], 
    //         DTMF_FREQUENCIES_2[(instruction / DTMF_FREQUENCIES_1.length | 0) % DTMF_FREQUENCIES_2.length], 
    //         INSTRUCTION_DURATION, 
    //     );
    // }
    initInstructions(audioContext, instructionSounds);

    const age = parseInt(localStorage.getItem(0 as any) || 0 as any);

    const shakeSound: Sound = FLAG_SHAKE
        ? boomSoundFactory(audioContext, .4, .01, 0, 1, .3)
        : undefined;
        

    const world: World = {
        currentRoom: [startX, startY], 
        size: [w, h], 
        rooms, 
        idFactory, 
        age, 
        player, 
        instructionSounds, 
        //lastShaken: 0, 
        //shakeSound, 
    };
    return world;
}
