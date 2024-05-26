import express from "express";
import { connect,getUsers,getUserById} from "../database";
import { secureMiddleware } from "../secureMiddleware";
import { Champions,} from "../types";


export function homeRouter(){
    const router = express.Router();

    router.get("/",secureMiddleware, async (req,res)=>{

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
                champion: sortedCharacters,
                sortFields:sortFields,
                sortDirections:sortDirections,
                sortField:sortField,
                sortDirection:sortDirection,
                q: q
                });
            } else {
                res.redirect("/")
            }
        });
        return router;
    }
