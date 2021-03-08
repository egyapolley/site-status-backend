const Joi = require("joi");

module.exports ={

    UserRegister: (body) => {

        const schema = Joi.object({
            username: Joi.string()
                .trim()
                .lowercase()
                .label("Username")
                .alphanum()
                .min(2)
                .max(50)
                .required(),
            password: Joi.string()
                .label("Password")
                .min(5)
                .max(255)
                .required()

        });

        return schema.validate(body)

    },
    validateRequest: (body) => {

        const schema = Joi.object({
            lat: Joi.string()
                .required(),

            long: Joi.string()
                .required(),
            site_id: Joi.string()
                .required()
                .trim()
                .max(255),
            site_name: Joi.string()
                .required()
                .trim()
                .max(255),
            site_status: Joi.string()
                .required()
                .trim()
                .valid("online","offline"),
        });

        return schema.validate(body)


    },
    validateDelete : (body) =>{
        const schema = Joi.object({
            site_id: Joi.string()
                .required()
                .trim()
                .max(255),
        });
        return schema.validate(body)


    }



}
