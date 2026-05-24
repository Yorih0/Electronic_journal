import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../college.db');

let dbInstance: Database | null = null;

export const openDB = async (): Promise<Database> => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });

        await dbInstance.exec('PRAGMA foreign_keys = ON');
    }
    return dbInstance;
};

export const closeDB = async (): Promise<void> => {
    if (dbInstance) {
        await dbInstance.close();
        dbInstance = null;
    }
};
