///<reference path="../flags.ts"/>

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
const INSTRUCTION_ID_SAY = 16;
const INSTRUCTION_ID_OPEN = 17;
const INSTRUCTION_ID_REWIND = 18;
const INSTRUCTION_ID_FAST_FORWARD = 19;
const INSTRUCTION_ID_STOP = 20;
const INSTRUCTION_ID_PICK_UP = 21;
const INSTRUCTION_ID_DROP = 22;
const INSTRUCTION_ID_THROW = 23;
const INSTRUCTION_ID_INSERT = 24;
const INSTRUCTION_ID_EJECT = 25;
const INSTRUCTION_ID_PLAY = 26;
const INSTRUCTION_ID_RECORD = 27;
const INSTRUCTION_ID_HELP = 28;
const INSTRUCTION_ID_SAVE = 29
const TOTAL_INSTRUCTION_COUNT = 30;

type Instruction = {
    keyCodes?: number[], 
    keyChar?: string, 
    name?: string, 
    animationId?: number, 
    hold?: number | boolean, 
    utterance?: Sound, 
};

const INSTRUCTIONS: Instruction[] = [{ 
    // count 0
    keyCodes: [48], // 0 
}, {    
    // count 1
    keyCodes: [49], // 1
}, {
    // count 2
    keyCodes: [50], // 2
}, {
    // count 3
    keyCodes: [51], // 3
}, {
    // count 4
    keyCodes: [52], // 4
}, {
    // count 5
    keyCodes: [53], // 5
}, {
    // count 6
    keyCodes: [54], // 6
}, {
    // count 7
    keyCodes: [55], // 7
}, {
    // count 8
    keyCodes: [56], // 8
}, {
    // count 9
    keyCodes: [57], // 9
}, {
    // do nothing
    name: FLAG_EMOJIS ? '🔑' : 'unlock', 
}, {
    // up
    keyCodes: [87, 38], // w, up arrow
    name: FLAG_EMOJIS ? '⬆️' : 'up', 
}, { 
    // down
    keyCodes: [83, 40], // s, down arrow 
    name: FLAG_EMOJIS ? '⬇️' : 'down', 
    hold: 1, 
}, {
    // left
    keyCodes: [65, 37], // a, left arrow
    name: FLAG_EMOJIS ? '⬅️' : 'left', 
    animationId: ANIMATION_ID_WALKING,
    hold: 1,  
}, {
    // right
    keyCodes: [68, 39], // d, right arrow 
    name: FLAG_EMOJIS ? '➡️' : 'right', 
    animationId: ANIMATION_ID_WALKING, 
    hold: 1, 
}, {
    // jump
    keyCodes: [74, 32], // j, space
    name: FLAG_EMOJIS ? '🐇' : 'jump', 
}, {
    // say
    name: FLAG_EMOJIS ? '🗣️' : 'say', 
}, {
    // open
    name: FLAG_EMOJIS ? '🔓' : 'open', 
}, {
    // rewind
    keyCodes: [188], // ,<
    keyChar: '>', 
    name: FLAG_EMOJIS ? '⏪' : 'rewind',
    animationId: ANIMATION_ID_PRESSING_BUTTON,  
    hold: 1, 
}, {
    // fast forward
    keyCodes: [190], // .>
    keyChar: '<', 
    name: FLAG_EMOJIS ? '⏩' : 'fast forward', 
    animationId: ANIMATION_ID_PRESSING_BUTTON,  
    hold: 1, 
}, {
    // stop
    name: FLAG_EMOJIS ? '⏹' : 'stop', 
}, {
    // pick up 
    keyCodes: [80], // p
    name: FLAG_EMOJIS ? '⇡' : 'pick up', 
    animationId: ANIMATION_ID_PICKING_UP,  
}, {
    // drop
    keyCodes: [76], // l
    name: FLAG_EMOJIS ? '⇣' : 'drop', 
    animationId: ANIMATION_ID_DROPPING,  
}, {
    // throw
    keyCodes: [84], // t
    name: FLAG_EMOJIS ? '🏹' : 'throw', 
    animationId: ANIMATION_ID_THROWING,  
}, {
    // insert
    keyCodes: [73], // i
    name: FLAG_EMOJIS ? '📩' : 'insert', 
    animationId: ANIMATION_ID_INSERTING, 
}, {
    // eject
    keyCodes: [75], // k
    name: FLAG_EMOJIS ? '⏏️' : 'eject',  
}, {
    // play
    keyCodes: [77], // m 
    name: FLAG_EMOJIS ? '▶' : 'play', 
    animationId: ANIMATION_ID_PRESSING_BUTTON,  
}, {
    // record
    keyCodes: [82], // r
    name: FLAG_EMOJIS ? '⏺️' : 'record', 
    hold: 1, 
}, {
    // help
    keyCodes: [72], // h
    name: FLAG_EMOJIS ? '📖' : 'help', 
}, {
    // save world (intentionally left blank
    name: FLAG_EMOJIS ? '💾' : 'save',
}];

