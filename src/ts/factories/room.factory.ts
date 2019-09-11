type EntityFactory = (x: number, y: number, id: IdFactory) => Entity[];

const PLAYER_PERSISTENT_ID = 1;
const TUTORIAL_END_DOOR_PERSISTENT_ID = 2;
const TUTORIAL_TAPE_PLATOFORM_PERSITENT_ID = 3;
const PERSISTENT_ID_GUN_ROOM_1 = 4;
const PERSISTENT_ID_GUN_ROOM_2 = 5;
const PERSISTENT_ID_GUN_ROOM_3 = 6;

const MAX_PERSISTENT_ID_PLUS_1 = 7;

// do not use 0 as hue for red as we do a lazy null check
const HUE_TAPE_SET_1 = 60;
const HUE_TAPE_SET_2 = 1;
const HUE_TAPE_SET_3 = 120;
const HUE_TAPE_SET_4 = 240;
const HUE_TAPE_SET_5 = 300;

const HSL_AREA_0_BLOCKS: HSL = [0, 40, 40];
const BACKGROUND_AREA_0: HSL[] = [[240, 60, 80], [240, 50, 30]];

const HSL_AREA_1_BLOCKS: HSL = [240, 30, 40];
const BACKGROUND_AREA_1: HSL[] = [[200, 5, 20]];



const compositeEntityFactoryFactory = (entityFactories: EntityFactory[]) => {
    return (x, y, id: IdFactory) => {
        return entityFactories.reduce((entities, entityFactory) => [...entities, ...entityFactory(x, y, id)], []);
    }
}

type Legend = {[_:string]: EntityFactory};

type RoomFactoryMetadata = {
    worldWidth: number, 
    worldHeight: number, 
    factory: RoomFactory, 
};

type RoomAndEntity = [number, number, Entity];

