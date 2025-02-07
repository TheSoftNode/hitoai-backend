import express from "express";
import { submitApplication, upload } from "../controllers/application.controller";

const router = express.Router();

router.route("/apply").post(upload, submitApplication);

export default router;


