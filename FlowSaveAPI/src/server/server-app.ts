import { AuthJSONService } from "../auth/auth.json-service";
import { AuthService } from "../auth/auth.service";
import { UserJSONService } from "../user/user.json-service";
import { UserService } from "../user/user.service";
import { AccountJSONService } from "../account/account.json-service";
import { AccountService } from "../account/account.service";
import { AccountController } from "../account/account.controller";
import { Server } from "./server";
import { ServerRouter } from "./server-router";

export class ServerApp {
    private server!: Server;
    private serverRouter!: ServerRouter;
    private port!: number;
    private authService!: AuthService;
    private userService!: UserService;
    private accountService!: AccountService;

    constructor(port: number) {
        this.configureServices();
        this.configureApp(port);
    }

    bootstrap(): void {
        this.server.bootstrap();
    }

    private configureApp(port: number): void {
        this.port = port;
        this.serverRouter = new ServerRouter(this.authService, this.userService, this.accountService);
        this.server = new Server(this.port, this.serverRouter);
    }
    private configureServices(): void {
        this.authService = new AuthJSONService();
        this.userService = new UserJSONService();
        this.accountService = new AccountJSONService();
    }



}