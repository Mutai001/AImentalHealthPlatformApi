// M-Pesa Router
import { Hono } from "hono";
import { initiateStkPush, stkCallback } from "./mpesa.controller.js";

const mpesaRouter = new Hono();
mpesaRouter.post("/stkpush", initiateStkPush);
mpesaRouter.post("/callback", stkCallback);

export default mpesaRouter;
