import { Router } from 'express';
import { AuthRouter } from '../auth/auth.router';
import { UserRouter } from '../user/user.router';
import { AccountRouter } from '../account/account.router';
import { SearchRouter } from '../search/search-router';




export class ServerRouter {
    router = Router();
    private authRouter!: AuthRouter;
    private UserRouter!: UserRouter;
    private accountRouter!: AccountRouter;
    private searchRouter!: SearchRouter;


    constructor() {
        this.configureRouter();
        this.configureRoutes();
    }

    private configureRouter(): void {
        this.authRouter = new AuthRouter();
        this.UserRouter = new UserRouter();
        this.accountRouter = new AccountRouter();
        this.searchRouter = new SearchRouter();
    }
    private configureRoutes(): void {
        this.router.get('/', (req, res) => {
            res.send('Hello World!');
        });
        this.router.use('/user', this.UserRouter.router);
        this.router.use('/auth', this.authRouter.router);
        this.router.use('/account', this.accountRouter.router);
        this.router.use('/search',this.searchRouter.router);
    }

}