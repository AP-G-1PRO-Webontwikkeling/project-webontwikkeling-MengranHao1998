import { Collection, Db, MongoClient } from "mongodb";
import { Champions } from "./types";
import dotenv from 'dotenv';

dotenv.config();

export const uri = "mongodb+srv://1708266613:Qq2509565275@cluster0.q5elxwa.mongodb.net/";
export const client = new MongoClient(uri);

export const championsCollection: Collection<Champions> = client.db("champion").collection<Champions>("champion");

export async function connectToDb(): Promise<Db> {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db('LeagueDB');
}

export async function main(db:Db): Promise<void>{
    const championsCollection: Collection<Champions> = db.collection('champion');
    const championsCount = await championsCollection.countDocuments();
    if(championsCount === 0) {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/LeagueofLegends/champions.json");
        const champion: Champions[] = await response.json();
        await championsCollection.insertMany(champion);
        console.log("Champions data are inserted to MongoDB");
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnencted from MongoDB");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        console.log("Connected to the data");
        process.on("SIGINT",exit);
    } catch (error) {
        console.error(error);
    }
}