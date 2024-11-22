import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import path from "path";
import { PointRoutes } from "../modules/Points/points.routes";
import { MilestoneRoutes } from "../modules/Milestone/milestone.route";
import { StarrdRoutes } from "../modules/Starrd/starrd.route";
import { CategoriesRoutes } from "../modules/Categories/categories.route";
import { CompanyRoutes } from "../modules/Company/company.route";
import { ServiceRoutes } from "../modules/Service/service.route";


const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/pointsLevel',
    route: PointRoutes,
  },
  {
    path: '/milestone',
    route: MilestoneRoutes,
  },
  {
    path: '/starrd',
    route: StarrdRoutes,
  },
  {
    path: '/categories',
    route: CategoriesRoutes,
  },
  {
    path: '/company',
    route: CompanyRoutes,
  },
  {
    path: '/service',
    route: ServiceRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
