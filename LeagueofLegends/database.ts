import { Collection, MongoClient,OptionalId } from "mongodb";
import { Champions,User } from "./types";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import exp from "constants";

dotenv.config();

export const MONGODB_URI = process.env.MONGO_URI ?? "mongodb+srv://1708266613:Qq2509565275@cluster0.q5elxwa.mongodb.net/";
export const client = new MongoClient(MONGODB_URI);

export const championsCollection: Collection<Champions> = client.db("champion").collection<Champions>("champion");
export const userCollection:Collection<User> = client.db("login-expres").collection<User>("Users");

const saltRounds: number = 10;

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
        await createInitialUser();
        await main();
        console.log("Connected to the data");
        process.on("SIGINT",exit);
    } catch (error) {
        console.error(error);
    }
}

async function createInitialUser() {
    if (await userCollection.countDocuments() > 2) {
        return;
    }
    
    let name : string | undefined = process.env.ADMIN_USERNAME;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (name === undefined || password === undefined) {
        throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        username: name,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });

    let username : string | undefined = process.env.USER_USERNAME;
    let userpassword : string | undefined = process.env.USER_PASSWORD;
    if (!username || !userpassword ) {
        throw new Error("USER_USERNAME and USER_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        username: username,
        password: await bcrypt.hash(userpassword, saltRounds),
        role: "USER"
    });
}

export async function insertUser(user: OptionalId<User>) {
    const saltRounds = 10; // Aantal rounds voor het hashing-algoritme

    try {
        // Controleer of het wachtwoord aanwezig is en een string is
        if (typeof user.password !== "string") {
            throw new Error("Ongeldig wachtwoord");
        }

        // Hash het wachtwoord met bcrypt
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        // Vervang het oorspronkelijke wachtwoord door het gehashte wachtwoord
        user.password = hashedPassword;

        // Voeg de gebruiker toe aan de database
        await userCollection.insertOne(user);
        console.log("Gebruiker succesvol toegevoegd aan de database");
    } catch (error) {
        console.error("Fout bij het toevoegen van gebruiker aan de database:", error);
        throw error; // Optioneel: gooi de fout verder omhoog voor afhandeling in hoger niveau
    }
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Username and password required");
    }
    let user : User | null = await userCollection.findOne<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function registerUser(username:string, password:string) {
    const existingUser = await userCollection.findOne({username});
    if(existingUser){
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser: User = {username, password: hashedPassword, role: "USER"};
    await userCollection.insertOne(newUser);
    console.log(`User registered successfully: ${username}`);
    return newUser;
}