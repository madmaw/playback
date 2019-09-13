const ORIENTATION_LEFT = 0;
const ORIENTATION_RIGHT = 1;

const COLLISION_GROUP_SPEECH_BUBBLES = -1;
const COLLISION_GROUP_TERRAIN = 0;
const COLLISION_GROUP_ITEMS = 1;
const COLLISION_GROUP_SPIKES = 2;
const COLLISION_GROUP_PUSHABLES = 3;
const COLLISION_GROUP_PLAYER = 4;
const COLLISION_GROUP_ENEMIES = 5;
const COLLISION_GROUP_BACKGROUNDED = 6;
const COLLISION_GROUP_BULLETS = 7;
 
const COLLISION_MASK_TERRAIN = ~0;
// don't collide with bullets or items or backgrounded
const COLLISION_MASK_SPIKES = 0x22000F;
// don't collide with spikes
const COLLISION_MASK_PUSHABLES = 0xFFFF0FF;
// collides with terrain and pushables
const COLLISION_MASK_ITEMS = 0xF00F;
// collides with terrain and pushables and other players and the bottom of enemies
const COLLISION_MASK_PLAYER = 0x8FF80F;
// collides with terrain, spikes on the bottom, pushables, other enemies on the top and bottom and the player on the top
const COLLISION_MASK_ENEMIES = 0xA2F80F;
const COLLISION_MASK_BACKGROUNDED = 0;
const COLLISION_MASK_BULLETS = 0xF;

const EDGE_GRAB = 4;
//const GRAB_MASK = 1 + 8 + 32;
const GRAB_MASK = 41;
// const BULLET_MASK = 16 + 32;
const BULLET_MASK = 48; // enemies and player

type Orientation = 0 | 1;

type PassiveAnimation = {
    animationStartTime: number;
    notifyComplete: (worldAge: number) => void;
};

type CommonEntity = {
    eid: number;
    entityType: number;
    persistentId?: number;
}

type GraphicalEntity = {
    graphic: Graphic;
    palette: HSL[];
    previousAnimationPoseDuration?: number;
    previousPoseId?: number;
    currentPoseId?: number;
    currentAnimationId?: number;
    currentAnimationStartTime?: number;
    passiveAnimations?: {[_:number]: PassiveAnimation}; 
} & CommonEntity;

type ActiveGraphicalEntity = {
    targetAnimationId?: number;
} & GraphicalEntity;

type SpatialEntity = {
    bounds: Rectangle,
    collisionGroup: number, 
    collisionMask: number, 
} & CommonEntity;

type MovableEntity = {
    velocity: Vector;
    mass?: number;
    ignoreMass?: number | boolean;
    gravityMultiplier: number;
    lastCollisions?: [number, number, number, number, number];
    boundsWithVelocity?: Rectangle;
    remainingTime?: number;
    carrier?: MovableEntity;
    lastCarried?: number;
    carrying?: MovableEntity[];
    carryingPreviously?: MovableEntity[];
    restitution?: number;
    airTurn?: number | boolean;
    crushedEdges?: number;
} & SpatialEntity;

type ActiveMovableEntity = {
    baseVelocity: number;
    adjustedBaseVelocity?: number;    
    activeInputs: Inputs;
    holding: {[_:number]: MovableEntity};
    handJointId?: number;
    insertionJointId?: number;
} & MovableEntity;

type PlaybackEntity = {
    playing?: number | boolean;
    playbackStartTime?: number;
    nextScriptIndex?: number;
    autoRewind?: number | boolean;
    capabilities?: number[];
} & MovableEntity;

type InstructableEntity = {
    nextInstructionTime?: number;
    instructionRepeat?: number;
    rememberedInstruction?: number;
} & PlaybackEntity & ActiveMovableEntity & ListeningEntity;

type OrientableEntity = {
    entityOrientation: Orientation;    
    orientationStartTime: number;
} & SpatialEntity;

type GrabbingEntity = {
    grabbing?: SpatialEntity;
    grabMask: number;
} & ActiveMovableEntity & OrientableEntity;

type SpeakingEntity = {
    // we can only speak at certain intervals to make recording coherent
    toSpeak: number[];
};

type ListeningEntity = {
    instructionsHeard?: number[];
    lastHeard?: number;
    hue?: number;
};

type RecordingEntity = {
    recording?: boolean | number;    
} & ListeningEntity & PlaybackEntity;

type MortalEntity = {
    deathAge?: number;
};

type Asspull = (x: number, y: number, id: () => number) => [Entity];

type AsspullEntity = {
    asspull?: Asspull, 
}

