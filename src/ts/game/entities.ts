const ORIENTATION_LEFT = 0;
const ORIENTATION_RIGHT = 1;

const COLLISION_GROUP_TERRAIN = 0;
const COLLISION_GROUP_SPIKES = 1;
const COLLISION_GROUP_PUSHABLES = 2;
const COLLISION_GROUP_ITEMS = 3;
const COLLISION_GROUP_PLAYER = 4;
const COLLISION_GROUP_ENEMIES = 5;
const COLLISION_GROUP_BACKGROUNDED = 6;

const COLLISION_MASK_TERRAIN = ~0;
const COLLISION_MASK_SPIKES = ~0;
const COLLISION_MASK_PUSHABLES = 0xFFFF0F;
const COLLISION_MASK_ITEMS = 0x00F0F;
// collides with terrain and pushables
const COLLISION_MASK_PLAYER = 0xAA0F8F;
// collides with terrain, spikes on the bottom, pushables, other enemies and the player on the top/bottom
const COLLISION_MASK_ENEMIES = 0xAA0F8F;
const COLLISION_MASK_BACKGROUNDED = 0;

const EDGE_GRAB = 4;

type Orientation = 0 | 1;

type PassiveAnimation = {
    startTime: number;
    resolve: (worldAge: number) => void;
};

type CommonEntity = {
    id: number;
    entityType: number;
}

type GraphicalEntity = {
    graphic: Graphic;
    palette: HSL[];
    previousAnimationPoseDuration?: number;
    previousPoseId?: number;
    currentPoseId?: number;
    currentAnimationId?: number;
    currentAnimationStartTime?: number;
    passiveAnimations?: Map<number, PassiveAnimation>; 
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
    mass: number;
    ignoreMass?: number | boolean;
    gravityMultiplier: number;
    lastCollisions: [number, number, number, number, number];
    boundsWithVelocity: Rectangle;
    timeRemaining?: number;
    carrier?: MovableEntity;
    carrying?: MovableEntity[];
    carryingPreviously?: MovableEntity[];
    restitution?: number;
    hardnessMultiplier?: 1 | -1;
    strong?: boolean | number;
} & SpatialEntity;

type ActiveMovableEntity = {
    baseVelocity: number;
    inputs: Inputs;
    airTurn?: number | boolean;
    holding: Map<number, MovableEntity>;
    handJointId: number;
    insertionJointId?: number;
} & MovableEntity;

type PlaybackEntity = {
    playing?: number | boolean;
    playbackStartTime?: number;
    nextScriptIndex?: number;
    autoRewind?: number | boolean;
} & MovableEntity;

type ScriptedEntity = {
    nextScriptInstructionTime: number;
} & PlaybackEntity & ActiveMovableEntity;

type OrientableEntity = {
    orientation: Orientation;    
    orientationStartTime: number;
} & SpatialEntity;

type GrabbingEntity = {
    grabbing?: SpatialEntity;
} & ActiveMovableEntity & OrientableEntity;

type SpeakingEntity = {
    // we can only speak at certain intervals to make recording coherent
    toSpeak: number[];
    lastSpoke?: number;
    lastInstructionsSpoken?: number[];
};

type ListeningEntity = {
    instructionsHeard: number[];
    lastHeard?: number;
};

type RecordingEntity = {
    recording?: boolean | number;    
} & ListeningEntity & PlaybackEntity;

type LearningEntity = {
    learnedInstructions: Set<number>;
    lastLearnedAt?: number;
    lastLearnedInstructionId?: number;
};

type MortalEntity = {
    deathAge?: number;
}

type EveryEntity = CommonEntity 
    & GraphicalEntity 
    & ActiveGraphicalEntity 
    & SpatialEntity 
    & MovableEntity 
    & ActiveMovableEntity
    & PlaybackEntity
    & ScriptedEntity
    & OrientableEntity 
    & GrabbingEntity
    & SpeakingEntity
    & ListeningEntity
    & RecordingEntity
    & LearningEntity
    & MortalEntity;

const ENTITY_TYPE_PLAYER = 0; 
type Player = {
    entityType: 0,
    commandsVisible?: boolean | number,
} & CommonEntity & GrabbingEntity & ActiveGraphicalEntity & PlaybackEntity & SpeakingEntity & ListeningEntity & LearningEntity & MortalEntity;

const ENTITY_TYPE_ROBOT = 1; 
type Robot = {
    entityType: 1, 
} & CommonEntity & ActiveMovableEntity & ScriptedEntity & OrientableEntity & ActiveGraphicalEntity & ListeningEntity & MortalEntity;

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
} & CommonEntity & MovableEntity & OrientableEntity & GraphicalEntity;

const ENTITY_TYPE_REPEATER = 6;
type Repeater = {
    entityType: 6, 
} & CommonEntity & ActiveMovableEntity & PlaybackEntity & GraphicalEntity & SpeakingEntity & MortalEntity;

