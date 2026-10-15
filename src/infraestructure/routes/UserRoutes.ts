import { Router } from "express";
import { UserAdapter } from "../adapter/UserAdapter";
import { UserApplication } from "../../Application/UserApplication";
import { UserController } from "../controller/UserController";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();
//iniciaizacion de capas

const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);

//definicion de las rutas
router.post("/login", async (req, res) => {
  await userController.login(req, res);
});

router.post("/users", async (req, res) => {
  try {
    await userController.createUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error en la creación de usuario", error });
  }
});

router.get("/users", authenticateToken, async (req, res) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error en la consulta de datos ", error });
  }
});

router.get("/users/email/:email", authenticateToken, async (req, res) => {
  try {
    await userController.getUserByEmail(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error en la consulta de datos ", error });
  }
});

export default router;
