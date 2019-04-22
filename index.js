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
        try {
            return manager.transaction(async (tm) => {
                if (this.connection.options.type === 'sqlite') {
                    await tm.query('PRAGMA foreign_keys = OFF;');
                } else {
                    await tm.query('SET FOREIGN_KEY_CHECKS=0;');
                }
                await tm.delete(Model, model.id ? model.id : model.api_id);
                if (this.connection.options.type === 'sqlite') {
                    return tm.query('PRAGMA foreign_keys = ON;');
                } else {
                return tm.query('SET FOREIGN_KEY_CHECKS=1;');
                }
            });
        } catch (err) {
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
