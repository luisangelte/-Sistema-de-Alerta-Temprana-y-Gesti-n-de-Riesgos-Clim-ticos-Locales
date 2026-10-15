    import { DataSource } from "typeorm";
    import dotenv from "dotenv";
    import { User } from "../entities/User";
    import envs from "../config/environment-vars";

    export const AppDataSource = new DataSource({
    type: "postgres",
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    schema: "users",
    synchronize: true,
    logging: true,
    entities: [User],
    });

    //conectar a la BD
    export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("conectado a la base de datos postgresSQL");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);}
        
    };  
    