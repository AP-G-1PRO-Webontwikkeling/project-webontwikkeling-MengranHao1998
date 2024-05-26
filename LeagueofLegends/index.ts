import express,{Express} from 'express';
import path,{format} from 'path';
import dotenv from 'dotenv';
import { connect,getUsers,getUserById,updateCharacter, login,registerUser, insertUser} from "./database";
import { Champions,User} from "./types";
import session from "./session";
import { secureMiddleware } from './secureMiddleware';
import { loginRouter } from './router/loginRouter';
import { homeRouter } from './router/homeRouter';
import { flashMiddleware } from './flashMiddleware';
dotenv.config();

const app : Express = express();

app.set("port", process.env.PORT || 3000);

app.use(session);
app.use(loginRouter());
app.use(homeRouter());
app.use(flashMiddleware);
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.set("views", path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, "public")));

app.get("/register",async(req,res) =>{
    res.render("register");
});

app.post("/register", async(req , res) => {
    const { username, password } = req.body;

    

    try {
        // Controleer of gebruikersnaam en wachtwoord zijn verstrekt
        if (!username || !password) {
            return res.status(400).send("Gebruikersnaam en wachtwoord zijn verplicht");
        }
        let user : User =  {username: String(username),password: password,role: "USER"}

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

app.get("/login", (req,res)=>{
    res.render("login");
})

app.post("/login", async(req,res) =>{
    const username:string =req.body.username;
    const password:string = req.body.password;
    try{
        let user : User = await login(username,password);
        delete user.password;
        req.session.user = user;
        res.redirect("/")
    } catch (e: any){
        res.redirect("/login");
    }
})

app.get("/Champions", async(req,res)=>{
    let champion : Champions[] = await getUsers();

    res.render("champions",{
        champion:champion
    })
});

app.get("/Champions/:id",async(req,res)=>{
    let champion : Champions[] = await getUsers();

    const champid = req.params.id;
    const champs = champion.find(champion => champion.id === champid);

    console.log(champs);
    res.render("champdetails",{
        champs: champs
    })
});
app.get("/Regions", async(req,res)=>{
    let champion : Champions[] = await getUsers();
    res.render("regions",{champion})
});

app.get("/Regions/:id", async(req,res)=>{
    let regions : Champions[] = await getUsers();

    const regionid = req.params.id;
    const region = regions.find(regions => regions.region.id === regionid);

    console.log(region)
    res.render("regionsdetails",{
        region:region
    })
})

app.get("/:id/update", async(req, res) => {
    let id : string = req.params.id;
    let updateuser: Champions | null = await getUserById(id);
    res.render("update",{
        updateuser
    });
  });

app.post("/:id/update", async(req, res) => {
    let id : string = req.params.id;
    let champ : Champions = req.body;
    await updateCharacter(id,champ);
    res.redirect("/");
  });

app.get("/logout", async(req,res)=>{
    req.session.destroy(() =>{
        res.redirect("/login");
    });
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