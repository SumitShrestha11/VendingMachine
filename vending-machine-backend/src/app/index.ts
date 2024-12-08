import express from "express";
import vendingMachineRoutes from "./http/routes/VendingMachineRoutes";

const app = express();

app.use(express.json());
app.use("/api/v1/vending-machine", vendingMachineRoutes);
app.get("/", (req, res) => {
  res.send({ ping: "pong" });
});

export default app;
