import { Router } from "express";
import { UserController } from "./user.controller";
const jwt = require("jsonwebtoken");

export class UserRouter {
  router = Router();

  constructor(private userController: UserController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.get("/", (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "secret", (err: any, decoded: any) => {
          if (!decoded) {
            res.status(401).json({ message: "No id provided" });
          }
          const id = decoded.id;
          if (err) {
            res.status(401).json({ message: "Failed to authenticate token" });
          }
          const user = this.userController.getUser(parseInt(id));
          if (!user) {
            res.status(401).json({ message: "User not found" });
          }
          res.status(200).json(user);
        });
      } catch (err) {
        next(err);
      }
    });
    this.router.get("/dashboard", (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "secret", (err: any, decoded: any) => {
          if (!decoded) {
            res.status(401).json({ message: "No id provided" });
          }
          const id = decoded.id;
          if (err) {
            res.status(401).json({ message: "Failed to authenticate token" });
          }
          const info = this.userController.getInfos(parseInt(id));
          if (!info) {
            res.status(401).json({ message: "Infos not found" });
          }

          res.status(200).json({ info });
        });
      } catch (err) {
        next(err);
      }
    });

    this.router.get("/steps", (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "secret", (err: any, decoded: any) => {
          const id = decoded.id;
          if (err) {
            res.status(401).json({ message: "Failed to authenticate token" });
          }
          const steps = this.userController.getSteps(parseInt(id));
          if (!steps) {
            res.status(401).json({ message: "Steps not found" });
          }
          res.status(200).json(steps);
        });
      } catch (err) {
        next(err);
      }
    });
    this.router.post("/salary", (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "secret", (err: any, decoded: any) => {
          if (!decoded) {
            res.status(401).json({ message: "No id provided" });
          }
          const id = decoded.id;
          const salary = req.body.salary;
          if (err) {
            res.status(401).json({ message: "Failed to authenticate token" });
          }
          const salaryResponse = this.userController.setSalary(
            parseInt(id),
            salary
          );
          if (!salary) {
            throw new Error("Salary not found");
          }
          res.status(200).json(salaryResponse);
        });
      } catch (err) {
        next(err);
      }
    });
    this.router.post("/save", (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "secret", (err: any, decoded: any) => {
          if (!decoded) {
            res.status(401).json({ message: "No id provided" });
          }
          const id = decoded.id;
          const save = req.body.save;
          if (err) {
            res.status(401).json({ message: "Failed to authenticate token" });
          }
          const saveResponse = this.userController.setSave(parseInt(id), save);
          if (!save) {
            res.status(401).json({ message: "Save not found" });
          }
          res.status(200).json(saveResponse);
        });
      } catch (err) {
        next(err);
      }
    });
    this.router.patch("/step/edit", (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          res.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "secret", (err: any, decoded: any) => {
          if (!decoded) {
            res.status(401).json({ message: "No id provided" });
          }
          const id = decoded.id;
          const step = req.body.step;
          if (err) {
            res.status(401).json({ message: "Failed to authenticate token" });
          }
          const stepResponse = this.userController.setStep(parseInt(id), step);
          if (!step) {
            res.status(401).json({ message: "Step not found" });
          }
          res.status(200).json(stepResponse);
        });
      } catch (err) {
        next(err);
      }
    });
  }
}
