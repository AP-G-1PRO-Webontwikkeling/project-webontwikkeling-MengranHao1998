import exp from "constants";
import {ObjectId} from "mongodb";

export interface Champions{
    _id?:ObjectId;
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
    region:Regions;
}

export interface Regions{
    id:string;
    name:string;
    Government:string;
    regionEmblemUrl:string;
}

export interface User{
    _id?: ObjectId;
    username: string;
    password?: string;
    role: "ADMIN" | "USER";
}