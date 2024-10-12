import { Request, Response, NextFunction } from "express";

export function ResponseErrorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).send({ error: error.message });
}

// Required for async/await error handling in Express
export function asyncHandler(fn: any) {
	return (req: Request, res: Response, next: any) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}