const roomFactoryFactory = () => {
    const spikeFactory = spikeFactoryFactory();

    // set up all the entities
    const baseLegend: Legend = {
        'o': blockFactoryFactory(HSL_AREA_0_BLOCKS, 1), 
        'y': blockFactoryFactory(HSL_AREA_1_BLOCKS), 
        'a': crateFactoryFactory(),
        '^': spikeFactory, 
        'T': sceneryFactoryFactory('🌳', 3), // 🌳
        //'A': sceneryFactoryFactory('🌲', 3), // 🌲
        'O': sceneryFactoryFactory('☁️', 2), // ☁️
        'F': sceneryFactoryFactory('🌻', 1), // 🌻
        'M': sceneryFactoryFactory('🍄', .5), // 🍄
        'I': sceneryFactoryFactory('🕯️', .5), // 🕯️
        'Z': sceneryFactoryFactory('🖼️', 1), // 🖼️
        'm': mainframeFactoryFactory(HUE_TAPE_SET_1),
        'd': platformFactoryFactory(1, 2, EDGE_TOP, HUE_TAPE_SET_1),
        'P': persistentEntityFactoryFactory(playerFactory, PLAYER_PERSISTENT_ID), 
    }

    const roomFactories: RoomFactory[][] = [
        [
            ,,,,
        ], 
        [
            // 0, 1
            legendRoomFactory(
                {...baseLegend, 
                    '4': tapeFactoryFactory([INSTRUCTION_ID_SAVE, INSTRUCTION_ID_HELP, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)),
                }, 
                'oo                ' + 
                '    P        O    ' +
                ' F                ' + 
                'oo    O           ' + 
                'oo          aT T  ' +
                'oo          oooooo' +
                'ooo         oooooo' +
                'ooo         oooooo' +
                'oooo       ooooooo' +
                'oooooooooooooo  oo' +
                'ooooooooooooM     ' +
                'ooooooooooooo M   ' +
                'oooooooooooooooooo',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_0, 
            ),                
            // 1, 1
            legendRoomFactory(
                {...baseLegend, 
                    'R': robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_1), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_COUNT_1, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_COUNT_1, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_RIGHT,,,,,,,], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_1)), 
                }, 
                '                  ' + 
                '   O      1       ' + 
                '          o       ' + 
                '                  ' + 
                ' T TFFR         T ' + 
                'ooooooo        ooo' +
                'ooooooo        ooo' +
                'ooooooo        ooo' +
                'oooooooooooooooooo' +
                'oooooooooooooooooo' +
                '                 o' +
                '    y^^^^^^^^y   o' +
                'o  yyyyyyyyyyyy  o',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_0, 
            ),                
            // 2, 1
            legendRoomFactory(
                {...baseLegend,
                    'a': tapeFactoryFactory([INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'A': platformFactoryFactory(2, 1, EDGE_RIGHT, HUE_TAPE_SET_1),
                    '1': tapeFactoryFactory([INSTRUCTION_ID_COUNT_7, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_LEFT)), 
                    'b': tapeFactoryFactory([INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'B': platformFactoryFactory(2, 1, EDGE_RIGHT, HUE_TAPE_SET_2),
                    '2': tapeFactoryFactory([INSTRUCTION_ID_COUNT_7, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_LEFT)), 
                    'c': tapeFactoryFactory([INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'C': platformFactoryFactory(2, 1, EDGE_RIGHT, HUE_TAPE_SET_3),
                    '3': tapeFactoryFactory([INSTRUCTION_ID_COUNT_7, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                }, 
                '               yyy' + 
                '         O     yyy' +
                '    O          3yy' + 
                '                  ' + 
                'TF                ' + 
                'oo           yyyyy' + 
                'ooc       C   yyyy' + 
                'ooo           yyyy' +
                'ooob       B  2yyy' +
                'oooo              ' +
                'ooooa       A  1yy' +
                'ooooo^^^^^^^^^^yyy' +
                'ooooooooooooooooyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_0, 
            ),                
            // 3, 1
            legendRoomFactory(
                {...baseLegend,
                    'd': persistentEntityFactoryFactory(platformFactoryFactory(1, 5, EDGE_TOP, HUE_TAPE_SET_1), TUTORIAL_END_DOOR_PERSISTENT_ID),
                    'U': tapeFactoryFactory([INSTRUCTION_ID_UP,INSTRUCTION_ID_UP,INSTRUCTION_ID_UP,INSTRUCTION_ID_UP,INSTRUCTION_ID_SAVE], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'D': tapeFactoryFactory([INSTRUCTION_ID_DOWN,INSTRUCTION_ID_DOWN,INSTRUCTION_ID_DOWN,INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_LEFT)), 
                    'P': platformFactoryFactory(1, 1, EDGE_TOP, HUE_TAPE_SET_3),
                    'h': platformFactoryFactory(1, 1, EDGE_RIGHT, HUE_TAPE_SET_2),
                    'H': tapeFactoryFactory([INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                }, 
                'yyyyyyy       yy y' + 
                'yha ydyI     yy  y' +
                'y y y yy    yy   y' + 
                '               y y' + 
                '             Z y y' + 
                'yyyH  U yyy    y y' + 
                'y         yy   y y' + 
                'ym         yy  y y' +
                'yyyyy          y y' +
                '    y yyyyyyyyyy y' +
                'y   D            y' +
                'yyyyyy         yPy' +
                'yyyyyyyy  yyyyyyyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_1, 
            ),                

        ],
        [
            // 0, 2
            ,             
            // 1, 2
            ,             
            // 2, 2
            legendRoomFactory(
                {...baseLegend, 
                    'D': tapeFactoryFactory([INSTRUCTION_ID_UP], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'd': platformFactoryFactory(2, 1, EDGE_BOTTOM, HUE_TAPE_SET_1),
                    'E': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'e': platformFactoryFactory(2, 1, EDGE_LEFT, HUE_TAPE_SET_1),
                    'F': tapeFactoryFactory([INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'G': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'H': tapeFactoryFactory([INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                '           y      ' +
                'yyyyyyyyyy y      ' + 
                'y        y y     y' + 
                'y        y y     y' +
                'y        y y     y' +
                'y                y' +
                'y                y' +
                'y        y y      ' +
                'y        y y     y' +
                'y        y y     y' +
                'y        y       y' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_1, 
            ),             
            // 3, 2
            legendRoomFactory(
                {...baseLegend, 
                    '1': tapeFactoryFactory([,INSTRUCTION_ID_RIGHT,], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_3)), 
                    '2': tapeFactoryFactory([,,INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_4)), 
                    'a': platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_1), 
                    'A': tapeFactoryFactory([INSTRUCTION_ID_UP], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    '3': tapeFactoryFactory([INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'b': platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_2), 
                    'B': tapeFactoryFactory([INSTRUCTION_ID_UP], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    '4': tapeFactoryFactory([INSTRUCTION_ID_DOWN], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'c': platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_3), 
                    'd': platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_4), 
                    'R': compositeEntityFactoryFactory([robotFactoryFactory(ORIENTATION_RIGHT, HUE_TAPE_SET_1), spikeFactory]),
                }, 
                'yyyyyyyy  yyyyyyyy' + 
                '    2d      c1    ' + 
                'y yby   yy   yay  ' + 
                'y y y        y y y' +
                'y yyyy4    3yyyy y' + 
                'y y     BA     y y' + 
                'y                y' + 
                'Byyyy  yyyy  yyyyA' +
                '    yy      yy    ' +
                '                  ' +
                'yy y^^^^R^^^^^y yy' +
                'y  yyyyyyyyyyyy  y' +
                'y3yyyyyyyyyyyyyy4y',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_1, 
            ),
            // 4, 2
            legendRoomFactory(
                {...baseLegend, 
                    'a': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_1)),
                    'A': tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_RIGHT)), 
                    'b': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_2)),
                    'B': tapeFactoryFactory([INSTRUCTION_ID_COUNT_6, INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    '2': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'c': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_3)),
                    'C': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    '3': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_RIGHT)), 
                    '#': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'd': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_4)),
                    'D': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    '4': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_RIGHT)), 
                    '$': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'e': persistentEntityFactoryFactory(platformFactoryFactory(1, 10, EDGE_BOTTOM, HUE_TAPE_SET_5), PERSISTENT_ID_GUN_ROOM_1), 
                    'f': platformFactoryFactory(1, 1, EDGE_BOTTOM, HUE_TAPE_SET_5), 
                    'g': persistentEntityFactoryFactory(platformFactoryFactory(1, 8, EDGE_BOTTOM, HUE_TAPE_SET_5), PERSISTENT_ID_GUN_ROOM_2), 
                    'E': tapeFactoryFactory([INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_COUNT_0, INSTRUCTION_ID_UP], HUE_TAPE_SET_5, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'l': persistentEntityFactoryFactory(platformFactoryFactory(3, 1, EDGE_RIGHT, HUE_TAPE_SET_5), PERSISTENT_ID_GUN_ROOM_3),
                    'k': platformFactoryFactory(1, 1, EDGE_RIGHT, HUE_TAPE_SET_5),
                    'L': tapeFactoryFactory([INSTRUCTION_ID_COUNT_6, INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_5, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'm': mainframeFactoryFactory(HUE_TAPE_SET_5),
                    'M': tapeFactoryFactory([INSTRUCTION_ID_SAVE], HUE_TAPE_SET_5, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                }, 
                'yyy ey$2#y    g  y' + 
                '  y      y       y' + 
                'l        L      ay' + 
                'yy1             yy' +
                'yyyf A         b y' + 
                'yyk     B      yyy' + 
                'yy4            c y' + 
                'yyy   y   y    yyy' +
                '  y3            dy' +
                '  y             yy' +
                'y yy4            y' +
                'yP       E      my' +
                'yyM yyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_1, 
            ),            
        ], 
        [
            // 0, 2
            legendRoomFactory(
                {...baseLegend,
                    '1': tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_EJECT], HUE_TAPE_SET_1),
                    '2': platformFactoryFactory(3, 1, EDGE_RIGHT, HUE_TAPE_SET_1), 
                    'R': robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_1), 
                }, 
                'yyyyyyyyyyyy R yyy' + 
                'y      y     a   y' + 
                'y      y    yyy  y' + 
                'y      y         y' +
                'y      y         y' + 
                'y    1 y   a     y' + 
                'y   yyyy  yyyyyyyy' +
                'yy               y' +
                'y                y' +
                'y   y2        y  y' +
                'yy  y         y  y' +
                'y   y^^^^^^^^^y  y' +
                'y  yyyyyyyyyyyy  y',
                MAX_TILES_ACROSS, 
            ),
            // 1, 2
            legendRoomFactory(
                {...baseLegend, 
                    '1': tapeFactoryFactory([,INSTRUCTION_ID_RIGHT,], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_1)), 
                    '2': tapeFactoryFactory([,,INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_1)), 
                    '3': tapeFactoryFactory([INSTRUCTION_ID_SAVE], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'R': compositeEntityFactoryFactory([robotFactoryFactory(ORIENTATION_RIGHT, HUE_TAPE_SET_1), spikeFactory]),
                }, 
                'yyyyyyyyyyyyyyy  y' + 
                'y                y' + 
                'ym    yyyyyy     y' +
                'yyyy  y1yy2y  y3 y' + 
                'y        a       y' + 
                'y   yyyyyyyyyy   y' + 
                'y                y' +
                'yy              yy' +
                'yyyyyyyy  yyyyyyyy' +
                'y                y' +
                'y                y' +
                'y  yR^^^^^^^^^^^^y' +
                'y  yyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
            ),
            // 2, 2
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
                'y                y' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
            ),             
        ], 
        [
            // 0, 3
            legendRoomFactory(
                {...baseLegend, 
                    'Y': blockFactoryFactory(HSL_AREA_1_BLOCKS, 1, .8, .6), 
                    '0': tapeFactoryFactory([INSTRUCTION_ID_UP, INSTRUCTION_ID_UP, INSTRUCTION_ID_UP,,, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_1)), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN,INSTRUCTION_ID_UP, INSTRUCTION_ID_UP, INSTRUCTION_ID_UP], HUE_TAPE_SET_2, repeaterFactoryFactory(HUE_TAPE_SET_2)), 
                    '2': platformFactoryFactory(2, .5, EDGE_LEFT, HUE_TAPE_SET_2),
                    '3': platformFactoryFactory(2, .5, EDGE_RIGHT, HUE_TAPE_SET_1), 
                    '4': platformFactoryFactory(1, 4, EDGE_TOP, HUE_TAPE_SET_1), 
                    '5': platformFactoryFactory(1, 4, EDGE_BOTTOM, HUE_TAPE_SET_2), 
                    '6': compositeEntityFactoryFactory([tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT,INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT,INSTRUCTION_ID_RIGHT,,,], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_1)), spikeFactory]), 
                    '7': compositeEntityFactoryFactory([tapeFactoryFactory([INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT,,, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_2, repeaterFactoryFactory(HUE_TAPE_SET_2)), spikeFactory]), 
                }, 
                'y   yyyyyyyyyyy  y' + 
                'yy  y  5 5 5 5    ' +
                'y   yy         1  ' + 
                'y  yy            y' + 
                'y   y y 4 4 4 yyyy' + 
                'y   y            y' + 
                'y4  yy          yy' +
                'y   y0           y' +
                'y  YYYYYYYYYYyy  y' +
                'y     3   2      y' +
                'yy2           3  y' +
                'y7^^^^^^^^^^^^^^6^' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
            ), 
            // 1, 3
            legendRoomFactory(
                {...baseLegend, 
                    '0': tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_EJECT], HUE_TAPE_SET_1),
                    '1': tapeFactoryFactory([INSTRUCTION_ID_SAVE, INSTRUCTION_ID_UP, INSTRUCTION_ID_COUNT_9, INSTRUCTION_ID_SHOOT,, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)),
                    '2': platformFactoryFactory(2, 1, EDGE_BOTTOM, HUE_TAPE_SET_2),
                    'R': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_1)),
                }, 
                'y  yyyybbbbbbbbbbb' + 
                '      y           ' +
                '    0my           ' + 
                'yy  yyy2 bbbbbbbbb' + 
                'y   y             ' +
                'y   y             ' +
                'y  dybbbbbbbbb   b' + 
                'y              R b' + 
                'y1 yybbbbbbbbbbb b' + 
                'b                b' +
                'b                b' +
                '^                b' +
                'bbbbbbbbbbbbbbbbbb',
                MAX_TILES_ACROSS, 
            ), 
            // 2, 3
            legendRoomFactory(
                {...baseLegend, 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_SAVE, INSTRUCTION_ID_UP, INSTRUCTION_ID_COUNT_9, INSTRUCTION_ID_SHOOT,, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)),
                    '2': platformFactoryFactory(3, 1, EDGE_BOTTOM, HUE_TAPE_SET_2),
                    'R': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_1)),
                }, 
                'bbbbbbbbbbbbbbbbbb' + 
                '                 b' +
                '                 b' + 
                'bbbbbbbbbbbbbbbbbb' + 
                '     b           b' +
                '  a  b           b' +
                'bbbbbb           b' + 
                'b                b' + 
                'b                b' + 
                'b                b' +
                'b                b' +
                'b                b' +
                'bbbbbbbbbbbbbbbbbb',
                MAX_TILES_ACROSS, 
            ),  

        ] 
    ];
    // NOTE: the x/y s are reversed
    const result: RoomFactoryMetadata = {
        factory: (rx: number, ry: number, id: IdFactory) => {
            const factory = roomFactories[ry][rx];
            return factory && factory(rx, ry, id);
        },
        worldWidth: 5, 
        worldHeight: 3, 
    }
    return result;
}

