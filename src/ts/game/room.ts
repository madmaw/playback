type SoundWave = {
    tileReachability: number[][];
    hue: number;
    timeSaid: number;
}

type Room = {
    allEntities: Entity[];
    updatableEntities: Entity[];
    tiles: Entity[][][]; 
    bounds: Rectangle;
    gravity: Vector;
    recorder?: RecordingEntity;
    soundWaves: SoundWave[];
    bg: HSL[], 
}

type IdFactory = () => number;

type RoomFactory = (x: number, y: number, id: IdFactory) => Room;

let roomIterateEntities = (room: Room, bounds: Rectangle | undefined, i: (entity: Entity) => void, useBoundsWithVelocity?: number | boolean) => {
    const handled = new Set<number>();
    roomIterateBounds(room, bounds, tile => tile.forEach(e => {
        if (!handled.has(e.eid) && rectangleOverlap(useBoundsWithVelocity && (e as MovableEntity).boundsWithVelocity || (e as MovableEntity).bounds, bounds)) {
            i(e);
            handled.add(e.eid);
        }
    }));
}

let roomIterateBounds = (room: Room, bounds: Rectangle | undefined, i: (tile: Entity[], tx: number, ty: number) => void) => {
    rectangleIterateBounds(bounds, room.bounds, (tx, ty) => {
        i(room.tiles[tx][ty], tx, ty);
    })
}

let roomAddEntity = (room: Room, entity: Entity, deltas?: Vector) => {
    const everyEntity = entity as EveryEntity;
    if (deltas) {
        axisMap(deltas, everyEntity.bounds, ([d], [v]) => v + d, everyEntity.bounds);
    }
    room.allEntities.push(entity);        
    if(everyEntity.velocity) {
        room.updatableEntities.push(entity);
    }
    roomAddEntityToTiles(room, entity);
    if (deltas) {
        [...(entity as MovableEntity).carrying, ...(entity as MovableEntity).carryingPreviously].forEach(
            e => roomAddEntity(room, e as Entity, deltas)
        );
    }
}

let roomAddEntityToTiles = (room: Room, entity: Entity) => {
    if (!(entity as MortalEntity).deathAge) {
        const movableEntity = entity as MovableEntity;
        entityCalculateBoundsWithVelocity(entity);
        if (FLAG_CHECK_TILES_VALID) {
            const alreadyThere = room.tiles.find(tiles => tiles.find(entities => entities.find(e => e == entity)));
            if (alreadyThere) {
                console.log('added but already there');
            }
        }
    
        roomIterateBounds(room, movableEntity.boundsWithVelocity || movableEntity.bounds, tile => tile.push(entity));            
    }
}

let roomRemoveEntity = (room: Room, entity: Entity, includeCarried?: number | boolean) => {
    arrayRemoveElement(room.allEntities, entity);
    if((entity as MovableEntity).velocity || (entity as GraphicalEntity).graphic) {
        arrayRemoveElement(room.updatableEntities, entity);
    }
    roomRemoveEntityFromTiles(room, entity);
    if (includeCarried) {
        [...(entity as MovableEntity).carrying, ...(entity as MovableEntity).carryingPreviously].forEach(
            e => roomRemoveEntity(room, e as Entity, 1)
        );
    }
}

let roomRemoveEntityFromTiles = (room: Room, entity: Entity) => {
    const movableEntity = entity as MovableEntity;
    roomIterateBounds(room, movableEntity.boundsWithVelocity || movableEntity.bounds, tile => {
        arrayRemoveElement(tile, entity);
    });
    if (FLAG_CHECK_TILES_VALID) {
        const stillThere = room.tiles.find(tiles => tiles.find(entities => entities.find(e => e == entity)));
        if (stillThere) {
            console.log('removed but still there');
        }
    }
}
