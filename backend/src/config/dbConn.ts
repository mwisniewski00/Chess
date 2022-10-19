interface IConfig {
    host: string;
    port: number | string;
    database: string;
}

const dbConnData: IConfig = {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'chess-masters'
}

export default dbConnData;