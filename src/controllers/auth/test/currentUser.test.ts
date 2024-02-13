import { Request, Response } from "express";
import {
    authMock,
    authMockRequest,
    authMockResponse,
    authUserPayload
} from "@gateway/controllers/auth/test/mocks/auth.mock";
import * as socketServer from "@gateway/server";
import { Server } from "socket.io";
import { authService } from "@gateway/services/api/auth.api.service";
import { AxiosResponse } from "axios";
import { CurrentUser } from "../currentUser";
import { GatewayCache } from "@gateway/redis/gateway.cache";

jest.mock("@gateway/services/api/auth.api.service");
jest.mock("@Akihira77/jobber-shared");
jest.mock("@gateway/redis/gateway.cache");
jest.mock("@gateway/server");
jest.mock("@elastic/elasticsearch");

const USERNAME = "Dika";
const PASSWORD = "dika1";
Object.defineProperties(socketServer, {
    socketIO: {
        value: new Server(),
        writable: true
    }
});

describe("CurrentUser", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getCurrentUser() method", () => {
        it("should return authenticated user", async () => {
            const req: Request = authMockRequest(
                {},
                { username: USERNAME, password: PASSWORD },
                authUserPayload
            ) as unknown as Request;
            const res: Response = authMockResponse();

            jest.spyOn(authService, "getCurrentUser").mockResolvedValue({
                data: {
                    message: "Current user data",
                    user: authMock
                }
            } as unknown as AxiosResponse);
            await CurrentUser.prototype.get(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Current user data",
                user: authMock
            });
        });
    });

    describe("resendVerificationEmail() method", () => {
        it("should return the correct response", async () => {
            const req: Request = authMockRequest(
                {} as never,
                { email: USERNAME },
                authUserPayload
            ) as unknown as Request;
            const res: Response = authMockResponse();

            jest.spyOn(authService, "resendEmail").mockResolvedValue({
                data: {
                    message: "Email sent successfully",
                    user: authMock
                }
            } as unknown as AxiosResponse);

            await CurrentUser.prototype.resendVerificationEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email sent successfully",
                user: authMock
            });
        });
    });

    describe("getLoggedInUsersFromCache() method", () => {
        it("should return the correct response", async () => {
            const req: Request = authMockRequest(
                {} as never,
                { email: USERNAME },
                authUserPayload
            ) as unknown as Request;
            const res: Response = authMockResponse();

            jest.spyOn(
                GatewayCache.prototype,
                "getLoggedInUsersFromCache"
            ).mockResolvedValue(["Dika", "Andika"]);
            jest.spyOn(socketServer.socketIO, "emit");

            await CurrentUser.prototype.getLoggedInUsers(req, res);

            expect(socketServer.socketIO.emit).toHaveBeenCalledWith("online", [
                "Dika",
                "Andika"
            ]);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "User is online"
            });
        });
    });

    describe("removeLoggedInUserFromCache() method", () => {
        it("should return the correct response", async () => {
            const req: Request = authMockRequest(
                {} as never,
                { email: USERNAME },
                authUserPayload,
                { username: "Andika" }
            ) as unknown as Request;
            const res: Response = authMockResponse();

            jest.spyOn(
                GatewayCache.prototype,
                "removeLoggedInUserFromCache"
            ).mockResolvedValue(["Andika"]);
            jest.spyOn(socketServer.socketIO, "emit");

            await CurrentUser.prototype.removeLoggedInUsers(req, res);

            expect(socketServer.socketIO.emit).toHaveBeenCalledWith("online", [
                "Andika"
            ]);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "User is offline"
            });
        });
    });
});
