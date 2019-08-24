const INSTRUCTION_COUNT_0 = 0
const INSTRUCTION_COUNT_1 = 1;
const INSTRUCTION_COUNT_2 = 2;
const INSTRUCTION_COUNT_3 = 3;
const INSTRUCTION_COUNT_4 = 4;
const INSTRUCTION_COUNT_5 = 5;
const INSTRUCTION_COUNT_6 = 6;
const INSTRUCTION_COUNT_7 = 7;
const INSTRUCTION_COUNT_8 = 8;
const INSTRUCTION_COUNT_9 = 9;
const INSTRUCTION_UP = 10;
const INSTRUCTION_DOWN = 11;
const INSTRUCTION_LEFT = 12;
const INSTRUCTION_RIGHT = 13;
const INSTRUCTION_JUMP = 14;
const INSTRUCTION_SAY = 15;
const INSTRUCTION_OPEN = 16;
const INSTRUCTION_REWIND = 17;
const INSTRUCTION_FAST_FORWARD = 18;
const INSTRUCTION_STOP = 19;
const INSTRUCTION_PICK_UP = 20;
const INSTRUCTION_DROP = 21;
const INSTRUCTION_THROW = 22;


type Instruction = 0 | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22;

const INPUT_KEY_CODE_MAPPINGS = {
    // w
    87: INSTRUCTION_UP, 
    // a 
    65: INSTRUCTION_LEFT, 
    // d
    68: INSTRUCTION_RIGHT, 
    // s
    83: INSTRUCTION_DOWN, 
    // left arrow
    37: INSTRUCTION_LEFT, 
    // right arrow
    39: INSTRUCTION_RIGHT, 
    // up arrow
    38: INSTRUCTION_UP, 
    // down arrow
    40: INSTRUCTION_DOWN, 
    // space
    32: INSTRUCTION_JUMP, 
    // j
    74: INSTRUCTION_JUMP, 
    // p
    80: INSTRUCTION_PICK_UP,
    // l
    76: INSTRUCTION_DROP, 
    // t
    84: INSTRUCTION_THROW, 
};

type Inputs = {
    states: {[_:number]: number}, 
    reads: {[_:number]: number}, 
};

let readInput = (inputs: Inputs, input: number, now: number, excludeOld?: boolean | number) => {
    const value = inputs.states[input];
    const lastRead = (inputs.reads[input] || 0);
    if (value && (!excludeOld || lastRead < value)) {
        inputs.reads[input] = now;
        return 1;
    } else {
        return 0;
    }
}