type EveryEntity = CommonEntity 
    & GraphicalEntity 
    & ActiveGraphicalEntity 
    & SpatialEntity 
    & MovableEntity 
    & ActiveMovableEntity
    & PlaybackEntity
    & InstructableEntity
    & OrientableEntity 
    & GrabbingEntity
    & SpeakingEntity
    & ListeningEntity
    & RecordingEntity
    & MortalEntity
    & AsspullEntity;

const ENTITY_TYPE_PLAYER = 0; 
type Player = {
    entityType: 0,
    commandsVisible?: boolean | number,
} & CommonEntity & GrabbingEntity & ActiveGraphicalEntity & PlaybackEntity & ListeningEntity & SpeakingEntity & MortalEntity;

const ENTITY_TYPE_ROBOT = 1; 
type Robot = {
    entityType: 1, 
} & CommonEntity & ActiveMovableEntity & InstructableEntity & OrientableEntity & ActiveGraphicalEntity & ListeningEntity & MortalEntity & AsspullEntity;

const ENTITY_TYPE_BLOCK = 2; 
type Block = {
    entityType: 2,
} & CommonEntity & SpatialEntity & GraphicalEntity;

const ENTITY_TYPE_CRATE = 3;
type Crate = {
    entityType: 3, 
} & CommonEntity & MovableEntity & GraphicalEntity;

const ENTITY_TYPE_BRICK = 4;
type Brick = {
    entityType: 4, 
} & CommonEntity & MovableEntity & OrientableEntity;

const ENTITY_TYPE_TAPE = 5;
type Tape = {
    entityType: 5; 
    script: number[];
    hue: number;
} & CommonEntity & MovableEntity & OrientableEntity & GraphicalEntity;

const ENTITY_TYPE_REPEATER = 6;
type Repeater = {
    entityType: 6, 
} & CommonEntity & ActiveMovableEntity & InstructableEntity & PlaybackEntity & GraphicalEntity & SpeakingEntity & MortalEntity;

const ENTITY_TYPE_LETHAL = 7;
type Lethal = {
    entityType: 7, 
} & CommonEntity & SpatialEntity & GraphicalEntity;

const ENTITY_TYPE_PRESSURE_PLATE = 8;
type PressurePlate = {
    entityType: 8,     
    pressureEdge: Edge, 
} & CommonEntity & ActiveMovableEntity & PlaybackEntity & ActiveGraphicalEntity & SpeakingEntity;

const ENTITY_TYPE_PLATFORM = 9;
type Platform = {
    entityType: 9, 
    direction: Edge, 
} & CommonEntity & ActiveMovableEntity & InstructableEntity & ActiveGraphicalEntity & ListeningEntity;

const ENTITY_TYPE_SPEECH_BUBBLE = 10;
type SpeechBubble = {
    entityType: 10, 
    instruction: number, 
    hue: number, 
    spokenAge: number, 
    collisionGroup: -1, // collision group speech bubbles
} & CommonEntity & MovableEntity & MortalEntity;

const ENTITY_TYPE_GUN = 11;
type Gun = {
    entityType: 11, 
    lastFired: number, 
    fireRate: number, 
} & CommonEntity & MovableEntity & OrientableEntity & GraphicalEntity; 

const ENTITY_TYPE_BULLET = 12;
type Bullet = {
    entityType: 12, 
} & CommonEntity & MovableEntity & GraphicalEntity & OrientableEntity;

const ENTITY_TYPE_SCENERY = 13;
type Scenery = {
    entityType: 13, 
    text: string, 
} & CommonEntity & SpatialEntity;

type Entity = Player | Robot | Block | Crate | Brick | Tape | Repeater | Lethal | PressurePlate | Platform | SpeechBubble | Gun | Bullet | Scenery;

let entitySetVelocity = (room: Room, entity: MovableEntity, v: number, axis: number, timeRemaining: number) => {
    let dv = v - entity.velocity[axis];
    entityAddVelocity(room, entity, dv, axis, timeRemaining);
};

let entityAddVelocity = (room: Room, entity: MovableEntity, dv: number, axis: number, timeRemaining: number, reposition?: number | boolean) => {
    if (reposition) {
        roomRemoveEntityFromTiles(room, entity as Entity)
        let delta = entity.remainingTime - timeRemaining;
        entity.remainingTime = timeRemaining;
        axisMap(entity.bounds, entity.velocity, entityUpdatePosition(delta), entity.bounds);
    }
    entity.velocity[axis] += dv;
    [...entity.carryingPreviously, ...entity.carrying].forEach(
        e => !axis && entityAddVelocity(room, e, dv, axis, timeRemaining, 1)
    );
    reposition && roomAddEntityToTiles(room, entity as Entity);    
};

