const persistentEntityFactoryFactory = (entityFactory: EntityFactory, persistentId: number) => {
    return (x: number, y: number, id: IdFactory) => {
        let entities = entityFactory(x, y, id, persistentId);
        if (!localStorage.getItem(persistentId as any)) {
            entities[0].persistentId = persistentId;
            entities[0].eid = persistentId;
        } else {
            entities = [];
        }
        return entities;    
    }
};