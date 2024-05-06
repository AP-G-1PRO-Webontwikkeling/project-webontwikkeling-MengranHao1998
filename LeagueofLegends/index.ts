import * as readline from 'readline-sync';
import championdata from "./champions.json";
import { Champions } from './types';
import express ,{ Express } from 'express';
import path from 'path';
import { json } from 'stream/consumers';

async function main() {
    const response = await fetch(`https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/champions.json`);
    const champion: Champions[] = await response.json();
}

const Champ = championdata;
const app = express();
const port = 3000;

app.set("view engine","ejs");
app.set("views", path.join(__dirname,'views'));
app.use(express.static("public"));
app.use(express.json());

app.get("/",(req,res)=>{

    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : "";
    let filteredCharacters = championdata.filter(character => {
        return character.name.toLowerCase().includes(q)
    });
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    
let sortedCharacters = [...filteredCharacters].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }else if (sortField === "id") {
            return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
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
        Champ: sortedCharacters,
        sortFields:sortFields,
        sortDirections:sortDirections,
        sortField:sortField,
        sortDirection:sortDirection,
        q: q
        });
    });

app.get("/Champions",(req,res)=>{
    res.render("champions",{Champ})
});

app.get("/Champions/:id",(req,res)=>{
    const champs = Champ.find(c => c.id === req.params.id);
    if (champs) {
        res.render("champdetails",{champs});
    }else{
        res.send("Champions not founded")
    }
});
app.get("/Regions",(req,res)=>{
    res.render("regions",{Champ})
});

app.get("/Regions/:id",(req,res)=>{
    const regionsid = req.params.id;
    const region = Champ.find(d => d.region.id === regionsid);
    if (region) {
        res.render("regionsdetails",{region});
    }else{
        res.send("Region not founded")
    }
})

app.listen(port,async()=>{
    console.log(`Server is running at http://localhost:${port}`);
});