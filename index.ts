import { chmod } from "fs";
import champion from "./champions.json"
import region from "./regions.json"
import readline from "readline-sync"
import { exit } from "process";

interface Champions{
    id:string;
    title:string;
    name:string;
    story:string;
    releasedate:string;
    exist:number;
    isActive:boolean;
    imageUrl:string;
    role:string;
    race:string;
    abilities:string[];
    region:string[]
}

interface Regions{
    id:string;
    name:string;
    Government:string;
    regionEmblemUrl:string;
}

export{}

let terminalapp = true;

do {
    console.log("Welcome to the JSON data viewer!");
    console.log(" ");
    console.log("1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit");
    console.log(" ");
    let answer: number = readline.questionInt('Please enter your choice: ');
    if (answer === 1) {
        console.log(champion);
        console.log(region);
        terminalapp = false;
    }
    else if (answer === 2) {
        for (let i = 0; i < champion.length; i++) {
            let championid = champion[i];
            console.log(championid.id);
        }
        let answer2: string = readline.question('Please enter the ID you want to filter by: ');
        let filterid = champion.filter(champion => champion.id === answer2);
        console.log(filterid)
        terminalapp = false;
    }
    else if (answer === 3) {
        terminalapp = false;
    }
    else{
        console.log("This id doesn't exist please try again");
        console.log(" ");
    }
} while (terminalapp);
