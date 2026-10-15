import  joi from 'joi';
import { constrainedMemory } from "process";

export type ReturnUserData = {
  name: string;
  email: string;
  password: string;
  status: number;
};

type ValidationUserData = {
  error: joi.ValidationError | undefined;
  value: ReturnUserData;
};

function validateUserData(data: any): ValidationUserData {
  const userSchema = joi.object({
    name: joi
      .string()
      .trim()
      .min(3)
      .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/)
      .required()
      .messages({
        "string.base": "El nombre debe ser un texto",
        "string.empty": "El nombre es requerido",
        "string.min": "El nombre debe tener al menos 3 caracteres",
        "string.pattern.base":
          "El nombre solo puede contener letras y un espacio",
      }),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Correo electrónico no válido",
        "string.empty": "El correo es requerido",
      }),
    password: joi
      .string()
      .min(6)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .required()
      .messages({
        "string.min": "La contraseña debe tener al menos 6 caracteres",
        "string.pattern.base": "La contraseña debe tener letras y números",
        "string.empty": "La contraseña es requerida",
      }),

       status: joi
      .number()
      .integer()
      .valid(0, 1)
      .required(),
      
  }).unknown(false);

  const {error, value} = userSchema.validate(data,{abortEarly:false});
  return {error, value};
}
  export const loadUserData = (data: any): ReturnUserData => {
  const result = validateUserData(data);
  if (result.error) {
    // Une todos los mensajes en una sola cadena (o podrías retornar un array)
    const message = result.error.details.map(d => d.message).join(', ');
    throw new Error(message);
  }

  return result.value;
}


