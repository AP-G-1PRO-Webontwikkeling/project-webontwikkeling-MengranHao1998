import express,{Express} from 'express';
import path,{format} from 'path';
import dotenv from 'dotenv';
import { connect,getUsers,getUserById,updateCharacter, login, insertUser} from "./database";
import { Champions,User} from "./types";
import session from "./session";
import { secureMiddleware } from "./secureMiddleware";
import { name } from 'ejs';
dotenv.config();

const app : Express = express();

app.set("port", process.env.PORT || 3000);

app.use(session);
app.set("view engine","ejs");
app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({extended: true }));
app.set("views", path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, "public")));

const router = express.Router();

app.get("/", secureMiddleware, async (req,res)=>{

    let champion : Champions[] = await getUsers();

    let q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : "";
    let filteredCharacters = champion.filter(character => {
        return character.name.toLowerCase().includes(q)
    });
    let sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    let sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    
let sortedCharacters = [...filteredCharacters].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }else if (sortField === "id") {
            return sortDirection === "asc" ? a.id.localeCompare(b.id): b.id.localeCompare(a.id);
        }else if (sortField === "releasedate") {
            return sortDirection === "asc" ? a.releasedate.localeCompare(b.releasedate) : b.releasedate.localeCompare(a.releasedate);
        }else if (sortField === "role") {
            return sortDirection === "asc" ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role);
        }else if (sortField === "race") {
            return sortDirection === "asc" ? a.race.localeCompare(b.race) : b.race.localeCompare(a.race);
        }
        else{
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
        { value: 'asc', text: 'Ascending', selected: sortDirection === 'asc' ? 'selected' : ''},
        { value: 'desc', text: 'Descending', selected: sortDirection === 'desc' ? 'selected' : ''}
    ];
        if (req.session.user) {
            res.render("index", {
                user: req.session.user,
                champion: sortedCharacters,
                sortFields:sortFields,
                sortDirections:sortDirections,
                sortField:sortField,
                sortDirection:sortDirection,
                q: q
            });
        } else {
            res.redirect("/login");
        }
    });

app.get("/Champions", secureMiddleware,async(req,res)=>{
    let champion : Champions[] = await getUsers();

    res.render("champions",{
        champion:champion
    })
});

app.get("/Champions/:id",secureMiddleware,async(req,res)=>{
    let champion : Champions[] = await getUsers();

    const champid = req.params.id;
    const champs = champion.find(champion => champion.id === champid);

    console.log(champs);
    res.render("champdetails",{
        champs: champs
    })
});
app.get("/Regions",secureMiddleware, async(req,res)=>{
    let champion : Champions[] = await getUsers();
    res.render("regions",{champion})
});

app.get("/Regions/:id",secureMiddleware, async(req,res)=>{
    let regions : Champions[] = await getUsers();

    const regionid = req.params.id;
    const region = regions.find(regions => regions.region.id === regionid);

    console.log(region)
    res.render("regionsdetails",{
        region:region
    })
})

app.get("/:id/update",secureMiddleware, async(req, res) => {
    let id : string = req.params.id;
    let updateuser: Champions | null = await getUserById(id);
    res.render("update",{
        updateuser
    });
  });

app.post("/:id/update",secureMiddleware, async(req, res) => {
    let id : string = req.params.id;
    let champ : Champions = req.body;
    await updateCharacter(id,champ);
    res.redirect("/");
  });

app.get("/login",(req,res)=>{
    if (!req.session.user) {
        res.render("login", {
            user: req.session.user,
        });
    } else {
        res.redirect("/");
    }
});

app.post("/login", async(req, res) => {
    const email : string = req.body.name;
    const password : string = req.body.password;
    try {
        console.log("User checked "+email);
        let user : User = await login(email, password);
        delete user.password; 
        req.session.user = user;
        console.log("User from database "+user);
        res.redirect("/")
    } catch (e : any) {
        console.log(e);
        res.redirect("/login");
    }
});

app.post("/logout",secureMiddleware, async(req,res)=>{
    req.session.destroy(() =>{
        res.redirect("/login");
    });
});

app.get("/register",(req , res) => {
    res.render("register")
});

app.post("/register", async(req , res) => {
    const { username, password } = req.body;

    try {
        // Controleer of gebruikersnaam en wachtwoord zijn verstrekt
        if (!username || !password) {
            return res.status(400).send("Gebruikersnaam en wachtwoord zijn verplicht");
        }
        let user : User =  {email: String(username),password: password,role: "USER"}

        // Voeg de gebruiker toe aan de database
        await insertUser( user);
        console.log('inserted')

        // Stuur een succesvolle reactie
        
        res.redirect("/");
    } catch (error) {
        // Als er een fout optreedt, stuur een foutreactie
        console.error("Fout bij registreren:", error);
        res.status(500).send("Er is een interne serverfout opgetreden bij het registreren van de gebruiker");
    }
});

app.listen(app.get("port"),async()=>{
    try {
        await connect();
        console.log(`Server is running at http://localhost:${app.get('port')}`);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
});