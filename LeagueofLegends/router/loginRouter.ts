import express from "express";
import { login } from "../database";
import { secureMiddleware } from "../secureMiddleware";
import { User } from "../types";
import * as jwt from 'jsonwebtoken';

export function loginRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        res.render("login");
    });

    router.post("/", async (req, res) => {
        const username: string = req.body.username;
        const password: string = req.body.password;
        try {
            let user: User = await login(username, password);
            delete user.password; // Remove password from user object. Sounds like a good idea.

            req.session.user = user;

            
            
            const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
            res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
            req.session.message = { type: "success", message: "Login successful" };
            res.redirect("/movies")
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/login");
        }
    });

    router.post("/logout", secureMiddleware, async (req, res) => {
        res.clearCookie("jwt");
        res.redirect("/login");
    });

    return router;
}