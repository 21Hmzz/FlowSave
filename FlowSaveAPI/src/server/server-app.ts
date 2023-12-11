import { Server } from "./server";
import { ServerRouter } from "./server-router";

export class ServerApp {
    private server!: Server;
    private serverRouter!: ServerRouter;
    private port!: number;

    constructor(port: number) {
        this.configureApp(port);
    }

    bootstrap(): void {
        this.server.bootstrap();
    }

    private configureApp(port: number): void {
        this.port = port;
        this.serverRouter = new ServerRouter();
        this.server = new Server(this.port, this.serverRouter);
    }




}