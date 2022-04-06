const seed = require('./seed');
const { db } = require('./db');

const init = async () => {
    try {
        await db.sync({ force: true });
        const seedData = await seed();
        console.log('connected');
        return seedData;
    } catch (error) {
        console.log(error);
    }
};

init();
