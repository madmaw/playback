type EntityFactory = (x: number, y: number, id: IdFactory) => Entity[];

const PLAYER_PERSISTENT_ID = 1;
const TUTORIAL_PLATFORM_PERSISTENT_ID = 2;
const PERSISTENT_IDS = [PLAYER_PERSISTENT_ID, TUTORIAL_PLATFORM_PERSISTENT_ID];

const compositeEntityFactoryFactory = (entityFactories: EntityFactory[]) => {
    return (x, y, id: IdFactory) => {
        return entityFactories.reduce((entities, entityFactory) => [...entities, ...entityFactory(x, y, id)], []);
    }
}

type Legend = {[_:string]: EntityFactory};

type RoomFactoryMetadata = {
    roomWidth: number, 
    roomHeight: number, 
    factory: RoomFactory, 
    playerX: number, 
    playerY: number, 
    playerRoomX: number, 
    playerRoomY: number, 
};

type RoomAndEntity = [number, number, Entity];

const roomFactoryFactory = () => {
    const spikeFactory = spikeFactoryFactory();

    // set up all the entities
    const baseLegend: Legend = {
        'r': blockFactoryFactory(0), 
        'y': blockFactoryFactory(220), 
        'g': blockFactoryFactory(120), 
        'c': blockFactoryFactory(180), 
        'b': blockFactoryFactory(240),
        'p': blockFactoryFactory(300),
        'w': blockFactoryFactory(0, 0, 90), 
        'k': blockFactoryFactory(0, 0, 20),  
        'a': crateFactoryFactory(0),
        '^': spikeFactory, 
        'm': mainframeFactoryFactory(),
        'd': platformFactoryFactory(1, 2, EDGE_TOP),
    }

    const roomFactories: RoomFactory[][] = [
        [
            // 0, 0
            legendRoomFactory(
                {...baseLegend, 
                    '4': pressurePlateFactoryFactory(1, 1, 50, 80, 40, [INSTRUCTION_ID_SAVE, INSTRUCTION_ID_HELP, INSTRUCTION_ID_DOWN], [60, 80, 70]),
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                'y                y' +
                'y                y' + 
                'y                y' + 
                'y                y' + 
                'y                y' + 
                'y                y' +
                'y                y' +
                'y                y' +
                'y                y' +
                'y                y' +
                'y           4     ' +
                'yy   yyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                [60, 20, 90], 
            ),             
            // 1, 0
            legendRoomFactory(
                {...baseLegend, 
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                'y                y' +
                'y                y' + 
                'y                y' + 
                'y                y' + 
                'y                y' + 
                'y                y' +
                'y                y' +
                'y                y' +
                'y                y' +
                'y                y' +
                '                 y' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                [60, 20, 80], 
            ),             
        ], 
        [
            // 0, 1
            legendRoomFactory(
                {...baseLegend,
                    '1': repeaterFactoryFactory([,,,INSTRUCTION_ID_LEFT,,,], [60, 80, 70]),
                    '2': repeaterFactoryFactory([
                        INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,
                        INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,
                    ], [60, 80, 70]), 
                    '3': compositeEntityFactoryFactory([robotFactoryFactory(ORIENTATION_LEFT), spikeFactory]),
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                'y                y' +
                'y     1          y' + 
                'yyyy     yyyyyyyyy' + 
                'y        y       y' + 
                'y        y       y' + 
                'ya       y       y' +
                'yyyyyyyyyy       y' +
                'y                 ' +
                'y                y' +
                'y                y' +
                'y                y' +
                'y   yyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                [30, 20, 60], 
            ),
            // 1, 1
            legendRoomFactory(
                {...baseLegend, 
                    '1': repeaterFactoryFactory([,,INSTRUCTION_ID_RIGHT,,,,], [60, 80, 70]), 
                    '2': pressurePlateFactoryFactory(1, 1, 50, 80, 40, [INSTRUCTION_ID_LEFT], [60, 80, 70]),
                    '3': pressurePlateFactoryFactory(1, 1, 50, 80, 40, [INSTRUCTION_ID_JUMP], [60, 80, 70]), 
                    '4': pressurePlateFactoryFactory(1, 1, 50, 80, 40, [INSTRUCTION_ID_DOWN], [60, 80, 70]), 
                    'A': crateFactoryFactory(.1),
                    'P': persistentEntityFactoryFactory(playerFactory, PLAYER_PERSISTENT_ID), 
                    'R': robotFactoryFactory(ORIENTATION_RIGHT),
                    'F': persistentEntityFactoryFactory(platformFactoryFactory(2, 1, EDGE_BOTTOM), TUTORIAL_PLATFORM_PERSISTENT_ID), 
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                'y                y' +
                'y  y          1  y' + 
                'y  y       y  P  y' + 
                'y  yyyyyyyyy3yyy2y' + 
                'y            a   y' + 
                'y  yyyy     yy   y' +
                'yyyyF yyyy  y    y' +
                '  R     yy^^y    y' +
                'y4y     yyyyyy4  y' +
                'y        a       y' +
                'y     ^^^yyyyyy^^y' +
                'y  yyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                [240, 80, 80], 
            ),
        ], 
        [
            // 0, 2
            legendRoomFactory(
                {...baseLegend, 
                    'Y': blockFactoryFactory(220, undefined, undefined, 1, .6), 
                    '1': pressurePlateFactoryFactory(2, 1, 50, 80, 40, [INSTRUCTION_ID_PLAY], [60, 80, 70]), 
                    '2': platformFactoryFactory(2, 1, EDGE_LEFT),
                    '3': platformFactoryFactory(2, 1, EDGE_RIGHT), 
                    '4': platformFactoryFactory(1, 4, EDGE_TOP), 
                    '5': platformFactoryFactory(1, 4, EDGE_BOTTOM), 
                }, 
                'y   yyYYYYYYYYYyyy' + 
                'y5 5yy 5 5 5 5    ' +
                'y   yy           y' + 
                'y   y            y' + 
                'y   y y 4 4 4 41 y' + 
                'y   y            y' + 
                'y   yy           y' +
                'y   yy           y' +
                'y 4 YYYYYYYYYYY  y' +
                'y       3 2      y' +
                'y  2           3 y' +
                'y       3 2      y' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                [30, 20, 60], 
            ), 
            // 1, 2
            legendRoomFactory(
                {...baseLegend, 
                    '1': pressurePlateFactoryFactory(3, 1, 50, 80, 40, [INSTRUCTION_ID_SAVE, INSTRUCTION_ID_UP, INSTRUCTION_ID_SHOOT,,, INSTRUCTION_ID_DOWN], [60, 80, 70]),
                    'R': robotFactoryFactory(ORIENTATION_LEFT),
                }, 
                'y  yyyybbbbbbbbbbb' + 
                '     y           b' +
                'yy   y           b' + 
                'yy   y           b' +
                'yy   y           b' +
                'y   dybbbbbbbbbbbb' + 
                'ym              R ' + 
                'yy1  ybbbbbbbb  bb' + 
                '                 b' +
                'bb bbbbbbbbbbbb  b' +
                'bb bb             ' +
                'bb               b' +
                'bbbbbbbbbbbbbbbbbb',
                MAX_TILES_ACROSS, 
                [30, 20, 60], 
            )
        ] 
    ];
    // NOTE: the x/y s are reversed
    const result: RoomFactoryMetadata = {
        factory: (rx: number, ry: number, id: IdFactory) => roomFactories[ry][rx](rx, ry, id),
        roomWidth: 2, 
        roomHeight: 3, 
        playerX: 2, 
        playerY: 3, 
        playerRoomX: 0, 
        playerRoomY: 1, 
    }
    return result;
}

const legendRoomFactory = (legend: Legend, roomDefinition: string, width: number, backgroundColor: HSL) => {
    const height = (roomDefinition.length / width) | 0 + 1;
    return (x: number, y: number, id: IdFactory) => {
        const room: Room = {
            allEntities: [], 
            backgroundColor, 
            bounds: [x, y, width, height], 
            gravity: DEFAULT_GRAVITY, 
            tiles: array2DCreate(width, height, () => []), 
            updatableEntities: [], 
        };
        roomDefinition.split('').forEach((c, i) => {
            const tx = i % width;
            const ty = (i / width) | 0;
            const entityFactory = legend[c];
            if (entityFactory) {
                const entities = entityFactory(tx, ty, id);
                entities.forEach(entity => roomAddEntity(room, entity));
            }
        });
        // also extract any entities that are persistent and in this room
        PERSISTENT_IDS.forEach(pid => {
            const json = localStorage.getItem(pid as any);
            if (json) {
                const [roomX, roomY, entity] = JSON.parse(json) as RoomAndEntity;
                if (roomX == x && roomY == y) {
                    // TODO zero out some stuff on this entity
                    roomAddEntity(room, entity);
                }
            }
        });

        return room;
    }
};