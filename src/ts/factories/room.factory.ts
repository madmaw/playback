type EntityFactory = (x: number, y: number, id: IdFactory) => Entity[];

const compositeEntityFactoryFactory = (entityFactories: EntityFactory[]) => {
    return (x, y, id: IdFactory) => {
        return entityFactories.reduce((entities, entityFactory) => [...entities, ...entityFactory(x, y, id)], []);
    }
}

type Legend = {[_:string]: EntityFactory};

type RoomFactoryMetadata = {
    width: number, 
    height: number, 
    factory: RoomFactory, 
    playerX: number, 
    playerY: number, 
    playerRoomX: number, 
    playerRoomY: number, 
}

const roomFactoryFactory = () => {
    const spikeFactory = spikeFactoryFactory();

    // set up all the entities
    const baseLegend: Legend = {
        'r': blockFactoryFactory(0), 
        'y': blockFactoryFactory(50, 80, 40), 
        'g': blockFactoryFactory(120), 
        'c': blockFactoryFactory(180), 
        'b': blockFactoryFactory(240),
        'p': blockFactoryFactory(300),
        'w': blockFactoryFactory(0, 0, 90), 
        'k': blockFactoryFactory(0, 0, 20),  
        'a': crateFactoryFactory(0),
        '^': spikeFactory, 
    }

    const roomFactories: RoomFactory[][] = [
        [
            // 0, 0
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
                'y                 ' +
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
                    '1': repeaterFactoryFactory([,,INSTRUCTION_ID_RIGHT,,,,], [60, 80, 70]), 
                    '2': repeaterFactoryFactory([INSTRUCTION_ID_JUMP,,,,,,], [60, 80, 70]), 
                    '3': repeaterFactoryFactory([,,,,,INSTRUCTION_ID_DOWN,], [60, 80, 70]), 
                    'A': crateFactoryFactory(.1),
                }, 
                'yy   yyyyyyyyyyyyy' + 
                'yyy               ' +
                'y    1            ' + 
                'y         ^       ' + 
                'yyyyyyyyyyyyyyyyyy' + 
                'y                 ' + 
                'yyA           2   ' +
                'yy yy             ' +
                'y   yyyyyyyyyyyyyy' +
                'yy yy             ' +
                'yy     3         y' +
                'yy^              y' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                [30, 20, 60], 
            ), 
            // 1, 1
            legendRoomFactory(
                {...baseLegend,
                    '1': repeaterFactoryFactory([,,,INSTRUCTION_ID_LEFT,,,], [60, 80, 70]),
                    '2': repeaterFactoryFactory([
                        INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,INSTRUCTION_ID_LEFT,,
                        INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,INSTRUCTION_ID_RIGHT,,
                    ], [60, 80, 70]), 
                    '3': compositeEntityFactoryFactory([robotFactoryFactory(), spikeFactory]),
                    '4': pressurePlateFactoryFactory(3, 1, 50, 80, 40),
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                '                 y' +
                '                 y' + 
                '                 y' + 
                'yyyyyyyyyyyy     y' + 
                '              1  y' + 
                '                 y' +
                '     a      4    y' +
                'yyyyyyyyyyyyyyyyyy' +
                '                 y' +
                'yyy            2 y' +
                'yyy^^^^^^^34     y' +
                'yyyyyyyyyyyyyy   y',
                MAX_TILES_ACROSS, 
                [30, 20, 60], 
            )
        ] 
    ];
    // NOTE: the x/y s are reversed
    const result: RoomFactoryMetadata = {
        factory: (rx: number, ry: number, id: IdFactory) => roomFactories[ry][rx](rx, ry, id),
        width: 2, 
        height: 2, 
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
        return room;
    }
};