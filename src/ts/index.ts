///<reference path="flags.ts"/>
///<reference path="common/constants.ts"/>
///<reference path="common/graphics.ts"/>
///<reference path="common/inputs.ts"/>
///<reference path="game/entities.ts"/>

onload = () => {
    const audioContext = new AudioContext();
    const {
        factory, 
        height, 
        width, 
        playerRoomX, 
        playerRoomY, 
        playerX, 
        playerY, 
    } = roomFactoryFactory();
    let world: World;
    const recreateWorld = () => {
        const player: Player = {
            graphic: playerGraphic, 
            palette: playerPalette, 
            entityType: ENTITY_TYPE_PLAYER, 
            bounds: rectangleCenterBounds(playerX, playerY, .6, .8),
            // only collide with robots on the bottom or top
            // don't collide with items at all
            collisionMask: COLLISION_MASK_PLAYER, 
            collisionGroup: COLLISION_GROUP_PLAYER, 
            gravityMultiplier: 1, 
            orientation: ORIENTATION_RIGHT, 
            orientationStartTime: 0, 
            id: -1,
            mass: 1, 
            velocity: [0, 0], 
            lastCollisions: [0, 0, 0, 0, 0],
            baseVelocity: BASE_VELOCITY, 
            boundsWithVelocity: [0, 0, 0, 0], 
            airTurn: 1, 
            inputs: {
                reads: {}, 
                states: {}, 
            }, 
            holding: new Map<number, MovableEntity>(),  
            handJointId: PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND,
            insertionJointId: PLAYER_GRAPHIC_JOINT_ID_TAPE_DECK,
            instructionsHeard: [], 
            toSpeak: [], 
            learnedInstructions: new Set([INSTRUCTION_ID_HELP]), 
        };    
        world = createWorld(audioContext, width, height, factory, player, playerRoomX, playerRoomY);
    };
    recreateWorld();

    let context: CanvasRenderingContext2D;
    let scale: number;
    let clientWidth: number; 
    let clientHeight: number;
    const elements = [c, o, h];
    const resize = () => {
        const aspectRatio = innerWidth/innerHeight;
        const targetWidth = MAX_TILES_ACROSS - EDGE_HIDE_PROPORTION*2;
        const targetHeight = MAX_TILES_DOWN - EDGE_HIDE_PROPORTION*2;
        scale = Math.floor((aspectRatio < targetWidth/targetHeight
            ? innerWidth/targetWidth
            : innerHeight/targetHeight)/SCALING_JUMP) * SCALING_JUMP;
        clientWidth = targetWidth * scale;
        clientHeight = targetHeight * scale;
        c.width = clientWidth;
        c.height = clientHeight;
        context = c.getContext('2d');
        context.textAlign = 'center';
        context.font = `${SPEECH_TEXT_HEIGHT}px fantasy`;
        context.lineWidth = 1/scale; 
        if (FLAG_IMAGE_SMOOTHING_DISABLED) {
            context.imageSmoothingEnabled = false;
        }
        elements.forEach(e => e.setAttribute('style', `width:${clientWidth}px;height:${clientHeight}px`));
    }
    onresize = resize;
    resize();

    const activeKeyCodes: {[_:number]: number} = {
        // 65: 1, 
    };

    onkeydown = (e: KeyboardEvent) => {
        if (FLAG_AUDIO_CONTEXT_RESUME) {
            audioContext.resume();
        }
        activeKeyCodes[e.keyCode] = activeKeyCodes[e.keyCode] 
            ? activeKeyCodes[e.keyCode] 
            : world.age;
    };

    onkeyup = (e: KeyboardEvent) => {
        activeKeyCodes[e.keyCode] = 0;
    };

    let then: number | undefined;
    let remainder = 0;
    const update = (now?: number) => {
        let delta = Math.min((now||0) - (then||0), MAX_DELTA * 2) + remainder;
        const inputs = world.player.inputs;
        inputs.states = {};
        for (let keyCode in INPUT_KEY_CODE_MAPPINGS) {
            const input = INPUT_KEY_CODE_MAPPINGS[keyCode];
            inputs.states[input] = Math.max(inputs.states[input] || 0, activeKeyCodes[keyCode] || 0);
        }
        for(;;) {
            //const d = Math.max(Math.min(MAX_DELTA, delta), MIN_DELTA);
            let d = MAX_DELTA;
            if(delta < d) {
                break;
            };
            delta -= d;
            const render = delta < MAX_DELTA;
            if (render) {
                context.clearRect(0, 0, clientWidth, clientHeight);
                context.save();
                context.scale(scale, scale); 
                context.translate(-EDGE_HIDE_PROPORTION, -EDGE_HIDE_PROPORTION);
                context.beginPath();
            }
            updateAndRenderWorld(context, world, d, render);
            if (render) {
                context.restore();
            }
        }
        remainder = delta;
        if (world.player.deathAge && readInput(world.player, INSTRUCTION_ID_JUMP, world.age)) {
            recreateWorld();   
        }
        // game over, help, etc...
        renderPlayer(world.player, world.age);
        requestAnimationFrame(update);
        then = now;
    };    
    update();
};

const renderPlayer = (player: Player, worldAge: number) => {
    o.style.opacity = player.deathAge ? '1' : '0' 
    if (player.commandsVisible) {
        h.style.opacity = '1';
        // render out all the commands
        h.innerHTML = INSTRUCTIONS.map((instruction, instructionId) => {
            if( player.learnedInstructions.has(instructionId)) {
                return `<b>${instructionToKey(instruction)}</b>) ${instructionToName(instructionId)}<br>`
            }
            return '';
        }).join('');
    } else {
        h.style.opacity = '0';
    }
    if (player.lastLearnedAt > worldAge - LEARN_INSTRUCTION_DISPLAY_TIME) {
        l.innerHTML = `New ability<br><i>${instructionToName(player.lastLearnedInstructionId).toUpperCase()}`
        l.style.opacity = '1';
    } else {
        l.style.opacity = '0';
    }
}
