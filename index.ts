import * as readline from 'readline-sync';
import championdata from "./champions.json";
import { Champions } from './types';
import express ,{ Express } from 'express';
import path from 'path';

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

app.get("/",(req,res)=>{
    res.render("index",{Champ});
});

app.get("/Champions",(req,res)=>{
    res.render("champions",{Champ})
});

app.get("/Regions",(req,res)=>{
    res.render("regions",{Champ})
});

app.get("/champions.ejs/:id",(req,res)=>{
    const id = (req.params.id);
    const champion = Champ.find(champion => champion.id === id);
    res.render("champdetails",{Champ:id});
});

app.get("/regions.ejs/:id",(req,res)=>{
    const id = (req.params.id);
    const champion = Champ.find(champion => champion.id === id);
    res.render("regionsdetails",{Champ:id});
})

app.get("/search",(req,res)=>{
    const searchop = req.query.query;
    let filteredChamp = Champ;
    if(searchop && typeof searchop === 'string'){
        filteredChamp = Champ.filter(champion =>
            champion.name.toLowerCase().includes(searchop.toLowerCase()));
    }
    res.render("index",{Champ: filteredChamp, searchop});
});

app.get("/namesort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.name.localeCompare(b.name));
    }
    else{
        Champ.sort((a, b) => b.name.localeCompare(a.name));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.get("/storysort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.story.localeCompare(b.story));
    }
    else{
        Champ.sort((a, b) => b.story.localeCompare(a.story));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.get("/rolesort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.role.localeCompare(b.role));
    }
    else{
        Champ.sort((a, b) => b.role.localeCompare(a.role));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.get("/racesort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.race.localeCompare(b.race));
    }
    else{
        Champ.sort((a, b) => b.race.localeCompare(a.race));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.get("/releasedatesort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.releasedate.localeCompare(b.releasedate));
    }
    else{
        Champ.sort((a, b) => b.releasedate.localeCompare(a.releasedate));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.get("/regionsort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.region.name.localeCompare(b.region.name));
    }
    else{
        Champ.sort((a, b) => b.region.name.localeCompare(a.region.name));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.get("/titlesort",(req,res)=>{
    let sortDirection = req.query.sortDirection || 'asc';

    if (sortDirection === 'asc') {
        Champ.sort((a, b) => a.title.localeCompare(b.title));
    }
    else{
        Champ.sort((a, b) => b.title.localeCompare(a.title));
    }

    const nextsortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    res.render("index",{Champ, sortDirection,nextsortDirection});
});

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});

/*async function main() {
    const response = await fetch(`https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/champions.json`);
    const champion: Champions[] = await response.json();

    do {
        console.log("Welcome to the JSON data viewer!");
        console.log(" ");
        console.log("1. View all data");
        console.log("2. Filter by ID");
        console.log("3. Exit");
        console.log(" ");
        let answer = readline.question('Please enter your choice: ');
        if (answer === '1') {
            for (let i = 0; i < champion.length; i++) {
                console.log(champion[i]);
            }
        }
        else if (answer === '2') {
            for (let i = 0; i < champion.length; i++) {
                let championid = champion[i].id;
                console.log(championid);
            }
            let answer2: string = readline.question('Please enter the ID you want to filter by: ');
            for (let j = 0; j < champion.length; j++) {
                if (answer2 === champion[j].id) {
                    let filterid = champion.filter(champion => champion.id === answer2);
                    console.log(filterid)
                    break;
                }
            }
        }
        else if (answer === '3') {
            break;
        }
        else{
            console.log("This id doesn't exist please try again");
            console.log(" ");
        }
    } while (true);
}
main();
*/