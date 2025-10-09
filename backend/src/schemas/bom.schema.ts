import Joi from 'joi';

const roundModes = ['CEIL', 'FLOOR', 'ROUND', 'NONE'] as const;

export const bomComponentSchema = Joi.object({
  productId: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv1'] })
    .required()
    .messages({ 'string.guid': 'productId must be a UUID' }),
  quantityFormula: Joi.string().allow(null, '').max(1000),
  qtyPerUnit: Joi.number().precision(6).min(0).allow(null),
  unit: Joi.string().allow(null, '').max(50),
  roundMode: Joi.string()
    .valid(...roundModes)
    .default('NONE'),
  note: Joi.string().allow(null, '', ' ').max(1000),
});

export const bomParameterSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z_][A-Za-z0-9_]*$/)
    .required()
    .messages({
      'string.pattern.base':
        'parameter name must be a valid identifier (letters, numbers, underscore, not starting with number)',
    }),
  label: Joi.string().allow(null, '').max(200),
  unit: Joi.string().allow(null, '').max(20),
  default: Joi.number().precision(6).allow(null),
});

export const bomCreateSchema = Joi.object({
  code: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  targetProductId: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv1'] })
    .allow(null),
  wasteFactor: Joi.number().precision(6).min(0).max(1).default(0),
  expectedManufactureTime: Joi.number().integer().min(0).optional(),
  estimatedCost: Joi.number().precision(2).min(0).optional(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'DEPRECATED').optional(),
  parameters: Joi.array().items(bomParameterSchema).optional(),
  components: Joi.array().items(bomComponentSchema).optional(),
});

export const bomUpdateSchema = Joi.object({
  code: Joi.string().trim().optional(),
  name: Joi.string().trim().optional(),
  targetProductId: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv1'] })
    .allow(null)
    .optional(),
  wasteFactor: Joi.number().precision(6).min(0).max(1).optional(),
  expectedManufactureTime: Joi.number().integer().min(0).optional(),
  estimatedCost: Joi.number().precision(2).min(0).optional(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'DEPRECATED').optional(),
  parameters: Joi.array().items(bomParameterSchema).optional(),
  components: Joi.array().items(bomComponentSchema).optional(),
});

export const computeSchema = Joi.object({
  params: Joi.object()
    .pattern(
      /.*/,
      Joi.alternatives().try(
        Joi.number().precision(6),
        Joi.string()
          .trim()
          .pattern(/^-?\d+(\.\d+)?$/) 
      )
    )
    .required(),
}).required();

import { RequestHandler } from 'express';
export function validateBody(schema: Joi.ObjectSchema): RequestHandler {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req.body, {
        abortEarly: false,
        convert: true,
      });
      req.body = value;
      return next();
    } catch (err: any) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Validation error',
          details: err.details || err.message,
        });
    }
  };
}

export default {
  bomCreateSchema,
  bomUpdateSchema,
  computeSchema,
  bomComponentSchema,
  bomParameterSchema,
  validateBody,
};
