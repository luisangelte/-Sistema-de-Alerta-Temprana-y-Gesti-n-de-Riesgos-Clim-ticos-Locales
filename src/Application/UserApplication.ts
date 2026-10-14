import bcrypt from "bcryptjs";
import { User } from "../domain/User";
import { UserPort } from "../domain/UserPort";
import { AuthApplication } from "./AuthApplication";

export class UserApplication {
  private port: UserPort;

  constructor(port: UserPort) {
    this.port = port;
  }

  async login(email:string,password:string): Promise<string>{
     const existUser = await this.port.getUserByEmail(email);
    if (!existUser) {
      throw new Error("Credenciales Invalidas");
  }
const passMatch = await bcrypt.compare(password, existUser.password);
if(!passMatch){
  throw new Error("Credenciales Invalidas");
}
const token = AuthApplication.generateToken({
  id:existUser.id,
  email:existUser.email
});
   return token;
}
  async createUser(user: Omit<User, "id">): Promise<number> {
    //Antes de crear un usuario debo validar : el email no existe
    const existUser = await this.port.getUserByEmail(user.email);
    if (existUser) {
      throw new Error("Este email ya está registrado");
    }
    //hasher la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    return this.port.createUser(user);

  }
  async getUserById(id: number): Promise<User | null> {
    return await this.port.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.port.getUserByEmail(email);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.port.getAllUsers();
  }
  async updateUser(id: number, user: Partial<User>): Promise<boolean> {
    const existingUser = await this.port.getUserById(id);
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }
    if (user.email) {
      const emailTaken = await this.port.getUserByEmail(user.email);
      if (emailTaken && emailTaken.id !== id) {
        throw new Error("El email ya está en uso");
      }
    }
    return this.port.updateUser(id, user);
  }
  async deleteUser(id: number): Promise<boolean> {
    return await this.port.deleteUser(id);
  }
}
