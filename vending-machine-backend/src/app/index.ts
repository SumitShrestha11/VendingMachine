const cors = require("cors");
import express from "express";
import { globalErrorHandler } from "./http/middlewares/error.middleware";
import vendingMachineRoutes from "./http/routes/VendingMachineRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(globalErrorHandler);
app.use("/api/v1/vending-machine", vendingMachineRoutes);

export default app;