let entityCalculateBoundsWithVelocity = (entity: Entity) => {
    const movableEntity = entity as MovableEntity;
    if (movableEntity.boundsWithVelocity) {
        const millis = movableEntity.remainingTime;
        if (millis) {
            axisMap(movableEntity.bounds, movableEntity.velocity, ([s], [v]) => s + Math.min(0, v * millis) - MAX_ROUNDING_ERROR_SIZE, movableEntity.boundsWithVelocity);
            axisMap(movableEntity.bounds, movableEntity.velocity, ([_, l], [v]) => l + Math.abs(v * millis) + MAX_ROUNDING_ERROR_SIZE * 2, movableEntity.boundsWithVelocity, 2);    
        } else {
            movableEntity.boundsWithVelocity = [...movableEntity.bounds] as Rectangle;
        }
    }
}

let entitySetCarrying = (carrier?: SpatialEntity, carrying?: SpatialEntity, isCarryingAndWorldAge?: number) => {
    const movableCarrier = carrier as MovableEntity;
    const movableCarrying = carrying as MovableEntity;
    if (carrier && carrying && movableCarrier.velocity && movableCarrying.velocity) {
        //movableCarrying.velocity[0] = movableCarrier.velocity[0];
        arrayRemoveElement(movableCarrier.carryingPreviously, movableCarrying);
        arrayRemoveElement(movableCarrier.carrying, movableCarrying);
        if (isCarryingAndWorldAge) {
            movableCarrier.carrying.push(movableCarrying);
            movableCarrying.carrier = movableCarrier;
            movableCarrying.lastCarried = isCarryingAndWorldAge;
            if (FLAG_CHECK_CIRCULAR_CARRYING) {
                let c = carrier;
                while (c) {
                    if (c == carrying) {
                        console.log("circular carrying");
                    }
                    c = (c as MovableEntity).carrier;
                }
            }
        } else if (movableCarrying.carrier == movableCarrier) {
            movableCarrying.carrier = undefined;
        }
    }
}

let entityCalculateMass = (e: MovableEntity, includeZeroMass?: number | boolean): number => {
    return (e.mass || includeZeroMass) && [...e.carrying, ...e.carryingPreviously].reduce((totalMass, carried) => totalMass + entityCalculateMass(carried), e.mass) || 0;
}

let entityUpdatePosition = (delta: number) => ([s]: [number], [v]: [number]) => s + v * delta;

let entityUpdatePositionToTimeRemaining = (room: Room, entity: Entity, remainingTime: number) => {
    const movableEntity = entity as MovableEntity;
    if (movableEntity.velocity && movableEntity.remainingTime > remainingTime) {
        roomRemoveEntityFromTiles(room, entity);
        const delta = movableEntity.remainingTime - remainingTime;
        movableEntity.remainingTime = remainingTime;
        axisMap(movableEntity.bounds, movableEntity.velocity, entityUpdatePosition(delta), movableEntity.bounds);
        roomAddEntityToTiles(room, entity);
    }
};

let entityAddPassiveAnimation = <T>(
    entity: Entity, 
    instructionId: number, 
    sounds: {[_: number]: Sound}, 
    worldAge: number, 
    check: () => T, 
    doit: (t: T, worldAge) => void 
) => {
    const graphicalEntity = entity as GraphicalEntity;
    const animationId = INSTRUCTION_TO_ANIMATION_IDS[instructionId];
    const t = check();
    if (!graphicalEntity.passiveAnimations[animationId] && t) {
        if (graphicalEntity.graphic.animations[animationId] != null) {
            graphicalEntity.passiveAnimations[animationId] = {
                notifyComplete: (worldAge: number) => {
                    const newT = check();
                    if (newT == t) {
                        doit(t, worldAge)
                        entityPlaySound(entity, instructionId, sounds); 
                    }
                }, 
                animationStartTime: worldAge, 
            };    
        } else {
            doit(t, worldAge);
            entityPlaySound(entity, instructionId, sounds); 
        }
    }
} 

let entityPlaySound = (entity: Entity, instruction: number, sounds: {[_: number]: Sound}, saying?: number | boolean) => {
    if (saying) {
        const speakingEntity = entity as SpeakingEntity;
        speakingEntity.toSpeak.unshift(instruction);
    } else {
        const sound = sounds[instruction];
        if (sound) {
            sound();
        }
    }    
}
