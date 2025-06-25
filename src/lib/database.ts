import { PrismaClient } from '@prisma/client';

class DatabaseManager {
    private static instance: PrismaClient;

    static getInstance(): PrismaClient {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL,
                    },
                },
            });
        }
        return DatabaseManager.instance;
    }

    static async disconnect(): Promise<void> {
        if (DatabaseManager.instance) {
            await DatabaseManager.instance.$disconnect();
        }
    }
}