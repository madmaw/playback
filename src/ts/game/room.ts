type Room = {
    allEntities: Entity[];
    updatableEntities: Entity[];
    tiles: Entity[][][]; 
    bounds: Rectangle;
    gravity: Vector;
    backgroundColor: HSL;
}

type IdFactory = () => number;

type RoomFactory = (x: number, y: number, id: IdFactory) => Room;

let roomCreate = (x: number, y: number, w: number, h: number) => {
    const tiles: Entity[][][] = array2DCreate(w, h, () => []);
    
    const room: Room = {
        allEntities: [], 
        updatableEntities: [], 
        tiles, 
        bounds: [x, y, w, h], 
        gravity: DEFAULT_GRAVITY, 
        backgroundColor: [240, 20, 90], 
    };
    return room;
};

let roomIterateEntities = (room: Room, bounds: Rectangle | undefined, i: (entity: Entity) => void, useBoundsWithVelocity?: number | boolean) => {
    const handled = new Set<number>();
    roomIterateBounds(room, bounds, tile => tile.forEach(e => {
        if (!handled.has(e.id) && rectangleOverlaps(useBoundsWithVelocity && (e as MovableEntity).boundsWithVelocity || e.bounds, bounds)) {
            i(e);
            handled.add(e.id);
        }
    }));
}

let roomIterateBounds = (room: Room, bounds: Rectangle | undefined, i: (tile: Entity[], tx: number, ty: number) => void) => {
    rectangleIterateBounds(bounds, room.bounds, (tx, ty) => {
        i(room.tiles[tx][ty], tx, ty);
    })
}

let roomAddEntity = (room: Room, entity: Entity, deltas?: Vector) => {
    if (deltas) {
        axisMap(deltas, entity.bounds, ([d], [v]) => v + d, entity.bounds);
    }
    room.allEntities.push(entity);        
    if((entity as MovableEntity).velocity) {
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
