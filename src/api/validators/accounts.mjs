import Joi from "joi";

const register = Joi.object({
    firstName: Joi.string().required().label("First name"),
    lastName: Joi.string().required().label("Last name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    confirmPassword: Joi
        .any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password"),
});

const login = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
});

export default { login, register };
