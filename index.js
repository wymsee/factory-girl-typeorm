const DefaultAdapter = require('factory-girl').DefaultAdapter;

class TypeOrmAdapter extends DefaultAdapter {
    constructor(connection) {
        super();
        this.connection = connection;
    }

    build(Model, props) {
        const model = new Model();
        Object.keys(props).forEach((key) => {
            model[key] = props[key];
        });
        return model;
    }

    async save(model, Model) {
        return this.connection.manager.save(model);
    }

    async destroy(model, Model) {
        const manager = this.connection.manager;
        const modelRepo = manager.getRepository(Model);
        const theModel = await modelRepo.findOneById(model.id);
        if (theModel) {
            return await manager.removeById(Model, model.id);
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