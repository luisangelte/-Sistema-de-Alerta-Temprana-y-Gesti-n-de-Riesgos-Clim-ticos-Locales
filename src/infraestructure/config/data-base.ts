    import { DataSource } from "typeorm";
    import dotenv from "dotenv";
    import { User } from "../entities/User";
import { ClimateAlertEntity } from "../../modules/alerts/infrastructure/ClimateAlertEntity";
    import envs from "../config/environment-vars";

    export const AppDataSource = new DataSource({
    type: "postgres",
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    schema: "users",
    synchronize: true,
    logging: true,
    entities: [User, ClimateAlertEntity],
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
    
