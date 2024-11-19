import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import path from "path";
import { PointRoutes } from "../modules/Points/points.routes";
import { MilestoneRoutes } from "../modules/Milestone/milestone.route";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/pointsLevel",
    route: PointRoutes,
  },
  {
    path: "/milestone",
    route: MilestoneRoutes,

  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
