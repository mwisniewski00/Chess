interface IConfig {
    host: string;
    port: number | string;
    database: string;
    user: string;
    password: string;
}

const dbConnData: IConfig = {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'chess-masters',
    user: process.env.MONGO_USER || 'admin',
    password: process.env.MONGO_PASSWORD || 'admin'
}

export default dbConnData;