import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

export const validate = (schema: z.ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error.name === 'ZodError') {
        const issues = error.issues || error.errors || [];
        const messages = issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        console.error('Validation failed:', JSON.stringify(issues, null, 2));
        return next(new ApiError(400, `Validation Error: ${messages}`));
      }
      next(error);
    }
  };
};
