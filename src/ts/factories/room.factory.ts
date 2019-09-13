type EntityFactory = (x: number, y: number, id: IdFactory, pid?: number) => Entity[];

const PLAYER_PERSISTENT_ID = 1;
const PERSISTENT_ID_TUTORIAL_END_1 = 2;
const PERSISTENT_ID_TUTORIAL_END_2 = 3;
const PERSISTENT_ID_TUTORIAL_END_3 = 4;
const TUTORIAL_TAPE_PLATOFORM_PERSITENT_ID = 5;
const PERSISTENT_ID_GUN_ROOM_1 = 6;
const PERSISTENT_ID_GUN_ROOM_2 = 7;
const PERSISTENT_ID_GUN_ROOM_3 = 8;
const PERSISTENT_ID_LEFT_RIGHT_ROOM_1 = 9;
const PERSISTENT_ID_LEFT_RIGHT_ROOM_2 = 10;

const MAX_PERSISTENT_ID_PLUS_1 = 11;

// do not use 0 as hue for red as we do a lazy null check
const HUE_TAPE_SET_1 = 60;
const HUE_TAPE_SET_2 = 145;
const HUE_TAPE_SET_3 = 1;
const HUE_TAPE_SET_4 = 217;
const HUE_TAPE_SET_5 = 289;

const HSL_AREA_0_BLOCKS: HSL = [15, 35, 40];
const BACKGROUND_AREA_0: HSL[] = [[240, 60, 80], [240, 50, 50], [120, 20, 20]];

const HSL_AREA_1_BLOCKS: HSL = [240, 40, 40];
const BACKGROUND_AREA_1: HSL[] = [[199, 5, 20], [120, 20, 20]];

const HSL_AREA_2_BLOCKS: HSL = [180, 40, 25];
const BACKGROUND_AREA_2: HSL[] = [[120, 20, 20], [0, 30, 20]];
 
const HSL_AREA_3_BLOCKS: HSL = [299, 20, 40];
const BACKGROUND_AREA_3: HSL[] = [[299, 20, 30], [199, 5, 20]];