const INPUT_KEY_CODE_MAPPINGS: {[_: number]: number } = {};
const INSTRUCTION_TO_ANIMATION_IDS: {[_: number]: number} = {};
const initInstructions = (audioContext: AudioContext, sounds: {[_:number]: Sound}) => {
    INSTRUCTIONS.forEach((instruction, id) => {
        instruction.keyCodes && instruction.keyCodes.forEach(keyCode => INPUT_KEY_CODE_MAPPINGS[keyCode] = id);
        INSTRUCTION_TO_ANIMATION_IDS[id] = instruction.animationId;
        if (FLAG_SPEECH_SYNTHESIS && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(instructionToName(id))
            utterance.volume = .2;
            instruction.utterance = () => {
                window.speechSynthesis.speak(utterance);
            };
        } else if (FLAG_LOCAL_SPEECH_SYNTHESIS) {
            instruction.utterance = synthesizeSpeech(audioContext, instructionToName(id), .1);
        } else {
            instruction.utterance = sounds[id] || (() => 0);
        }    
    });   
}

const instructionToName = (instructionId: number) => {
    const i = INSTRUCTIONS[instructionId];
    return i.name || instructionToKey(i);
};

const instructionToUtterance = (instructionId: number) => {
    const instruction = INSTRUCTIONS[instructionId];
    return instruction.utterance;
};

const instructionToKey = (i: Instruction) => i.keyChar ||  String.fromCharCode(i.keyCodes[0]);

/*
const INPUT_KEY_CODE_MAPPINGS = {
    // w
    87: INSTRUCTION_ID_UP, 
    // a 
    65: INSTRUCTION_ID_LEFT, 
    // d
    68: INSTRUCTION_ID_RIGHT, 
    // s
    83: INSTRUCTION_ID_DOWN, 
    // left arrow
    37: INSTRUCTION_ID_LEFT, 
    // right arrow
    39: INSTRUCTION_ID_RIGHT, 
    // up arrow
    38: INSTRUCTION_ID_UP, 
    // down arrow
    40: INSTRUCTION_ID_DOWN, 
    // j
    74: INSTRUCTION_ID_JUMP, 
    // space
    32: INSTRUCTION_ID_JUMP, 
    // p
    80: INSTRUCTION_ID_PICK_UP,
    // l
    76: INSTRUCTION_ID_DROP, 
    // t
    84: INSTRUCTION_ID_THROW, 
    // i
    73: INSTRUCTION_ID_INSERT, 
    // k
    75: INSTRUCTION_ID_EJECT, 
    // m
    77: INSTRUCTION_ID_PLAY, 
};
*/

type Inputs = {
    states: {[_:number]: number}, 
    reads: {[_:number]: number}, 
};

let readInput = (entity: Entity, input: number, now: number) => {
    const inputs = (entity as ActiveMovableEntity).inputs;
    const learnedInputs = (entity as LearningEntity).learnedInstructions;
    const hold = INSTRUCTIONS[input].hold;
    const value = inputs.states[input];
    const lastRead = (inputs.reads[input] || 0);
    if ((!learnedInputs || learnedInputs.has(input)) && value && (hold || lastRead < value)) {
        inputs.reads[input] = now;
        return 1;
    } else {
        return 0;
    }
}

let doRepeatingInput = (entity: Entity, input: number, now: number, delta: number, interval?: number) => {
    const inputs = (entity as ActiveMovableEntity).inputs;
    if (!interval) {
        const graphic = (entity as GraphicalEntity).graphic;
        const animationId = INSTRUCTION_TO_ANIMATION_IDS[input];
        const animation = graphic.animations[animationId];
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