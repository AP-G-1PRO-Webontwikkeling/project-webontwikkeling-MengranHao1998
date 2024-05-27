"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.login = exports.insertUser = exports.main = exports.updateCharacter = exports.getUserById = exports.getUsers = exports.userCollection = exports.championsCollection = exports.client = exports.MONGODB_URI = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
exports.MONGODB_URI = (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "mongodb+srv://1708266613:Qq2509565275@cluster0.q5elxwa.mongodb.net/";
exports.client = new mongodb_1.MongoClient(exports.MONGODB_URI);
exports.championsCollection = exports.client.db("champion").collection("champion");
exports.userCollection = exports.client.db("login-expres").collection("Users");
const saltRounds = 10;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.championsCollection.find({}).toArray();
    });
}
exports.getUsers = getUsers;
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.championsCollection.findOne({ id: id });
    });
}
exports.getUserById = getUserById;
function updateCharacter(id, champion) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.championsCollection.updateOne({ id: id }, { $set: champion });
    });
}
exports.updateCharacter = updateCharacter;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const champ = yield getUsers();
        if (champ.length === 0) {
            const response = yield fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/LeagueofLegends/champions.json");
            const champ = yield response.json();
            console.log(champ);
            yield exports.championsCollection.insertMany(champ);
            console.log("Champions data are inserted to MongoDB");
        }
    });
}
exports.main = main;
function CreateInitialUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield exports.userCollection.countDocuments()) > 0) {
            return;
        }
        let adminUsername = process.env.ADMIN_USERNAME;
        let adminPassword = process.env.ADMIN_PASSWORD;
        let userUsername = process.env.USER_USERNAME;
        let userPassword = process.env.USER_PASSWORD;
        if (adminUsername === undefined || adminPassword === undefined || userUsername === undefined || userPassword === undefined) {
            throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD, USER_USERNAME & USER_PASSWORD must be set in environment");
        }
        yield exports.userCollection.insertMany([
            { email: adminUsername, password: yield bcrypt_1.default.hash(adminPassword, saltRounds), role: "ADMIN" },
            { email: userUsername, password: yield bcrypt_1.default.hash(userPassword, saltRounds), role: "USER" }
        ]);
    });
}
function insertUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10; // Aantal rounds voor het hashing-algoritme
        try {
            // Controleer of het wachtwoord aanwezig is en een string is
            if (typeof user.password !== "string") {
                throw new Error("Ongeldig wachtwoord");
            }
            // Hash het wachtwoord met bcrypt
            const hashedPassword = yield bcrypt_1.default.hash(user.password, saltRounds);
            // Vervang het oorspronkelijke wachtwoord door het gehashte wachtwoord
            user.password = hashedPassword;
            // Voeg de gebruiker toe aan de database
            yield exports.userCollection.insertOne(user);
            console.log("Gebruiker succesvol toegevoegd aan de database");
        }
        catch (error) {
            console.error("Fout bij het toevoegen van gebruiker aan de database:", error);
            throw error; // Optioneel: gooi de fout verder omhoog voor afhandeling in hoger niveau
        }
    });
}
exports.insertUser = insertUser;
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (email === "" || password === "") {
            throw new Error("Username and password required");
        }
        let user = yield exports.userCollection.findOne({ email: email });
        console.log("Functie " + user);
        if (user) {
            if (yield bcrypt_1.default.compare(password, user.password)) {
                return user;
            }
            else {
                throw new Error("Password incorrect");
            }
        }
        else {
            throw new Error("User not found");
        }
    });
}
exports.login = login;
function exit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.close();
            console.log("Disconnencted from MongoDB");
        }
        catch (error) {
            console.error(error);
        }
        process.exit(0);
    });
}
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield CreateInitialUsers();
            yield main();
            console.log("Connected to the data");
            process.on("SIGINT", exit);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.connect = connect;
