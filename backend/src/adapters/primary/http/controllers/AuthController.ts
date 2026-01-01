import { Request, Response } from 'express';
import { IAuthUseCase } from '../../../../ports/primary/IAuthUseCase';

export class AuthController {
  constructor(private authUseCase: IAuthUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authUseCase.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.message.includes('already exists') ? 400 : 
                        error.message.includes('required') ? 400 : 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authUseCase.login(req.body);
      res.json(result);
    } catch (error: any) {
      const statusCode = error.message.includes('Invalid credentials') ? 401 : 
                        error.message.includes('required') ? 400 : 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }
}

