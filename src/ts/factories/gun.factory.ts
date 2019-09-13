const gunFactoryFactory = (holderFactory?: EntityFactory) => {
    return (x: number, y: number, id: IdFactory) => {
        const gun: Gun = {
            entityType: ENTITY_TYPE_GUN, 
            graphic: gunGraphic, 
            palette: [[0, 0, 80], [0, 0, 90]], 
            bounds: rectangleCenterBounds(x, y, .8, .3), 
            collisionGroup: COLLISION_GROUP_ITEMS, 
            collisionMask: COLLISION_MASK_ITEMS, 
            gravityMultiplier: 1, 
            eid: id(), 
            mass: .1, 
            velocity: [0, 0], 
            restitution: .4, 
            entityOrientation: 0,
            orientationStartTime: 0, 
            lastFired: 0, 
            fireRate: BULLET_INTERVAL, 
        };
        if (holderFactory) {
            const result = holderFactory(x, y, id);
            const e = result[0] as ActiveMovableEntity;
            e.holding[e.handJointId] = gun;
            return result;
        } else {
            return [gun];
        }
    }
};