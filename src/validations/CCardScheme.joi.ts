// cardSchema.ts
import Joi from 'joi';

const urlRegex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;

export const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string()
    .pattern(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
    .message('card "phone" must be a valid Israeli phone number')
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('card "email" must be a valid email')
    .required(),
  web: Joi.string()
    .pattern(urlRegex)
    .message('card "web" must be a valid URL')
    .allow(""),
  image: Joi.object({
    url: Joi.string()
      .pattern(urlRegex)
      .message('card.image "url" must be a valid URL')
      .allow(""),
    alt: Joi.string().min(2).max(256).allow(""),
  }).required(),
  address: Joi.object({
    state: Joi.string().allow(""),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number(),
  }).required(),
  bizNumber: Joi.number().allow(""),
  user_id: Joi.string().allow(""),
});
