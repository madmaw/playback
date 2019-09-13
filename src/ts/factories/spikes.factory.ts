const spikeFactoryFactory = () => {
    return (x: number, y: number, id: IdFactory) => {
        const spike: Lethal = {
            eid: id(),
            graphic: randomSpikeGraphic(), 
            palette: spikesPalette, 
            entityType: ENTITY_TYPE_LETHAL, 
            collisionGroup: COLLISION_GROUP_SPIKES, 
            collisionMask: COLLISION_MASK_SPIKES, 
            bounds: rectangleCenterBounds(x, y, 1, .25), 
        };
        return [spike];
    }
};