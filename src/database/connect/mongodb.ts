
//原生的DB库封装
import { MongoClient } from 'mongodb';
import { timeFormat } from '@/utils/index'
// MongoDB连接字符串
const MONGO_URI = process.env.MONGO_URI;

/**
 * MongoDB连接池配置
 * @type {MongoClientOptions}
 */

const client = new MongoClient(MONGO_URI, {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect().then(() => {
            console.log('\x1B[36m%s\x1B[0m', `\n┌----------------------------- mongoDB commandSucceeded  ${timeFormat(new Date()).str} -----------------------------┐`)
            console.log(JSON.stringify(event))
            console.log('\x1B[36m%s\x1B[0m', '└------------------------------------- END -------------------------------------┘')
        }).catch(error => {
            console.error('MongoDB connection failed:', error);
            process.exit(1); // 强制退出，或者可以重试连接
        });
    }
    clientPromise = global._mongoClientPromise;
} else {
    clientPromise = client.connect().catch(error => {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // 强制退出，或者可以重试连接
    });
}

export default clientPromise;


/**
 *
 * @param tbName
 * @returns 返回数据库
 */
export const FotorMongoDB = async (tbName) => {
    const client = await clientPromise;
    const db = await client.db("fotor");
    return db.collection(tbName)
}
