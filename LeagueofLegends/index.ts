import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { connect,getUsers,getUserById,updateCharacter} from "./database";
import { Champions } from "./types";
dotenv.config();

const app = express();
const port = 3000;

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.set("views", path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, "public")));


app.get("/",async (req,res)=>{

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

    res.render("index", {
        champion: sortedCharacters,
        sortFields:sortFields,
        sortDirections:sortDirections,
        sortField:sortField,
        sortDirection:sortDirection,
        q: q
        });
    });

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

app.listen(port,async()=>{
    await connect();
    console.log(`Server is running at http://localhost:${port}`);
});