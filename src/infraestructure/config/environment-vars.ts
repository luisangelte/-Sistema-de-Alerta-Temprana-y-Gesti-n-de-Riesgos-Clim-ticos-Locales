import  joi from 'joi';
import "dotenv/config";
import { error } from 'console';

export type ReturnEnvironmentVars = {
    PORT:number;
    DB_HOST:string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD:string;
    DB_NAME:string;
    
}
type ValidationEnvironmentVars = {
    error: joi.ValidationError | undefined,
    value:ReturnEnvironmentVars
}

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnvironmentVars{
    const envSchema = joi.object({
        PORT: joi.number().required(),
        DB_HOST: joi.string().required(),
        DB_PORT:joi.number().default(3306),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().allow("").optional(),
        DB_NAME:joi.string().required(),

    }).unknown(true);
    const {error,value} = envSchema.validate(vars);
    return {error,value}
}

const loadEnvVars = () : ReturnEnvironmentVars =>{
    //validar los datos 
    const result =  validateEnvVars(process.env);
    if(result.error){
        throw new Error (result.error.message)
    }
    const value = result.value;
    return{
        PORT: value.PORT,
        DB_HOST:value.DB_HOST,
        DB_PORT:value.DB_PORT,
        DB_USER:value.DB_USER,
        DB_PASSWORD:value.DB_PASSWORD,
        DB_NAME:value.DB_NAME,
    }
}

const envs = loadEnvVars();
export default envs;