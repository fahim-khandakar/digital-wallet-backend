import { Router } from "express";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: () => {
      "hello";
    },
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