const ENTITY_TYPE_LETHAL = 7;
type Lethal = {
    entityType: 7, 
} & CommonEntity & SpatialEntity & GraphicalEntity;

const ENTITY_TYPE_PRESSURE_PLATE = 8;
type PressurePlate = {
    entityType: 8,     
    edge: Edge, 
} & CommonEntity & ActiveMovableEntity & PlaybackEntity & ActiveGraphicalEntity & SpeakingEntity;

type Entity = Player | Robot | Block | Crate | Brick | Tape | Repeater | Lethal | PressurePlate;

let entitySetVelocity = (room: Room, entity: MovableEntity, v: number, axis: number, timeRemaining: number) => {
    let dv = v - entity.velocity[axis];
    entityAddVelocity(room, entity, dv, axis, timeRemaining);
};

let entityAddVelocity = (room: Room, entity: MovableEntity, dv: number, axis: number, timeRemaining: number, reposition?: number | boolean) => {
    if (reposition) {
        roomRemoveEntityFromTiles(room, entity as Entity)
        let delta = entity.timeRemaining - timeRemaining;
        entity.timeRemaining = timeRemaining;
        axisMap(entity.bounds, entity.velocity, entityUpdatePosition(delta), entity.bounds);
    }
    entity.velocity[axis] += dv;
    [...entity.carryingPreviously, ...entity.carrying].forEach(e => !axis 
        && entityAddVelocity(room, e, dv, axis, timeRemaining, 1)
    );
    reposition && roomAddEntityToTiles(room, entity as Entity);    
};

let entityCalculateBoundsWithVelocity = (entity: Entity) => {
    const movableEntity = entity as MovableEntity;
    if (movableEntity.boundsWithVelocity) {
        const millis = movableEntity.timeRemaining;
        if (millis) {
            axisMap(movableEntity.bounds, movableEntity.velocity, ([s], [v]) => s + Math.min(0, v * millis) - MAX_ROUNDING_ERROR_SIZE, movableEntity.boundsWithVelocity);
            axisMap(movableEntity.bounds, movableEntity.velocity, ([_, l], [v]) => l + Math.abs(v * millis) + MAX_ROUNDING_ERROR_SIZE * 2, movableEntity.boundsWithVelocity, 2);    
        } else {
            movableEntity.boundsWithVelocity = [...movableEntity.bounds] as Rectangle;
        }
    }
}

let entitySetCarrying = (carrier?: SpatialEntity, carrying?: SpatialEntity, isCarrying?: boolean | number) => {
    const movableCarrier = carrier as MovableEntity;
    const movableCarrying = carrying as MovableEntity;
    if (carrier && carrying && movableCarrier.velocity && movableCarrying.velocity) {
        //movableCarrying.velocity[0] = movableCarrier.velocity[0];
        arrayRemoveElement(movableCarrier.carryingPreviously, movableCarrying);
        arrayRemoveElement(movableCarrier.carrying, movableCarrying);
        if (isCarrying) {
            movableCarrier.carrying.push(movableCarrying);
            movableCarrying.carrier = movableCarrier;
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

let entityCalculateMass = (e: MovableEntity): number => {
    return e.mass && [...e.carrying, ...e.carryingPreviously].reduce((totalMass, carried) => totalMass + entityCalculateMass(carried), e.mass) || 0;
}

let entityUpdatePosition = (delta: number) => ([s]: [number], [v]: [number]) => s + v * delta;

let entityUpdatePositionToTimeRemaining = (room: Room, entity: Entity, remainingTime: number) => {
    const movableEntity = entity as MovableEntity;
    if (movableEntity.velocity && movableEntity.timeRemaining > remainingTime) {
        roomRemoveEntityFromTiles(room, entity);
        const delta = movableEntity.timeRemaining - remainingTime;
        movableEntity.timeRemaining = remainingTime;
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
    if (!graphicalEntity.passiveAnimations.has(animationId) && t) {
        if (graphicalEntity.graphic.animations[animationId] != null) {
            graphicalEntity.passiveAnimations.set(animationId, {
                resolve: (worldAge: number) => {
                    const newT = check();
                    if (newT == t) {
                        doit(t, worldAge)
                        entityPlaySound(entity, instructionId, sounds); 
                    }
                }, 
                startTime: worldAge, 
            });    
        } else {
            doit(t, worldAge);
            entityPlaySound(entity, instructionId, sounds); 
        }
    }
} 

let entityPlaySound = (entity: Entity, instruction: number, sounds: {[_: number]: Sound}, saying?: number | boolean) => {
    const sound = sounds[instruction];
    if (sound) {
        if (saying) {
            const speakingEntity = entity as SpeakingEntity;
            speakingEntity.toSpeak.unshift(instruction);
        } else {
            sound((entity as MovableEntity).mass || 1);
        }    
    }
}