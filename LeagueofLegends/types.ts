import {ObjectId} from "mongodb";

export interface Champions{
    id?:ObjectId;
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
    region:Regions;
}

export interface Regions{
    id:string;
    name:string;
    Government:string;
    regionEmblemUrl:string;
}