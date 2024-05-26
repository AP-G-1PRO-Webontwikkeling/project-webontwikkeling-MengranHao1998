import { Collection, MongoClient } from "mongodb";
import { Champions,User } from "./types";
import dotenv from 'dotenv';

dotenv.config();

export const uri = "mongodb+srv://1708266613:Qq2509565275@cluster0.q5elxwa.mongodb.net/";
export const client = new MongoClient(uri);

export const championsCollection: Collection<Champions> = client.db("champion").collection<Champions>("champion");

export async function getUsers() {
    return await championsCollection.find({}).toArray();
}

export async function getUserById(id:string) {
    return await championsCollection.findOne({id:id});
}

export async function updateCharacter(id: string, champion:Champions) {
    return await championsCollection.updateOne({ id : id }, { $set: champion });
}

export async function main(){
    const champ : Champions[] = await getUsers();
    if(champ.length === 0) {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/LeagueofLegends/champions.json");
        const champ: Champions[] = await response.json();
        console.log(champ);
        await championsCollection.insertMany(champ);
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
        await main();
        console.log("Connected to the data");
        process.on("SIGINT",exit);
    } catch (error) {
        console.error(error);
    }
}

