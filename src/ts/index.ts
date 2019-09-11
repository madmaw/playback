///<reference path="flags.ts"/>
///<reference path="constants.ts"/>
///<reference path="common/graphics.ts"/>
///<reference path="common/inputs.ts"/>
///<reference path="game/entities.ts"/>

onload = () => {
    const audioContext = new AudioContext();
    const {
        factory, 
        worldHeight: height, 
        worldWidth: width, 
    } = roomFactoryFactory();
    let world: World;
    const recreateWorld = () => {
        world = createWorld(audioContext, width, height, factory);
    };
    recreateWorld();

    let context: CanvasRenderingContext2D;
    let scale: number;
    let clientWidth: number; 
    let clientHeight: number;
    const elements = [c, o, s];
    const resize = () => {
        const aspectRatio = innerWidth/innerHeight;
        const targetWidth = MAX_TILES_ACROSS - EDGE_HIDE_PROPORTION*2;
        const targetHeight = MAX_TILES_DOWN - EDGE_HIDE_PROPORTION*2;
        scale = Math.floor((aspectRatio < targetWidth/targetHeight
            ? innerWidth/targetWidth
            : innerHeight/targetHeight)/SCALING_JUMP) * SCALING_JUMP;
        // for some reason, fonts don't render when scale is a multiple of 5!?
        if (FLAG_CHROME_FONT_HACK && !(scale % 5)) {
            scale--;
        }
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
        let delta = Math.min((now||0) - (then||0), MAX_DELTA * 3) + remainder;
        const inputs = world.player.activeInputs;
        inputs.states = {};
        for (let keyCode in INPUT_KEY_CODE_MAPPINGS) {
            const input = INPUT_KEY_CODE_MAPPINGS[keyCode];
            inputs.states[input] = Math.max(inputs.states[input] || 0, activeKeyCodes[keyCode] || 0);
        }
        for(;;) {
            // const d = Math.max(Math.min(MAX_DELTA, delta), MIN_DELTA);
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
        renderPlayer(world.player, world);
        requestAnimationFrame(update);
        then = now;
    };    
    update();
};

const renderPlayer = (player: Player, world: World) => {
    o.style.opacity = player.deathAge ? '1' : '0';
    if (world.lastSaved > world.age - MESSAGE_DISPLAY_TIME) {
        s.style.opacity = '1';
    } else {
        s.style.opacity = '0';
    }
    if (FLAG_HELP) {
        if (player.commandsVisible) {
            h.style.opacity = '1';
            // render out all the commands
            h.innerHTML = INSTRUCTIONS.map((instruction, instructionId) => {
                if( player.capabilities.indexOf(instructionId) >= 0 && instruction.keyCodes ) {
                    return `<b>${instructionToKey(instruction)}${instruction.hold?'+hold':''}</b>) ${instructionToName(instructionId)}<br>`
                }
                return '';
            }).join('');
        } else {
            h.style.opacity = '0';
        }    
    }
}
