import express from "express";
import applicationRouter from "../routes/application.route";

export const mountedRoutes = function (app: any)
{
  app.use(express.json());
  app.use("/api/v1/eep", applicationRouter);
};
