const MAX_TILES_ACROSS = 18;
const MAX_TILES_DOWN = 13;
const MAX_TILES_ACROSS_MINUS_1 = 17;
const MAX_TILES_DOWN_MINUS_1 = 12;
const DEFAULT_GRAVITY: Vector = [0, 7e-5]; //[0, .00007];
const BASE_VELOCITY = .006;
const JUMP_VELOCITY = .014;
const CLIMB_VELOCITY = .011;
const MAX_VELOCITY = .015;
const MAX_JUMP_AGE = 99;
const TURN_DURATION = 150;
const SCALING_JUMP = 1;
const ACTIVE_ROOM_SPREAD_HORIZONTAL = 1;
const ACTIVE_ROOM_SPREAD_VERTICAL = 1;
const GRAB_DIMENSION = .15;
const GRAB_DIMENSION_X_2 = .3;
const GRAB_VELOCITY_SCALE = .9;
const MAX_DELTA = Math.floor(GRAB_DIMENSION_X_2/MAX_VELOCITY) - 1; // 19 ms
const MIN_DELTA = 5;
const MAX_ROUNDING_ERROR_SIZE = 1e-6;//.000001;
const MAX_COLLISION_COUNT = 2;
const AUTOMATIC_ANIMATION_DELAY = 40;
const GRAB_OFFSET = .01;
const THROW_POWER = .04;
const EJECT_VELOCITY = .01;  
const INSTRUCTION_DURATION = .3;
const DTMF_FREQUENCIES_1 = [1209, 1336, 1477];
const DTMF_FREQUENCIES_2 = [697, 770, 852, 941, 1038, 1131];
const PLAYBACK_INTERVAL = 999;
const BULLET_INTERVAL = 199;
const REWIND_INTERVAL = 199;
const SPEECH_FADE_INTERVAL = PLAYBACK_INTERVAL * 2;
const SPEECH_TEXT_HEIGHT = 1;
const SPEECH_TEXT_SCALE = .5;
const SPEECH_TEXT_PADDING = .2;
const SPEECH_CALLOUT_HEIGHT = .2;
const SPEECH_CALLOUT_WIDTH = .2;
const MAX_VISIBLE_INSTRUCTIONS = 1;
const MESSAGE_DISPLAY_TIME = 2999;
const MAX_DEATH_AGE = 999;
const BULLET_WIDTH = .3;
const BULLET_HEIGHT = .1;
const SOUND_WAVE_STEP_TIME = 40;
const SOUND_WAVE_DISPLAY_TIME = 99;
const MATH_PI = 3.14;
const MATH_PI_2 = 6.28;
const MATH_PI_ON_2 = 1.57;
const LOW_P_MATH_PI = 3;
const LOW_P_MATH_PI_2 = 6;
const LOW_P_MATH_PI_ON_2 = 1.6;