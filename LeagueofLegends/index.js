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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const session_1 = __importDefault(require("./session"));
const secureMiddleware_1 = require("./secureMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 3000);
app.use(session_1.default);
app.set("view engine", "ejs");
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.set("views", path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
const router = express_1.default.Router();
app.get("/", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let champion = yield (0, database_1.getUsers)();
    let q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : "";
    let filteredCharacters = champion.filter(character => {
        return character.name.toLowerCase().includes(q);
    });
    let sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    let sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    let sortedCharacters = [...filteredCharacters].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        else if (sortField === "id") {
            return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        }
        else if (sortField === "releasedate") {
            return sortDirection === "asc" ? a.releasedate.localeCompare(b.releasedate) : b.releasedate.localeCompare(a.releasedate);
        }
        else if (sortField === "role") {
            return sortDirection === "asc" ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role);
        }
        else if (sortField === "race") {
            return sortDirection === "asc" ? a.race.localeCompare(b.race) : b.race.localeCompare(a.race);
        }
        else {
            return 0;
        }
    });
    const sortFields = [
        { value: 'name', text: 'Name', selected: sortField === 'name' ? 'selected' : '' },
        { value: 'id', text: 'Id', selected: sortField === 'id' ? 'selected' : '' },
        { value: 'releasedate', text: 'Releasedate', selected: sortField === 'releasedate' ? 'selected' : '' },
        { value: 'role', text: 'Role', selected: sortField === 'role' ? 'selected' : '' },
        { value: 'race', text: 'Race', selected: sortField === 'race' ? 'selected' : '' },
    ];
    const sortDirections = [
        { value: 'asc', text: 'Ascending', selected: sortDirection === 'asc' ? 'selected' : '' },
        { value: 'desc', text: 'Descending', selected: sortDirection === 'desc' ? 'selected' : '' }
    ];
    if (req.session.user) {
        res.render("index", {
            user: req.session.user,
            champion: sortedCharacters,
            sortFields: sortFields,
            sortDirections: sortDirections,
            sortField: sortField,
            sortDirection: sortDirection,
            q: q
        });
    }
    else {
        res.redirect("/login");
    }
}));
app.get("/Champions", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let champion = yield (0, database_1.getUsers)();
    res.render("champions", {
        champion: champion
    });
}));
app.get("/Champions/:id", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let champion = yield (0, database_1.getUsers)();
    const champid = req.params.id;
    const champs = champion.find(champion => champion.id === champid);
    console.log(champs);
    res.render("champdetails", {
        champs: champs
    });
}));
app.get("/Regions", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let champion = yield (0, database_1.getUsers)();
    res.render("regions", { champion });
}));
app.get("/Regions/:id", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let regions = yield (0, database_1.getUsers)();
    const regionid = req.params.id;
    const region = regions.find(regions => regions.region.id === regionid);
    console.log(region);
    res.render("regionsdetails", {
        region: region
    });
}));
app.get("/:id/update", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let updateuser = yield (0, database_1.getUserById)(id);
    res.render("update", {
        updateuser
    });
}));
app.post("/:id/update", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let champ = req.body;
    yield (0, database_1.updateCharacter)(id, champ);
    res.redirect("/");
}));
app.get("/login", (req, res) => {
    if (!req.session.user) {
        res.render("login", {
            user: req.session.user,
        });
    }
    else {
        res.redirect("/");
    }
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.name;
    const password = req.body.password;
    try {
        console.log("User checked " + email);
        let user = yield (0, database_1.login)(email, password);
        delete user.password;
        req.session.user = user;
        console.log("User from database " + user);
        res.redirect("/");
    }
    catch (e) {
        console.log(e);
        res.redirect("/login");
    }
}));
app.post("/logout", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy(() => {
        res.redirect("/login");
    });
}));
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Controleer of gebruikersnaam en wachtwoord zijn verstrekt
        if (!username || !password) {
            return res.status(400).send("Gebruikersnaam en wachtwoord zijn verplicht");
        }
        let user = { email: String(username), password: password, role: "USER" };
        // Voeg de gebruiker toe aan de database
        yield (0, database_1.insertUser)(user);
        console.log('inserted');
        // Stuur een succesvolle reactie
        res.redirect("/");
    }
    catch (error) {
        // Als er een fout optreedt, stuur een foutreactie
        console.error("Fout bij registreren:", error);
        res.status(500).send("Er is een interne serverfout opgetreden bij het registreren van de gebruiker");
    }
}));
app.listen(app.get("port"), () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connect)();
        console.log(`Server is running at http://localhost:${app.get('port')}`);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}));
