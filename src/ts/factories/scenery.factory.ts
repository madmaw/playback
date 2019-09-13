let sceneryFactoryFactory = (text: string, scale: number) => {
    return (x: number, y: number, id: IdFactory) => {
        const scenery: Scenery = {
            eid: id(), 
            collisionGroup: COLLISION_GROUP_BACKGROUNDED, 
            collisionMask: 0, 
            text, 
            entityType: ENTITY_TYPE_SCENERY, 
            bounds: [x, y - scale + 1, 1, scale], 
        }
        return [scenery];
    };
}