import { Router } from 'express';
import { AuthRouter } from '../auth/auth.router';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { UserRouter } from '../user/user.router';
import { UserController } from '../user/user.controller';



export class ServerRouter {
    router = Router();
    private authRouter!: AuthRouter;
    private authController!: AuthController;
    private UserRouter!: UserRouter;
    private userController!: UserController;

    constructor(private authService: AuthService, private userService: UserService) {
        this.configureRouter();
        this.configureRoutes();
        this.configureControllers();
    }

    private configureRouter(): void {
        this.authController = new AuthController(this.authService);
        this.authRouter = new AuthRouter(this.authController);
        this.userController = new UserController(this.userService);
        this.UserRouter = new UserRouter(this.userController);
    }
    private configureRoutes(): void {
        this.router.get('/', (req, res) => {
            res.send('Hello World!');
        });
        this.router.use('/user', this.UserRouter.router);
        this.router.use('/auth', this.authRouter.router);
    }
    private configureControllers(): void {
        this.userController = new UserController(this.userService);
        this.authController = new AuthController(this.authService);
    }
}