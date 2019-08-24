type World = {
    rooms: Room[][];
    currentRoom: Vector;
    size: Vector;
    nextId: number;
    age: number;
    previousFrames?: string[];
    player: ActiveMovableEntity;
};

const createWorld = (w: number, h: number, startX: number, startY: number, roomFactory: (x: number, y: number) => Room) => {
    const rooms = array2DCreate(w, h, roomFactory);
    const player = rooms[startX][startY].updatableEntities.find(e => e.entityType == ENTITY_TYPE_PLAYER) as Player;
    const world: World = {
        currentRoom: [startX, startY], 
        size: [w, h], 
        rooms, 
        nextId: 0, 
        age: 0, 
        player, 
    };
    return world;
}

const worldGetActiveRoomBounds = (world: World): Rectangle => {    
    const [cx, cy] = world.currentRoom;
    const [w, h] = world.size;
    const minX = cx - ACTIVE_ROOM_SPREAD_HORIZONTAL;
    const minY = cy - ACTIVE_ROOM_SPREAD_VERTICAL; 
    return [
        Math.max(minX, 0), 
        Math.max(minY, 0), 
        Math.min(cx + ACTIVE_ROOM_SPREAD_HORIZONTAL, w - 1) - minX, 
        Math.min(cy + ACTIVE_ROOM_SPREAD_VERTICAL, h - 1) - minY, 
    ];
}

