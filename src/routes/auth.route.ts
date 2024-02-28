import { Password } from "@gateway/controllers/auth/password";
import { AuthSeed } from "@gateway/controllers/auth/seed";
import { SignIn } from "@gateway/controllers/auth/signIn";
import { Signout } from "@gateway/controllers/auth/signOut";
import { SignUp } from "@gateway/controllers/auth/signUp";
import { VerifyEmail } from "@gateway/controllers/auth/verifyEmail";
import express, { Router } from "express";

class AuthRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post("/auth/signup", SignUp.prototype.create);
        this.router.post("/auth/signin", SignIn.prototype.read);
        this.router.post("/auth/singout", Signout.prototype.update);
        this.router.put("/auth/verify-email", VerifyEmail.prototype.update);
        this.router.put(
            "/auth/forgot-password",
            Password.prototype.forgotPassword
        );
        this.router.put(
            "/auth/reset-password/:token",
            Password.prototype.resetPassword
        );
        this.router.put(
            "/auth/change-password",
            Password.prototype.changePassword
        );
        this.router.put("/auth/seed/:count", AuthSeed.prototype.generate);

        return this.router;
    }
}

export const authRoutes = new AuthRoutes();
