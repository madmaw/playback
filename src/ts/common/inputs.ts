///<reference path="../flags.ts"/>
///<reference path="../constants.ts"/>

const INSTRUCTION_ID_COUNT_0 = 0
const INSTRUCTION_ID_COUNT_1 = 1;
const INSTRUCTION_ID_COUNT_2 = 2;
const INSTRUCTION_ID_COUNT_3 = 3;
const INSTRUCTION_ID_COUNT_4 = 4;
const INSTRUCTION_ID_COUNT_5 = 5;
const INSTRUCTION_ID_COUNT_6 = 6;
const INSTRUCTION_ID_COUNT_7 = 7;
const INSTRUCTION_ID_COUNT_8 = 8;
const INSTRUCTION_ID_COUNT_9 = 9;
const INSTRUCTION_ID_DO_NOTHING = 10
const INSTRUCTION_ID_UP = 11;
const INSTRUCTION_ID_DOWN = 12;
const INSTRUCTION_ID_LEFT = 13;
const INSTRUCTION_ID_RIGHT = 14;
const INSTRUCTION_ID_JUMP = 15;
const INSTRUCTION_ID_REWIND = 16;
const INSTRUCTION_ID_FAST_FORWARD = 17;
const INSTRUCTION_ID_STOP = 18;
const INSTRUCTION_ID_PICK_UP = 19;
const INSTRUCTION_ID_DROP = 20;
const INSTRUCTION_ID_THROW = 21;
const INSTRUCTION_ID_INSERT = 22;
const INSTRUCTION_ID_EJECT = 23;
const INSTRUCTION_ID_PLAY = 24;
const INSTRUCTION_ID_RECORD = 25;
const INSTRUCTION_ID_SAVE = 26;
const INSTRUCTION_ID_SHOOT = 27;
const INSTRUCTION_ID_WAIT = 28;
const INSTRUCTION_ID_ASSPULL = 29;
const TOTAL_INSTRUCTION_COUNT = 29;

type Instruction = {
    keyCodes?: number[], 
    keyChar?: string, 
    readableName?: string, 
    phoneticName?: string, 
    animationId?: number, 
    hold?: number | boolean, 
    remember?: number | boolean, 
    spoken?: Sound, 
    automatedDuration?: number, 
};

const INSTRUCTIONS: Instruction[] = [{ 
    // count 0
    keyCodes: [48], // 0 
    phoneticName: 'o',
}, {    
    // count 1
    keyCodes: [49], // 1
    phoneticName: 'un', 
}, {
    // count 2
    keyCodes: [50], // 2, 
    phoneticName: 'to', 
}, {
    // count 3
    keyCodes: [51], // 3
    phoneticName: 'tre', 
}, {
    // count 4
    keyCodes: [52], // 4
    phoneticName: 'or', 
}, {
    // count 5
    keyCodes: [53], // 5
    phoneticName: 'fi', 
}, {
    // count 6
    keyCodes: [54], // 6
    phoneticName: 'si', 
}, {
    // count 7
    keyCodes: [55], // 7
    phoneticName: 'sen', 
}, {
    // count 8
    keyCodes: [56], // 8
    phoneticName: 'at', 
}, {
    // count 9
    keyCodes: [57], // 9
    phoneticName: 'ni', 
}, {
    // noop / do nothing
}, {
    // up
    keyCodes: [87, 38], // w, up arrow
    readableName: FLAG_EMOJIS ? '⬆️' : 'up', 
    hold: 1, 
}, { 
    // down
    keyCodes: [83, 40], // s, down arrow 
    readableName: FLAG_EMOJIS ? '⬇️' : 'down', 
    hold: 1, 
}, {
    // left
    keyCodes: [65, 37], // a, left arrow
    readableName: FLAG_EMOJIS ? '⬅️' : 'left', 
    animationId: ANIMATION_ID_WALKING,
    hold: 1,  
}, {
    // right
    keyCodes: [68, 39], // d, right arrow 
    readableName: FLAG_EMOJIS ? '➡️' : 'right', 
    animationId: ANIMATION_ID_WALKING, 
    hold: 1, 
}, {
    // jump
    keyCodes: [74, 32], // j, space
    //readableName: FLAG_EMOJIS ? '🐇' : 'jump', 
}, {
    // rewind
    keyCodes: [219], // [
    //keyChar: '[', 
    //readableName: FLAG_EMOJIS ? '⏪' : 'rewind',
    animationId: ANIMATION_ID_PRESSING_BUTTON,  
    hold: 1, 
    automatedDuration: REWIND_INTERVAL, 
}, {
    // fast forward
    keyCodes: [221], // ]
    //keyChar: ']', 
    //readableName: FLAG_EMOJIS ? '⏩' : 'fast forward', 
    animationId: ANIMATION_ID_PRESSING_BUTTON,  
    hold: 1, 
    automatedDuration: REWIND_INTERVAL, 
}, {
    // stop
    //readableName: FLAG_EMOJIS ? '⏹' : 'stop', 
}, {
    // pick up / get
    keyCodes: [71], // g
    //readableName: FLAG_EMOJIS ? '⇡' : 'pick up', 
    animationId: ANIMATION_ID_PICKING_UP,  
}, {
    // drop
    keyCodes: [66], // b
    readableName: FLAG_EMOJIS ? '⇣' : 'drop', 
    animationId: ANIMATION_ID_DROPPING,  
}, {
    // throw
    keyCodes: [84], // t
    //readableName: FLAG_EMOJIS ? '🏹' : 'throw', 
    animationId: ANIMATION_ID_THROWING,  
}, {
    // insert
    keyCodes: [73], // i
    readableName: FLAG_EMOJIS ? '📩' : 'insert', 
    animationId: ANIMATION_ID_INSERTING, 
}, {
    // eject
    keyCodes: [75], // k
    readableName: FLAG_EMOJIS ? '⏏️' : 'eject',  
}, {
    // play
    keyCodes: [80], // p
    //readableName: FLAG_EMOJIS ? '▶' : 'play', 
    animationId: ANIMATION_ID_PRESSING_BUTTON,  
    hold: 1, 
    remember: 1, 
    automatedDuration: PLAYBACK_INTERVAL, 
}, {
    // record
    keyCodes: [82], // r
    //readableName: FLAG_EMOJIS ? '⏺️' : 'record', 
    hold: 1, 
    automatedDuration: PLAYBACK_INTERVAL, 
}, {
    // save world 
    readableName: FLAG_EMOJIS ? '💾' : 'save',
    animationId: ANIMATION_ID_SAVING, 
}, {
    // shoot
    readableName: FLAG_EMOJIS ? '🔫' : 'fire', 
    keyCodes: [13], // enter
    hold: 1, 
    automatedDuration: BULLET_INTERVAL, 
}, {
    // wait
    //readableName: FLAG_EMOJIS ? '⌛' : 'wait',
    automatedDuration: 999, 
}, {
    // ass pull    
}/*, {
    // help
    keyCodes: [72], // h
    readableName: FLAG_EMOJIS ? '📖' : 'help', 
}*/];

