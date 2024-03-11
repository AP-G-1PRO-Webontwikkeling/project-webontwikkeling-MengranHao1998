//import champion from "./champions.json"
import readline from "readline-sync"

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
    region:Regions[]
}

interface Regions{
    id:string;
    name:string;
    Government:string;
    regionEmblemUrl:string;
}

async function main() {
    const response = await fetch(`https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/champions.json`);
    const champion: Champions[] = await response.json();

    do {
        console.log("Welcome to the JSON data viewer!");
        console.log(" ");
        console.log("1. View all data");
        console.log("2. Filter by ID");
        console.log("3. Exit");
        console.log(" ");
        let answer = readline.questionInt('Please enter your choice: ');
        if (answer === 1) {
            for (let i = 0; i < champion.length; i++) {
                console.log(champion[i]);
            }
        }
        else if (answer === 2) {
            for (let i = 0; i < champion.length; i++) {
                let championid = champion[i].id;
                console.log(championid);
            }
            let answer2: string = readline.question('Please enter the ID you want to filter by: ');
            for (let j = 0; j < champion.length; j++) {
                if (answer2 === champion[j].id) {
                    let filterid = champion.filter(champion => champion.id === answer2);
                    console.log(filterid)
                }
                else{
                    console.log("please try again");
                }
            }
        }
        else if (answer === 3) {
            break;
        }
        else{
            console.log("This id doesn't exist please try again");
            console.log(" ");
        }
    } while (true);
}
main();
