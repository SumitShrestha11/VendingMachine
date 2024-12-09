import express from "express";
import vendingMachineRoutes from "./http/routes/VendingMachineRoutes";

const app = express();

app.use(express.json());
app.use("/api/v1/vending-machine", vendingMachineRoutes);

export default app;
