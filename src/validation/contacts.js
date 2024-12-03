import Joi from 'joi';

const phoneNumberPattern = /^\+?\d[\d-]*\d$/;

export const createContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(phoneNumberPattern)
    .required(),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20).pattern(phoneNumberPattern),
  email: Joi.string()
    .min(3)
    .max(20)
    .email({ tlds: { allow: false } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal'),
});
