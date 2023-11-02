import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ServerRouter } from './server-router';

export class Server {
    private app = express();
    private port = 3000;
    constructor(
        private portNumber: number,
        private router: ServerRouter
    ) {
        this.port = portNumber;
        this.configureBodyParser();
        this.configureRoutes();
    }

    bootstrap(): void {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

    private configureBodyParser(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private configureRoutes(): void {
        this.app.use(cors());
        this.app.use('/api', this.router.router);
    }

}