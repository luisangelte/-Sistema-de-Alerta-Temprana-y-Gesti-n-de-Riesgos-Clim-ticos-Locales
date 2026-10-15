import { connect } from "http2";
import app from "./infraestructure/web/app"
import  { ServerBootstrap} from "./infraestructure/bootstrap/server.bootstrap";
import { connectDB } from "./infraestructure/config/data-base"

const serverBootstrap = new ServerBootstrap(app);
(async ()=>{
     try {
        const instances = [
            connectDB(), //conexion a la BD
            serverBootstrap.initialize() // Inicializacion del servidor 
        ];
        await Promise.all(instances);
    } catch (error){
        console.log("Error al iniciar la aplicacion ",error);
        process.exit(1);

    }
}  
)();