const INPUT_KEY_CODE_MAPPINGS: {[_: number]: number } = {};
const INSTRUCTION_TO_ANIMATION_IDS: {[_: number]: number} = {};
const initInstructions = (audioContext: AudioContext, sounds: {[_:number]: Sound}) => {
    INSTRUCTIONS.forEach((instruction, id) => {
        instruction.keyCodes && instruction.keyCodes.forEach(keyCode => INPUT_KEY_CODE_MAPPINGS[keyCode] = id);
        INSTRUCTION_TO_ANIMATION_IDS[id] = instruction.animationId;
        if (FLAG_NATIVE_SPEECH_SYNTHESIS && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(instructionToName(id))
            utterance.volume = .2;
            instruction.spoken = () => {
                window.speechSynthesis.speak(utterance);
            };
        } else if (FLAG_LOCAL_SPEECH_SYNTHESIS) {
            const name = INSTRUCTIONS[id].phoneticName || instructionToName(id);
            instruction.spoken = name && synthesizeSpeech(audioContext, name, .01) || sounds[id];
        } else if (FLAG_TONAL_SPEECH_SYNTHESIS) {
            instruction.spoken = dtmfSoundFactory(audioContext, 
                DTMF_FREQUENCIES_1[id % DTMF_FREQUENCIES_1.length], 
                DTMF_FREQUENCIES_2[(id / DTMF_FREQUENCIES_1.length | 0) % DTMF_FREQUENCIES_2.length], 
                INSTRUCTION_DURATION, 
            );
        } else {
            instruction.spoken = sounds[id] || (() => 0);
        }    
    });   
}

const instructionToName = (instructionId: number) => {
    const i = INSTRUCTIONS[instructionId];
    return i.readableName || instructionToKey(i);
};

const instructionToUtterance = (instructionId: number) => {
    const instruction = INSTRUCTIONS[instructionId];
    return instruction.spoken;
};

const instructionToKey = (i: Instruction) => i.keyChar ||  i.keyCodes && String.fromCharCode(i.keyCodes[0]);


type Inputs = {
    states?: {[_:number]: number}, 
    reads?: {[_:number]: number}, 
};

let setInput = (entity: Entity, input: number, now: number) => {
    const everyEntity = entity as EveryEntity;
    const ir = everyEntity.instructionRepeat || 1;
    everyEntity.instructionRepeat = 0;
    everyEntity.activeInputs.states[input] = now;
    return ir;
}

let setRead = (entity: Entity, input: number, now: number) => {
    const everyEntity = entity as EveryEntity;
    const inputs = everyEntity.activeInputs;
    const value = inputs.states[input];
    const lastRead = (inputs.reads[input] || 0);
    if (lastRead < value) {
        inputs.reads[input] = now;
        return 1;
    }
}

let readInput = (entity: Entity, input: number, now: number) => {
    const everyEntity = entity as EveryEntity;
    const inputs = everyEntity.activeInputs;
    const hold = INSTRUCTIONS[input].hold;
    const value = inputs.states[input];
    const lastRead = (inputs.reads[input] || 0);
    if ((!everyEntity.capabilities || everyEntity.capabilities.indexOf(input) >= 0) && value && lastRead < value) {
        if (!hold) {
            inputs.reads[input] = now;
        }
        return 1;
    } else {
        return 0;
    }
}

let doRepeatingInput = (entity: Entity, input: number, now: number, delta: number, interval?: number) => {
    const everyEntity = entity as EveryEntity;
    const inputs = everyEntity.activeInputs;
    if (!everyEntity.capabilities || everyEntity.capabilities.indexOf(input) >= 0) {
        if (!interval) {
            const graphic = everyEntity.graphic;
            const animationId = INSTRUCTION_TO_ANIMATION_IDS[input];
            const animation = graphic.animations && graphic.animations[animationId];
            if (animation) {
                interval = animation.poseDuration;
            }
        }
        if (interval) {
            const value = inputs.states[input];
            const diff = now - value;
            return ((diff/interval | 0) != ((diff + delta)/interval | 0));    
        }    
    }
}