import Joi from "joi";

export const SignUpJoiSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().allow("").optional(), // Optional middle name
    last: Joi.string().min(2).max(256).required(),
  }).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/) // Allow only numbers, 9-11 digits
    .message("Phone number must contain 9 to 11 digits.")
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string()
    .pattern(/((?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-]).{8,20})/)
    .message(
      `Password must be 8-20 characters long and include:
       - One uppercase letter
       - One lowercase letter
       - One number
       - One special character (!@#$%^&*-)`
    )
    .required(),

  image: Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().max(256).allow(""),
  }).required(),

  address: Joi.object({
    state: Joi.string().min(2).max(256).required(),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().positive().required(),
    zip: Joi.number().positive().required(),
  }).required(),

  isBusiness: Joi.boolean().required(),
});
