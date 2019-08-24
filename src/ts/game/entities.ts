const ORIENTATION_LEFT = 0;
const ORIENTATION_RIGHT = 1;

const COLLISION_GROUP_TERRAIN = 0;
const COLLISION_GROUP_ITEMS = 1;
const COLLISION_GROUP_PLAYER = 2;
const COLLISION_GROUP_ENEMIES = 3;

const EDGE_GRAB = 4;

type Orientation = 0 | 1;

type Collision = {
    time: number, 
    entity?: SpatialEntity, 
}

type CommonEntity = {
    id: number;
    entityType: number;
}

type GraphicalEntity = {
    graphic: Graphic;
    previousAnimationPoseDuration?: number;
    previousPoseId?: number;
    currentPoseId?: number;
    currentAnimationId?: number;
    currentAnimationStartTime?: number;
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
} & SpatialEntity;

type ActiveMovableEntity = {
    baseVelocity: number;
    inputs: Inputs;
    airTurn?: number | boolean;
    holding: Map<number, MovableEntity>;
    handJointId: number;
} & MovableEntity;

type ScriptedEntity = {
    script: Instruction[];
    nextScriptIndex: number;
    nextScriptInstructionTime: number;
};

type ItemEntity = {
    heldBy?: SpatialEntity;
}

type OrientableEntity = {
    orientation: Orientation;    
    orientationStartTime: number;
} & SpatialEntity;

type GrabbingEntity = {
    grabbing?: SpatialEntity;
} & ActiveMovableEntity & OrientableEntity;

const ENTITY_TYPE_PLAYER = 0; 
type Player = {
    entityType: 0,
} & CommonEntity & GrabbingEntity & ActiveGraphicalEntity;

const ENTITY_TYPE_ROBOT = 1; 
type Robot = {
    entityType: 1, 
} & CommonEntity & ActiveMovableEntity & ScriptedEntity & OrientableEntity & ActiveGraphicalEntity;

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
} & CommonEntity & MovableEntity & ItemEntity & OrientableEntity;

const ENTITY_TYPE_TAPE = 5;
type Tape = {
    entityType: 5; 
    script: Instruction[];
} & CommonEntity & MovableEntity & ItemEntity & OrientableEntity & GraphicalEntity;

type Entity = Player | Robot | Block | Crate | Brick | Tape;

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
    [...entity.carryingPreviously, ...entity.carrying].forEach(e => (!axis || (e as ItemEntity).heldBy) 
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