const BACKGROUND_AREA_4: HSL[] = [[240, 20, 50], [299, 20, 30]];
const BACKGROUND_AREA_5: HSL[] = [[240, 100, 100],[240, 20, 50]]



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
        'o': blockFactoryFactory(HSL_AREA_0_BLOCKS, 6), 
        'y': blockFactoryFactory(HSL_AREA_1_BLOCKS), 
        //'x': blockFactoryFactory(HSL_AREA_2_BLOCKS, 6), 
        'z': blockFactoryFactory(HSL_AREA_3_BLOCKS, 2), 
        'a': crateFactory,
        'v': spikeFactory, 
        'T': sceneryFactoryFactory('🌳', 3), // 🌳
        //'A': sceneryFactoryFactory('🌲', 3), // 🌲
        'O': sceneryFactoryFactory('☁️', 2), // ☁️  
        'U': sceneryFactoryFactory('☁️', 3), 
        //'F': sceneryFactoryFactory('🌻', 1), // 🌻
        //'M': sceneryFactoryFactory('🍄', .5), // 🍄
        //'I': sceneryFactoryFactory('🕯️', .5), // 🕯️
        //'Z': sceneryFactoryFactory('🖼️', 1), // 🖼️
        //'H': sceneryFactoryFactory('🏺', 1), // 🏺
        //'K': sceneryFactoryFactory('⚗️', 2), // ⚗️
        //'P': persistentEntityFactoryFactory(playerFactory, PLAYER_PERSISTENT_ID), 
        'm': mainframeFactoryFactory(HUE_TAPE_SET_1), 
    }

    const script1 = [INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_LEFT,
        INSTRUCTION_ID_ASSPULL, 
        INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_RIGHT, 
        INSTRUCTION_ID_THROW, INSTRUCTION_ID_WAIT, 
        INSTRUCTION_ID_JUMP, 
        INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_WAIT,
        INSTRUCTION_ID_ASSPULL, 
        INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_LEFT, 
        INSTRUCTION_ID_THROW, INSTRUCTION_ID_WAIT, 
        INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_RIGHT, 
        INSTRUCTION_ID_JUMP, INSTRUCTION_ID_WAIT,  
        INSTRUCTION_ID_ASSPULL, 
        INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_RIGHT, 
        INSTRUCTION_ID_JUMP, INSTRUCTION_ID_WAIT,  
        INSTRUCTION_ID_EJECT
    ];
    const script2 = [
        INSTRUCTION_ID_ASSPULL, 
        INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_LEFT, 
        INSTRUCTION_ID_JUMP, INSTRUCTION_ID_WAIT, 
        INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_RIGHT, 
        INSTRUCTION_ID_DROP, INSTRUCTION_ID_WAIT, 
        INSTRUCTION_ID_ASSPULL, 
        INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_LEFT, 
        INSTRUCTION_ID_JUMP, INSTRUCTION_ID_WAIT,  
        INSTRUCTION_ID_DROP, INSTRUCTION_ID_WAIT, 
        INSTRUCTION_ID_ASSPULL, 
        INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_RIGHT, 
        INSTRUCTION_ID_JUMP, INSTRUCTION_ID_WAIT,  
        INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_RIGHT, 
        INSTRUCTION_ID_EJECT
    ];
    const asspulls: Asspull[] = [
        crateFactory as Asspull, 
        crateFactory as Asspull, 
        tapeFactoryFactory(script2, HUE_TAPE_SET_2, undefined, 2) as Asspull, 
        gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_2)) as Asspull, 
        gunFactoryFactory(robotFactoryFactory(ORIENTATION_RIGHT, HUE_TAPE_SET_4)) as Asspull,
        tapeFactoryFactory(script1, HUE_TAPE_SET_1, undefined, 2) as Asspull, 
    ];
    const bossAsspull = () => {
        let asspullIndex = 0;
        return (x, y, id) => asspulls[(asspullIndex++)%asspulls.length](x, y, id);
    };

    const roomFactories: RoomFactory[][] = [
        [
            // 0, 0
            ,
            // 1, 0
            ,
            // 2, 0
            ,
            // 3, 0
            legendRoomFactory(
                {...baseLegend,
                    'C': sceneryFactoryFactory('🏰', 3), 
                    'T': sceneryFactoryFactory('Fin', 2), 
                    'B': tapeFactoryFactory([
                        INSTRUCTION_ID_WAIT, INSTRUCTION_ID_COUNT_4, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_WAIT, INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_RIGHT,                         
                        ...script1 

                    ], HUE_TAPE_SET_1, bossFactoryFactory(HUE_TAPE_SET_3, undefined, bossAsspull), 2), 
                }, 
                '                  ' + 
                '                  ' +
                '                  ' +
                '         T        ' +
                '                  ' +
                '                  ' +
                '                  ' +
                '                  ' +
                '                  ' +
                '      C     B     ' +
                ' O O O O OzzzO OO ' +
                'UO U U U U U U U U' +
                'zzzzzzz    zzzzzzz',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_5, 
            ), 
        ],         
        [
            // 0, 0
            ,
            // 1, 0
            ,
            // 2, 0
            ,
            // 3, 0
            legendRoomFactory( 
                {...baseLegend,
                    'Z': blockFactoryFactory(HSL_AREA_3_BLOCKS, 3, 1, .5), 
                    'F': platformFactoryFactory(6, 1, EDGE_RIGHT, HUE_TAPE_SET_1), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_COUNT_6, INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_BOTTOM)), 
                    '2': tapeFactoryFactory([INSTRUCTION_ID_COUNT_6, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_BOTTOM)), 
                    '3': tapeFactoryFactory([,,,,INSTRUCTION_ID_INSERT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_BOTTOM)), 
                    '5': tapeFactoryFactory([INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_SHOOT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_RIGHT)), 
                    '6': tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_SHOOT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_LEFT)), 
                    '7': tapeFactoryFactory([INSTRUCTION_ID_COUNT_5, INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_BOTTOM)), 
                    '8': tapeFactoryFactory([INSTRUCTION_ID_COUNT_5, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_BOTTOM)), 
        //'P': persistentEntityFactoryFactory(playerFactory, PLAYER_PERSISTENT_ID), 

                }, 
                'zzzzzzz    zzzzzzz' + 
                'z3  7  2  1  8  3z' +
                'z                z' +
                'z                z' +
                'Z                Z' +
                '5     F          6' +
                'z                z' +
                'z                z' +
                'zzz            zzz' +
                'z                z' +
                'z                z' +
                'zzvvvvzz  zzvvvvzz' +
                'zzzzzzz    zzzzzzz',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_4, 
            ), 
        ], 
        [
            // 0, 0
            ,
            // 1, 0
            ,
            // 2, 0
            ,
            // 3, 0
            legendRoomFactory(
                {...baseLegend,
                    'F': platformFactoryFactory(4, 1, EDGE_TOP, HUE_TAPE_SET_5), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_COUNT_9, INSTRUCTION_ID_UP], HUE_TAPE_SET_5, pressurePlateFactoryFactory(1, 1, HSL_AREA_3_BLOCKS, EDGE_RIGHT)), 
                }, 
                'zzzzzzz    zzzzzzz' + 
                'z    yy          z' +
                'z     y          z' +
                'z                z' +
                '1                z' +
                'z      F         z' +
                'z         yy     z' +
                'z          yy    z' +
                'z           yy   z' +
                'z            yy  z' +
                'z                z' +
                'z              yyz' +
                'zzzzzzz       yyzz',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_3, 
            ), 
        ], 
        [
            // 0, 1
            legendRoomFactory(
                {...baseLegend, 
                    't': tapeFactoryFactory([INSTRUCTION_ID_UP, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_4), 
                    'B': tapeFactoryFactory(
                        [INSTRUCTION_ID_WAIT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_WAIT, INSTRUCTION_ID_DROP, INSTRUCTION_ID_WAIT, INSTRUCTION_ID_COUNT_9, INSTRUCTION_ID_LEFT], 
                        HUE_TAPE_SET_1, 
                        bossFactoryFactory(HUE_TAPE_SET_3, persistentEntityFactoryFactory(playerFactory, PLAYER_PERSISTENT_ID)), 
                        2
                    ), 
                }, 
                '                  ' + 
                '  O               ' +
                ' B         O      ' + 
                'yyy   U           ' + 
                'ooo         aT  T ' +
                'ooo         oooooo' +
                'ooo         oooooo' +
                'ooo        Foooooo' +
                'oooo       ooooooo' +
                'ooooooooooooo    o' +
                'oooooooooooo      ' +
                'ooooooooooooo  t  ' +
                'oooooooooooooooooo',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_0, 
            ),                
            // 1, 1
            legendRoomFactory(
                {...baseLegend, 
                    'R': robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_1), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_COUNT_1, INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_COUNT_1, INSTRUCTION_ID_COUNT_5, INSTRUCTION_ID_RIGHT,,,,,,,], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_5)), 
                    'p': platformFactoryFactory(2, 1, EDGE_RIGHT, HUE_TAPE_SET_4), 
                    'M': tapeFactoryFactory([INSTRUCTION_ID_SAVE], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_LEFT)), 
                }, 
                '                  ' + 
                '         O        ' + 
                '      a           ' + 
                '     oo      M    ' + 
                ' T T  R      ym  T' + 
                'ooooooo      yyooo' +
                'ooooooo    1 yoooo' +
                'oooooooooooooooooo' +
                'oooooooooooooooooo' +
                'ooo            ooo' +
                '     p            ' +
                '    yvvvvvvvv     ' +
                'o  yyyyyyyyyyyyyyy',
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
                '    O          yyy' +
                '         U     3yy' + 
                '                  ' + 
                'T                 ' + 
                'oo           yyyyy' + 
                'ooc         C yyyy' + 
                'ooo           yyyy' +
                'ooob     B    2yyy' +
                'oooo              ' +
                '   oa A        1yy' +
                '   oovvvvvvvvvvyyy' +
                'yy oooooooooooooyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_0, 
            ),                
            // 3, 1
            legendRoomFactory(
                {...baseLegend,
                    'd': platformFactoryFactory(1, 5, EDGE_TOP, HUE_TAPE_SET_1),
                    'U': tapeFactoryFactory([INSTRUCTION_ID_UP,INSTRUCTION_ID_UP,INSTRUCTION_ID_UP,INSTRUCTION_ID_UP,INSTRUCTION_ID_SAVE], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'D': tapeFactoryFactory([INSTRUCTION_ID_DOWN,INSTRUCTION_ID_DOWN,INSTRUCTION_ID_DOWN,INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_LEFT)), 
                    'P': persistentEntityFactoryFactory(platformFactoryFactory(1, 1, EDGE_TOP, HUE_TAPE_SET_3), PERSISTENT_ID_TUTORIAL_END_3),
                    'h': platformFactoryFactory(1, 1, EDGE_RIGHT, HUE_TAPE_SET_2),
                    'H': tapeFactoryFactory([INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_2, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'S': persistentEntityFactoryFactory(platformFactoryFactory(2, 1, EDGE_TOP, HUE_TAPE_SET_4), PERSISTENT_ID_TUTORIAL_END_2),
                }, 
                'yyyyyyy       yyyy' + 
                'yha ydyI     yyy  ' +
                'y y y yy    yy y  ' + 
                '               yPy' + 
                '             Z   y' + 
                'yyyH  U yyyS     y' + 
                'y         yyy   yy' + 
                'ym         yyy   y' +
                'yyyyy            y' +
                '    y yyyyyyyyyyyy' +
                'y   D            y' +
                'yyyyyy           y' +
                'yyyyyyyy  yyyyyyyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_1, 
            ),                
            // 4, 1
            legendRoomFactory(
                {...baseLegend,
                    '1': tapeFactoryFactory([INSTRUCTION_ID_COUNT_3, INSTRUCTION_ID_COUNT_0, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_5, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    't': tapeFactoryFactory([INSTRUCTION_ID_COUNT_1, INSTRUCTION_ID_COUNT_0, INSTRUCTION_ID_EJECT], HUE_TAPE_SET_5), 
                    'T': tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DROP], HUE_TAPE_SET_3),                     
                }, 
                'yyyyyyyyyyyyyyyyyy' + 
                '             y  1y' +
                '           t y   y' +
                'yyyy yyyyyyyyy   y' +
                'y         yyy    y' +
                'y         1yy y  y' +
                'y    yyy         y' +
                'y    yyyyyy      y' +
                'y    yyyyyy      y' +
                'y    yyyyyy      y' +
                'y    yyyyyyyy    y' +
                'yT   yyyyyyyy    y' +
                'yyy  yyyyyyyy    y',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_1, 
            ),                

        ],
        [
            // 0, 2
            ,             
            // 1, 2
            legendRoomFactory(
                {...baseLegend, 
                    'Y': blockFactoryFactory(HSL_AREA_1_BLOCKS, 1, .8, .6), 
                    '0': tapeFactoryFactory([INSTRUCTION_ID_UP, INSTRUCTION_ID_UP, INSTRUCTION_ID_UP,,, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_5)), 
                    '1': tapeFactoryFactory([INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN, INSTRUCTION_ID_DOWN,INSTRUCTION_ID_UP, INSTRUCTION_ID_UP, INSTRUCTION_ID_UP], HUE_TAPE_SET_2, repeaterFactoryFactory(HUE_TAPE_SET_5)), 
                    '2': platformFactoryFactory(2, .5, EDGE_LEFT, HUE_TAPE_SET_2),
                    '3': platformFactoryFactory(2, .5, EDGE_RIGHT, HUE_TAPE_SET_1), 
                    '4': platformFactoryFactory(1, 4, EDGE_TOP, HUE_TAPE_SET_1), 
                    '5': platformFactoryFactory(1, 4, EDGE_BOTTOM, HUE_TAPE_SET_2), 
                    '6': compositeEntityFactoryFactory([tapeFactoryFactory([INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT,INSTRUCTION_ID_LEFT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT,INSTRUCTION_ID_RIGHT,,], HUE_TAPE_SET_1, repeaterFactoryFactory(HUE_TAPE_SET_5)), spikeFactory]), 
                    '7': compositeEntityFactoryFactory([tapeFactoryFactory([INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT, INSTRUCTION_ID_RIGHT,, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT, INSTRUCTION_ID_LEFT], HUE_TAPE_SET_2, repeaterFactoryFactory(HUE_TAPE_SET_5)), spikeFactory]), 
                }, 
                'y   yyyyyyyyyyyyyy' + 
                'yy  y  5 5 5 5   y' +
                'y   yy         1 y' + 
                'y  yy             ' + 
                'y   y y 4 4 4 yyyy' + 
                'y   y            y' + 
                'y4  yy           y' +
                'y   y0           y' +
                'y  YYYYYYYYYYyy  y' +
                'y         2      y' +
                'yy2           3  y' +
                'y7vvvvvvvvvvvvvv6y' +
                'yyyyyyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_2,
            ), 
            // 2, 2
            legendRoomFactory(
                {...baseLegend, 
                    'M': tapeFactoryFactory([INSTRUCTION_ID_SAVE], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'R': gunFactoryFactory(robotFactoryFactory(ORIENTATION_RIGHT, HUE_TAPE_SET_1)), 
                    'd': platformFactoryFactory(1, 2, EDGE_TOP, HUE_TAPE_SET_1), 
                    'D': tapeFactoryFactory([INSTRUCTION_ID_UP, INSTRUCTION_ID_COUNT_6, INSTRUCTION_ID_SHOOT, INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'c': tapeFactoryFactory([INSTRUCTION_ID_COUNT_1], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_RIGHT)), 
                }, 
                'yy  yyyyyyyyyyyyyy' + 
                'yy                ' +
                'yyyyyyyyyyyyyyyyyy' + 
                '       yy       yy' + 
                'yy     y         y' +
                'y     my   yyy   y' +
                'y yyM yy    y    y' +
                'y  yyyyyy   y   yy' +
                'yy yy       y     ' +
                'y  yc      yy     ' +
                'y yyyyyyyyyyyd  yy' +
                'y R             yy' +
                'yyyyyyyyyyyyyyD yy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_2, 
            ),             
            // 3, 2
            legendRoomFactory(
                {...baseLegend, 
                    '1': tapeFactoryFactory([,INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_5, repeaterFactoryFactory(HUE_TAPE_SET_5)), 
                    '2': tapeFactoryFactory([INSTRUCTION_ID_LEFT,], HUE_TAPE_SET_5, repeaterFactoryFactory(HUE_TAPE_SET_5)), 
                    'a': platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_1), 
                    'A': tapeFactoryFactory([INSTRUCTION_ID_UP], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    '3': tapeFactoryFactory([INSTRUCTION_ID_DOWN], HUE_TAPE_SET_1, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'b': platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_2), 
                    'B': tapeFactoryFactory([INSTRUCTION_ID_UP], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    '4': tapeFactoryFactory([INSTRUCTION_ID_DOWN], HUE_TAPE_SET_2, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS)), 
                    'c': persistentEntityFactoryFactory(platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_4), PERSISTENT_ID_LEFT_RIGHT_ROOM_1), 
                    'd': persistentEntityFactoryFactory(platformFactoryFactory(1, 2, EDGE_BOTTOM, HUE_TAPE_SET_3), PERSISTENT_ID_LEFT_RIGHT_ROOM_2), 
                    'R': compositeEntityFactoryFactory([robotFactoryFactory(ORIENTATION_RIGHT, HUE_TAPE_SET_5), spikeFactory]),
                }, 
                'yyyyyyyy  yyyyyyyy' + 
                '    2c      d1    ' + 
                'y yby   yy   yay  ' + 
                'y y y        y y y' +
                'y yyyy4    3yyyy y' + 
                'y y     BA     y y' + 
                'y                y' + 
                'yByyy  yyyy  yyyAy' +
                '    yy      yy    ' +
                '                  ' +
                'yy yvvvvRvvvvvy yy' +
                'y  yyyyyyyyyyyy  y' +
                'y3yyyyyyyyyyyyyy4y',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_2, 
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
                    'Q': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_3, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'd': gunFactoryFactory(robotFactoryFactory(ORIENTATION_LEFT, HUE_TAPE_SET_4)),
                    'D': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    '4': tapeFactoryFactory([INSTRUCTION_ID_SHOOT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_RIGHT)), 
                    '$': tapeFactoryFactory([INSTRUCTION_ID_LEFT], HUE_TAPE_SET_4, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'e': persistentEntityFactoryFactory(platformFactoryFactory(1, 6, EDGE_BOTTOM, HUE_TAPE_SET_5), PERSISTENT_ID_GUN_ROOM_1), 
                    'f': platformFactoryFactory(1, 1, EDGE_BOTTOM, HUE_TAPE_SET_5), 
                    'g': persistentEntityFactoryFactory(platformFactoryFactory(1, 7, EDGE_BOTTOM, HUE_TAPE_SET_5), PERSISTENT_ID_GUN_ROOM_2), 
                    'E': tapeFactoryFactory([INSTRUCTION_ID_COUNT_2, INSTRUCTION_ID_COUNT_0, INSTRUCTION_ID_UP,,,], HUE_TAPE_SET_5, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                    'l': persistentEntityFactoryFactory(platformFactoryFactory(4, 1, EDGE_RIGHT, HUE_TAPE_SET_5), PERSISTENT_ID_GUN_ROOM_3),
                    'k': platformFactoryFactory(1, 1, EDGE_RIGHT, HUE_TAPE_SET_5),
                    'L': tapeFactoryFactory([INSTRUCTION_ID_COUNT_6, INSTRUCTION_ID_RIGHT], HUE_TAPE_SET_5, pressurePlateFactoryFactory(1, 1, HSL_AREA_1_BLOCKS, EDGE_BOTTOM)), 
                    'm': mainframeFactoryFactory(HUE_TAPE_SET_5),
                    'M': tapeFactoryFactory([INSTRUCTION_ID_SAVE], HUE_TAPE_SET_5, pressurePlateFactoryFactory(2, 1, HSL_AREA_1_BLOCKS)), 
                }, 
                'yyy eyy$2Qyyyg   y' + 
                '  y       y      y' + 
                'l        Ly     ay' + 
                'y1              fy' +
                'yyy  A         b y' + 
                'yyk     B      yyy' + 
                'yyy4          c  y' +
                'yyy   yyy    yyyyy' + 
                '  y3            dy' +
                '  y           yyyy' +
                'y yyy4       yy  y' +
                'y        E      my' +
                'yyM yyyyyyyyyyyyyy',
                MAX_TILES_ACROSS, 
                BACKGROUND_AREA_2, 
            ), 
        ],        
    ];
    // NOTE: the x/y s are reversed
    const result: RoomFactoryMetadata = {
        factory: (rx: number, ry: number, id: IdFactory) => {
            const factory = roomFactories[ry][rx];
            return factory && factory(rx, ry, id);
        },
        worldWidth: 5, 
        worldHeight: 5, 
    }
    return result;
}

const legendRoomFactory = (legend: Legend, roomDefinition: string, width: number, background: HSL[] = [[0, 0, 30]]) => {
    const adjustedWidth = width + 1;
    const height = ((roomDefinition.length / width) | 0) + 1;
    const halfBlockFactory = blockFactoryFactory(HSL_AREA_0_BLOCKS);
    return (x: number, y: number, id: IdFactory) => {
        const room: Room = {
            allEntities: [], 
            bounds: [x, y, adjustedWidth, height], 
            gravity: DEFAULT_GRAVITY, 
            tiles: array2DCreate(adjustedWidth, height, () => []), 
            updatableEntities: [], 
            soundWaves: [], 
            bg: background, 
        };
        roomDefinition.split('').forEach((c, i) => {
            const tx = i % width + 1;
            const ty = ((i / width) | 0) + 1;
            const entityFactory = legend[c];
            if (entityFactory) {
                const entities = entityFactory(tx, ty, id);
                entities.forEach(entity => {
                    // adjust 
                    const everyEntity = entity as EveryEntity;
                    if (everyEntity.gravityMultiplier && everyEntity.mass) {
                        everyEntity.bounds[1] -= MAX_ROUNDING_ERROR_SIZE;
                    }
                    roomAddEntity(room, entity);
                    if (ty == 1 && (entity.entityType == ENTITY_TYPE_BLOCK || entity.entityType == ENTITY_TYPE_PRESSURE_PLATE)) {
                        // want to add in a half block at the top to stop the player from walking around on the roof
                        const halfBlock = halfBlockFactory(tx, 0, id)[0]
                        halfBlock.bounds[1] -= .5;
                        roomAddEntity(room, halfBlock);
                    }
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