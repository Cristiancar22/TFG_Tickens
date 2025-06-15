import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config({ path: './.env.test' });

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});
