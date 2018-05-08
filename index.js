class TypeOrmAdapter {
    constructor(connection) {
        this.connection = connection;
    }

    build(Model, props) {
        const model = new Model(props);
        return model;
    }

    async save(model, Model) {
        return this.connection.manager.save(model);
    }

    async destroy(model, Model) {
        const manager = this.connection.manager;
        const modelRepo = manager.getRepository(Model);
        const theModel = await modelRepo.findOne(model.id);
        if (theModel) {
            await manager.query('SET FOREIGN_KEY_CHECKS=0;');
            await manager.delete(Model, model.id);
            return await manager.query('SET FOREIGN_KEY_CHECKS=1;');
        } else {
            return;
        }
    }

    get(model, attr, Model) {
        return model[attr];
    }

    set(props, model, Model) {
        Object.keys(props).forEach((key) => {
            model[key] = props[key];
        });
        return model;
    }
}

module.exports = TypeOrmAdapter;