const legendRoomFactory = (legend: Legend, roomDefinition: string, width: number, background: HSL[] = [[0, 0, 30]]) => {
    const height = (roomDefinition.length / width) | 0 + 1;
    return (x: number, y: number, id: IdFactory) => {
        const room: Room = {
            allEntities: [], 
            bounds: [x, y, width, height], 
            gravity: DEFAULT_GRAVITY, 
            tiles: array2DCreate(width, height, () => []), 
            updatableEntities: [], 
            soundWaves: [], 
            background, 
        };
        roomDefinition.split('').forEach((c, i) => {
            const tx = i % width;
            const ty = (i / width) | 0;
            const entityFactory = legend[c];
            if (entityFactory) {
                const entities = entityFactory(tx, ty, id);
                entities.forEach(entity => {
                    // adjust 
                    const everyEntity = entity as EveryEntity;
                    if (everyEntity.gravityMultiplier && everyEntity.mass) {
                        everyEntity.bounds[1] -= MAX_ROUNDING_ERROR_SIZE;
                    }
                    roomAddEntity(room, entity)
                });
            }
        });
        // also extract any entities that are persistent and in this room
        for (let pid = 1; pid < MAX_PERSISTENT_ID_PLUS_1; pid++) {
            const json = localStorage.getItem(pid as any);
            if (json) {
                const [roomX, roomY, entity] = JSON.parse(json) as RoomAndEntity;
                if (roomX == x && roomY == y) {
                    // TODO zero out some stuff on this entity
                    roomAddEntity(room, entity);
                }
            }
        }

        return room;
    }
};