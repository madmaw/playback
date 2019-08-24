///<reference path="common/constants.ts"/>
///<reference path="common/graphics.ts"/>
///<reference path="common/inputs.ts"/>
///<reference path="game/entities.ts"/>



onload = () => {

    const startX = 4;
    const startY = 0;
    let nextId = 0;
    let roomFactory1 = (rx, ry) => {
        let sourceRoom: Room = JSON.parse(
            '{"allEntities":[{"id":880,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[0,11,1,1]},{"id":881,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[1,11,1,1]},{"id":882,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[2,11,1,1]},{"id":883,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[3,11,1,1]},{"id":884,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[5,11,1,1],"grabbing":0,"timeRemaining":17.256880733945792},{"id":885,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[6,11,1,1],"grabbing":0,"timeRemaining":17.256880733936978},{"id":886,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[7,11,1,1],"grabbing":0,"timeRemaining":17.27429465779737},{"id":887,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[8,11,1,1],"grabbing":0,"timeRemaining":17.270411719291797},{"id":888,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[9,11,1,1],"grabbing":0,"timeRemaining":17.27271289304698},{"id":889,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[10,11,1,1],"grabbing":0,"timeRemaining":17.27271289304698},{"id":890,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[11,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078},{"id":891,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[12,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078},{"id":892,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[13,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078},{"id":893,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[14,11,1,1],"grabbing":0,"timeRemaining":17.25508260773223},{"id":894,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[15,11,1,1]},{"id":895,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[16,11,1,1]},{"id":896,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[17,11,1,1]},{"entityType":1,"bounds":[5.777580105518023,10.197892410341952,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":898,"lastCollisions":[0,3116,10732.456939883361,179605.25688073394,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[0,-0.00012090909090909089],"baseVelocity":0.003,"boundsWithVelocity":[5.777580105518023,10.197892410341952,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"885":1},"timeRemaining":0},{"entityType":1,"bounds":[8.656368150983663,10.172080539123408,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":899,"lastCollisions":[11871.513761801438,10391.958060828943,179603.51376096992,179415.27271289306,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[-0.005999080633019268,0.006239545454545451],"baseVelocity":0.003,"boundsWithVelocity":[8.656368150983663,10.172080539123408,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"897":1},"timeRemaining":0,"targetAnimationId":1},{"graphic":{"width":30,"height":36,"palette":[[0,100,50]],"images":[[[-6,-16,12,12,0],[-3,-4,6,6,0]],[[-15,-7,30,14,0]],[[-2,-2,4,12,0]]],"joints":[{"id":0,"imageIndex":1,"x":0,"y":18,"children":[{"id":1,"imageIndex":0,"x":10,"y":-7,"children":[]},{"id":2,"imageIndex":2,"x":-8,"y":7,"children":[]},{"id":3,"imageIndex":2,"x":8,"y":7,"children":[]}]}],"poses":[{"0":[{"transformType":2,"rotation":0.3490658503988659}],"2":[{"transformType":1,"dx":0,"dy":-6}]},{"0":[{"transformType":2,"rotation":-0.3490658503988659}],"3":[{"transformType":1,"dx":0,"dy":-6}]},{"2":[{"transformType":2,"rotation":0.39269908169872414}],"3":[{"transformType":2,"rotation":-0.39269908169872414}]}],"animations":{"0":{"poseDuration":200,"poseIds":[0,1]},"1":{"poseDuration":100,"poseIds":[2],"repeat":1}}},"entityType":0,"bounds":[9.456371356116165,10.05519704679749,0.6,0.8],"checkedCollisionGroups":1,"collisionGroup":2,"gravityMultiplier":1,"orientation":0,"orientationStartTime":179151,"id":897,"mass":1,"velocity":[-0.0059988763292457715,0.006239545454545451],"lastCollisions":[179603.51376096992,0,11871.513761801438,0,0],"baseVelocity":0.006,"boundsWithVelocity":[9.456371356116165,10.05519704679749,0.6,0.8],"slipperiness":0.5,"grabbing":0,"entityCollisionCount":{"899":1},"timeRemaining":0,"targetAnimationId":1,"currentAnimationId":1,"currentAnimationStartTime":179398,"previousPoseId":1,"currentPoseId":2}],"updatableEntities":[{"entityType":1,"bounds":[5.777580105518023,10.197892410341952,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":898,"lastCollisions":[0,3116,10732.456939883361,179605.25688073394,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[0,-0.00012090909090909089],"baseVelocity":0.003,"boundsWithVelocity":[5.777580105518023,10.197892410341952,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"885":1},"timeRemaining":0},{"entityType":1,"bounds":[8.656368150983663,10.172080539123408,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":899,"lastCollisions":[11871.513761801438,10391.958060828943,179603.51376096992,179415.27271289306,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[-0.005999080633019268,0.006239545454545451],"baseVelocity":0.003,"boundsWithVelocity":[8.656368150983663,10.172080539123408,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"897":1},"timeRemaining":0,"targetAnimationId":1},{"graphic":{"width":30,"height":36,"palette":[[0,100,50]],"images":[[[-6,-16,12,12,0],[-3,-4,6,6,0]],[[-15,-7,30,14,0]],[[-2,-2,4,12,0]]],"joints":[{"id":0,"imageIndex":1,"x":0,"y":18,"children":[{"id":1,"imageIndex":0,"x":10,"y":-7,"children":[]},{"id":2,"imageIndex":2,"x":-8,"y":7,"children":[]},{"id":3,"imageIndex":2,"x":8,"y":7,"children":[]}]}],"poses":[{"0":[{"transformType":2,"rotation":0.3490658503988659}],"2":[{"transformType":1,"dx":0,"dy":-6}]},{"0":[{"transformType":2,"rotation":-0.3490658503988659}],"3":[{"transformType":1,"dx":0,"dy":-6}]},{"2":[{"transformType":2,"rotation":0.39269908169872414}],"3":[{"transformType":2,"rotation":-0.39269908169872414}]}],"animations":{"0":{"poseDuration":200,"poseIds":[0,1]},"1":{"poseDuration":100,"poseIds":[2],"repeat":1}}},"entityType":0,"bounds":[9.456371356116165,10.05519704679749,0.6,0.8],"checkedCollisionGroups":1,"collisionGroup":2,"gravityMultiplier":1,"orientation":0,"orientationStartTime":179151,"id":897,"mass":1,"velocity":[-0.0059988763292457715,0.006239545454545451],"lastCollisions":[179603.51376096992,0,11871.513761801438,0,0],"baseVelocity":0.006,"boundsWithVelocity":[9.456371356116165,10.05519704679749,0.6,0.8],"slipperiness":0.5,"grabbing":0,"entityCollisionCount":{"899":1},"timeRemaining":0,"targetAnimationId":1,"currentAnimationId":1,"currentAnimationStartTime":179398,"previousPoseId":1,"currentPoseId":2}],"tiles":[[[],[],[],[],[],[],[],[],[],[],[],[{"id":880,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[0,11,1,1]}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":880,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[0,11,1,1]},{"id":881,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[1,11,1,1]}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":881,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[1,11,1,1]},{"id":882,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[2,11,1,1]}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":882,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[2,11,1,1]},{"id":883,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[3,11,1,1]}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":883,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[3,11,1,1]}]],[[],[],[],[],[],[],[],[],[],[],[{"entityType":1,"bounds":[5.777580105518023,10.197892410341952,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":898,"lastCollisions":[0,3116,10732.456939883361,179605.25688073394,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[0,-0.00012090909090909089],"baseVelocity":0.003,"boundsWithVelocity":[5.777580105518023,10.197892410341952,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"885":1},"timeRemaining":0}],[{"id":884,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[5,11,1,1],"grabbing":0,"timeRemaining":17.256880733945792}]],[[],[],[],[],[],[],[],[],[],[],[{"entityType":1,"bounds":[5.777580105518023,10.197892410341952,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":898,"lastCollisions":[0,3116,10732.456939883361,179605.25688073394,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[0,-0.00012090909090909089],"baseVelocity":0.003,"boundsWithVelocity":[5.777580105518023,10.197892410341952,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"885":1},"timeRemaining":0}],[{"id":884,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[5,11,1,1],"grabbing":0,"timeRemaining":17.256880733945792},{"id":885,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[6,11,1,1],"grabbing":0,"timeRemaining":17.256880733936978}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":886,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[7,11,1,1],"grabbing":0,"timeRemaining":17.27429465779737},{"id":885,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[6,11,1,1],"grabbing":0,"timeRemaining":17.256880733936978}]],[[],[],[],[],[],[],[],[],[],[],[{"entityType":1,"bounds":[8.656368150983663,10.172080539123408,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":899,"lastCollisions":[11871.513761801438,10391.958060828943,179603.51376096992,179415.27271289306,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[-0.005999080633019268,0.006239545454545451],"baseVelocity":0.003,"boundsWithVelocity":[8.656368150983663,10.172080539123408,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"897":1},"timeRemaining":0,"targetAnimationId":1}],[{"id":886,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[7,11,1,1],"grabbing":0,"timeRemaining":17.27429465779737},{"id":887,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[8,11,1,1],"grabbing":0,"timeRemaining":17.270411719291797}]],[[],[],[],[],[],[],[],[],[],[],[{"entityType":1,"bounds":[8.656368150983663,10.172080539123408,0.8,0.8],"checkedCollisionGroups":1,"collisionGroup":1,"gravityMultiplier":1,"id":899,"lastCollisions":[11871.513761801438,10391.958060828943,179603.51376096992,179415.27271289306,0],"mass":1,"nextScriptInstructionTime":180265,"nextScriptIndex":179,"script":[],"velocity":[-0.005999080633019268,0.006239545454545451],"baseVelocity":0.003,"boundsWithVelocity":[8.656368150983663,10.172080539123408,0.8,0.8],"orientation":0,"orientationStartTime":0,"slipperiness":0.1,"grabbing":0,"entityCollisionCount":{"897":1},"timeRemaining":0,"targetAnimationId":1},{"graphic":{"width":30,"height":36,"palette":[[0,100,50]],"images":[[[-6,-16,12,12,0],[-3,-4,6,6,0]],[[-15,-7,30,14,0]],[[-2,-2,4,12,0]]],"joints":[{"id":0,"imageIndex":1,"x":0,"y":18,"children":[{"id":1,"imageIndex":0,"x":10,"y":-7,"children":[]},{"id":2,"imageIndex":2,"x":-8,"y":7,"children":[]},{"id":3,"imageIndex":2,"x":8,"y":7,"children":[]}]}],"poses":[{"0":[{"transformType":2,"rotation":0.3490658503988659}],"2":[{"transformType":1,"dx":0,"dy":-6}]},{"0":[{"transformType":2,"rotation":-0.3490658503988659}],"3":[{"transformType":1,"dx":0,"dy":-6}]},{"2":[{"transformType":2,"rotation":0.39269908169872414}],"3":[{"transformType":2,"rotation":-0.39269908169872414}]}],"animations":{"0":{"poseDuration":200,"poseIds":[0,1]},"1":{"poseDuration":100,"poseIds":[2],"repeat":1}}},"entityType":0,"bounds":[9.456371356116165,10.05519704679749,0.6,0.8],"checkedCollisionGroups":1,"collisionGroup":2,"gravityMultiplier":1,"orientation":0,"orientationStartTime":179151,"id":897,"mass":1,"velocity":[-0.0059988763292457715,0.006239545454545451],"lastCollisions":[179603.51376096992,0,11871.513761801438,0,0],"baseVelocity":0.006,"boundsWithVelocity":[9.456371356116165,10.05519704679749,0.6,0.8],"slipperiness":0.5,"grabbing":0,"entityCollisionCount":{"899":1},"timeRemaining":0,"targetAnimationId":1,"currentAnimationId":1,"currentAnimationStartTime":179398,"previousPoseId":1,"currentPoseId":2}],[{"id":887,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[8,11,1,1],"grabbing":0,"timeRemaining":17.270411719291797},{"id":888,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[9,11,1,1],"grabbing":0,"timeRemaining":17.27271289304698}]],[[],[],[],[],[],[],[],[],[],[],[{"graphic":{"width":30,"height":36,"palette":[[0,100,50]],"images":[[[-6,-16,12,12,0],[-3,-4,6,6,0]],[[-15,-7,30,14,0]],[[-2,-2,4,12,0]]],"joints":[{"id":0,"imageIndex":1,"x":0,"y":18,"children":[{"id":1,"imageIndex":0,"x":10,"y":-7,"children":[]},{"id":2,"imageIndex":2,"x":-8,"y":7,"children":[]},{"id":3,"imageIndex":2,"x":8,"y":7,"children":[]}]}],"poses":[{"0":[{"transformType":2,"rotation":0.3490658503988659}],"2":[{"transformType":1,"dx":0,"dy":-6}]},{"0":[{"transformType":2,"rotation":-0.3490658503988659}],"3":[{"transformType":1,"dx":0,"dy":-6}]},{"2":[{"transformType":2,"rotation":0.39269908169872414}],"3":[{"transformType":2,"rotation":-0.39269908169872414}]}],"animations":{"0":{"poseDuration":200,"poseIds":[0,1]},"1":{"poseDuration":100,"poseIds":[2],"repeat":1}}},"entityType":0,"bounds":[9.456371356116165,10.05519704679749,0.6,0.8],"checkedCollisionGroups":1,"collisionGroup":2,"gravityMultiplier":1,"orientation":0,"orientationStartTime":179151,"id":897,"mass":1,"velocity":[-0.0059988763292457715,0.006239545454545451],"lastCollisions":[179603.51376096992,0,11871.513761801438,0,0],"baseVelocity":0.006,"boundsWithVelocity":[9.456371356116165,10.05519704679749,0.6,0.8],"slipperiness":0.5,"grabbing":0,"entityCollisionCount":{"899":1},"timeRemaining":0,"targetAnimationId":1,"currentAnimationId":1,"currentAnimationStartTime":179398,"previousPoseId":1,"currentPoseId":2}],[{"id":888,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[9,11,1,1],"grabbing":0,"timeRemaining":17.27271289304698},{"id":889,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[10,11,1,1],"grabbing":0,"timeRemaining":17.27271289304698}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":890,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[11,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078},{"id":889,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[10,11,1,1],"grabbing":0,"timeRemaining":17.27271289304698}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":891,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[12,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078},{"id":890,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[11,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":892,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[13,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078},{"id":891,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[12,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":893,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[14,11,1,1],"grabbing":0,"timeRemaining":17.25508260773223},{"id":892,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[13,11,1,1],"grabbing":0,"timeRemaining":17.255313480797078}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":894,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[15,11,1,1]},{"id":893,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[14,11,1,1],"grabbing":0,"timeRemaining":17.25508260773223}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":894,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[15,11,1,1]},{"id":895,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[16,11,1,1]}]],[[],[],[],[],[],[],[],[],[],[],[],[{"id":895,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[16,11,1,1]},{"id":896,"entityType":2,"collisionGroup":1,"checkedCollisionGroups":1,"bounds":[17,11,1,1]}]]],"bounds":[4,0,18,12],"gravity":[0,0.00007]}'
        );
        let room = roomCreate(rx, ry, sourceRoom.bounds[2], sourceRoom.bounds[3])
        sourceRoom.allEntities.forEach(sourceEntity => {
            sourceEntity.id = nextId++;
            (sourceEntity as OrientableEntity).orientation = undefined;
            roomAddEntity(room, sourceEntity);
        });
        return room;
    };
    let roomFactory2 = (rx, ry) => {
        const roomWidth = MAX_TILES_ACROSS;
        const roomHeight = MAX_TILES_DOWN;
        let room: Room = roomCreate(rx, ry, roomWidth, roomHeight);
        for (let i=0; i<room.bounds[2]; i++) {
            if (i % roomWidth != rx) {
                const block1: Block = {
                    id: nextId++,
                    graphic: blockGraphic, 
                    entityType: ENTITY_TYPE_BLOCK, 
                    collisionGroup: COLLISION_GROUP_TERRAIN, 
                    collisionMask: ~0, 
                    bounds: [i, room.bounds[3] - 1, 1, 1], 
                }
                roomAddEntity(room, block1);
                const block2: Block = {
                    id: nextId++,
                    graphic: blockGraphic, 
                    entityType: ENTITY_TYPE_BLOCK, 
                    collisionGroup: COLLISION_GROUP_TERRAIN, 
                    collisionMask: ~0, 
                    bounds: [i, 0, 1, 1], 
                }
                roomAddEntity(room, block2);    
            }
        }
        /*
        for (let i=1; i<room.bounds[3] - 2; i++) {
            const block1: Block = {
                id: nextId++,
                entityType: ENTITY_TYPE_BLOCK, 
                collisionGroup: 0, 
                checkedCollisionGroups: 1, 
                bounds: [0, i, 1, 1], 
            }
            roomAddEntity(room, block1);
    
            const block2: Block = {
                id: nextId++,
                entityType: ENTITY_TYPE_BLOCK, 
                collisionGroup: 0, 
                checkedCollisionGroups: 1, 
                bounds: [room.bounds[2] - 1, i, 1, 1], 
            }
            roomAddEntity(room, block2);
        }
        */
        /*
        for (let i=0; i<10; i++ ) {
            const block: Block = {
                id: nextId++, 
                entityType: ENTITY_TYPE_BLOCK, 
                collisionGroup: 0, 
                checkedCollisionGroups: 1, 
                bounds: [Math.floor(Math.random() * (roomWidth-2)) + 1, Math.floor(Math.random() * (roomHeight-2)) + 1, 1, 1],
            };    
            roomAddEntity(room, block);
        }*/
        //const x = Math.floor(Math.random() * (roomWidth-2)) + 1;
        let x = Math.floor(Math.random() * (roomWidth-2)) + 1;
        let y = Math.floor(Math.random() * (roomHeight-2)) + 1;
        for (let i=0; i<3; i++ ) {
            const crate: Crate = {
                id: nextId++, 
                entityType: ENTITY_TYPE_CRATE, 
                collisionGroup: COLLISION_GROUP_TERRAIN, 
                collisionMask: ~0, 
                bounds: [x+=2, y--, 1, 1],
                boundsWithVelocity: [0, 0, 0, 0], 
                gravityMultiplier: 1, 
                lastCollisions: [0, 0, 0, 0, 0],
                mass: 2, 
                velocity: [0, 0], 
                graphic: crateGraphic, 
            };    
            roomAddEntity(room, crate);
        } 
        const player: Player = {
            graphic: playerGraphic, 
            entityType: ENTITY_TYPE_PLAYER, 
            bounds: [5, 5, .6, .8],
            // only collide with robots on the bottom or top
            // don't collide with items at all
            collisionMask: 0xAF0F, 
            collisionGroup: COLLISION_GROUP_PLAYER, 
            gravityMultiplier: 1, 
            orientation: ORIENTATION_RIGHT, 
            orientationStartTime: 0, 
            id: nextId++,
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
            //handJointId: PLAYER_GRAPHIC_JOINT_ID_RIGHT_HAND,
            handJointId: PLAYER_GRAPHIC_JOINT_ID_TAPE_DECK,
        };
        for( let i=0; i<1; i++ ) {
            const robot: Robot = {
                entityType: ENTITY_TYPE_ROBOT, 
                graphic: robotGraphic, 
                bounds: [10, MAX_TILES_DOWN - 3 - i, .9, .9],
                // only collide with robots on the bottom or top
                // don't collide with items at all
                collisionMask: 0xAF0F, 
                collisionGroup: COLLISION_GROUP_ENEMIES, 
                gravityMultiplier: 1, 
                id: nextId++, 
                lastCollisions: [0, 0, 0, 0, 0],
                mass: 1, 
                nextScriptInstructionTime: 0, 
                nextScriptIndex: 0, 
                script: [
                    INSTRUCTION_LEFT, 
                    INSTRUCTION_LEFT,  
                    INSTRUCTION_LEFT, 
                    INSTRUCTION_RIGHT, 
                    INSTRUCTION_RIGHT, 
                    INSTRUCTION_RIGHT, 
                    INSTRUCTION_COUNT_7, 
                    INSTRUCTION_REWIND,
                ], 
                velocity: [0, 0], 
                baseVelocity: BASE_VELOCITY/3, 
                boundsWithVelocity: [0, 0, 0, 0], 
                orientation: 0, 
                orientationStartTime: 0, 
                inputs: {
                    reads: {}, 
                    states: {}, 
                }, 
                holding: new Map<number, MovableEntity>(),  
                handJointId: ROBOT_GRAPHIC_JOINT_ID_LEFT_HAND, 
            };
            roomAddEntity(room, robot);    
        }
        const tape: Tape = {
            entityType: ENTITY_TYPE_TAPE, 
            graphic: tapeGraphic, 
            bounds: [2, 1, .42, .27], 
            // don't collide with other items
            collisionMask: 0xFF0F, 
            collisionGroup: COLLISION_GROUP_ITEMS, 
            gravityMultiplier: 1, 
            id: nextId++, 
            lastCollisions: [0, 0, 0, 0, 0], 
            mass: .05, 
            boundsWithVelocity: [0, 0, 0, 0], 
            velocity: [0, 0], 
            restitution: .4, 
            orientation: 0,
            orientationStartTime: 0, 
            script: [], 
        }
        const brick: Brick = {
            entityType: ENTITY_TYPE_BRICK, 
            bounds: [1, 1, .5 , .2], 
            // don't collide with other items
            collisionMask: 0xFF0F, 
            collisionGroup: COLLISION_GROUP_ITEMS, 
            gravityMultiplier: 1, 
            id: nextId++, 
            lastCollisions: [0, 0, 0, 0, 0], 
            mass: .05, 
            boundsWithVelocity: [0, 0, 0, 0], 
            velocity: [0, 0], 
            restitution: .4, 
            orientation: 0,
            orientationStartTime: 0, 
        };
        if (false && Math.random() > .4) {
            roomAddEntity(room, brick);
        } else {
            roomAddEntity(room, tape);
        }
        if (rx == startX && ry == startY) {
            roomAddEntity(room, player);
        }
        return room;
    }
    const world = createWorld(MAX_TILES_DOWN_MINUS_1, MAX_TILES_DOWN_MINUS_1, startX, startY, roomFactory2);

    let context: CanvasRenderingContext2D;
    let scale: number;
    let clientWidth: number; 
    let clientHeight: number;
    const resize = () => {
        clientWidth = c.clientWidth;
        clientHeight = c.clientHeight;
        const aspectRatio = clientWidth/clientHeight;
        const targetWidth = MAX_TILES_ACROSS - EDGE_HIDE_PROPORTION*2;
        const targetHeight = MAX_TILES_DOWN - EDGE_HIDE_PROPORTION*2;
        scale = Math.floor((aspectRatio < targetWidth/targetHeight
            ? clientWidth/targetWidth
            : clientHeight/targetHeight)/SCALING_JUMP) * SCALING_JUMP;
        c.width = clientWidth;
        c.height = clientHeight;
        context = c.getContext('2d');
        if (FLAG_IMAGE_SMOOTHING_DISABLED) {
            context.imageSmoothingEnabled = false;
        }
    }
    onresize = resize;
    resize();

    const activeKeyCodes: {[_:number]: number} = {
        // 65: 1, 
    };

    onkeydown = (e: KeyboardEvent) => {
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
        const [currentRoomX, currentRoomY] = world.currentRoom;
        const room = world.rooms[currentRoomX][currentRoomY];
        const roomWidth = room.bounds[2];
        const roomHeight = room.bounds[3];
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
                context.translate((clientWidth - roomWidth * scale)/2, (clientHeight - roomHeight * scale)/2);
                context.scale(scale, scale);        
                context.beginPath();
                context.rect(EDGE_HIDE_PROPORTION, EDGE_HIDE_PROPORTION, roomWidth - EDGE_HIDE_PROPORTION*2, roomHeight - EDGE_HIDE_PROPORTION*2);
                context.clip();        
            }
            updateAndRenderWorld(context, world, d, render);
            if (render) {
                context.restore();
            }
        }
        remainder = delta;
        requestAnimationFrame(update);
        then = now;
    };    
    update();
};