import fs from "fs-extra";
import path from "path";

export async function generateServiceBasedStructure(
  projectPath: string
): Promise<void> {
  const serviceStructure = {
    // Controllers
    "src/controllers/health.controller.ts": generateServiceHealthController(),
    "src/controllers/user.controller.ts": generateServiceUserController(),

    // Services
    "src/services/health.service.ts": generateServiceHealthService(),
    "src/services/user.service.ts": generateServiceUserService(),
    "src/services/index.ts": generateServiceIndex(),

    // Models
    "src/models/user.model.ts": generateServiceUserModel(),

    // Routes
    "src/routes/health.ts": generateServiceHealthRoute(),
    "src/routes/users.ts": generateServiceUserRoute(),
    "src/routes/index.ts": generateServiceRoutesIndex(),

    // Types
    "src/types/user.types.ts": generateServiceUserTypes(),

    // Validations
    "src/validations/user.validation.ts": generateServiceUserValidation(),

    // Middlewares
    "src/middlewares/auth.ts": generateAuthMiddleware(),
  };

  for (const [filePath, content] of Object.entries(serviceStructure)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content);
  }
}

function generateServiceHealthController(): string {
  return `import { Request, Response } from 'express';
import { healthService } from '../services';

export const healthController = {
  checkHealth: async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await healthService.getHealthStatus();
      res.status(200).json(health);
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Health check failed' 
      });
    }
  }
};
`;
}

function generateServiceUserController(): string {
  return `import { Request, Response } from 'express';
import { userService } from '../services';
import { validateRequest } from '../middlewares/validation';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';

export const userController = {
  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getUsers();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  },

  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  },

  createUser: [
    validateRequest(createUserSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const user = await userService.createUser(req.body);
        res.status(201).json({
          success: true,
          data: user
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to create user'
        });
      }
    }
  ],

  updateUser: [
    validateRequest(updateUserSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const user = await userService.updateUser(id, req.body);
        
        if (!user) {
          res.status(404).json({
            success: false,
            error: 'User not found'
          });
          return;
        }

        res.status(200).json({
          success: true,
          data: user
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to update user'
        });
      }
    }
  ],

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }
  }
};
`;
}

function generateServiceHealthService(): string {
  return `export const healthService = {
  async getHealthStatus() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };
  }
};
`;
}

function generateServiceUserService(): string {
  return `import { CreateUserInput, UpdateUserInput, User } from '../types/user.types';

class UserService {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    // return await UserModel.find();
    return this.users; // Mock data for now
  }

  async getUserById(id: string): Promise<User | null> {
    // return await UserModel.findById(id);
    return this.users.find(user => user.id === id) || null; // Mock data for now
  }

  async createUser(input: CreateUserInput): Promise<User> {
    // const user = new UserModel(input);
    // return await user.save();
    const newUser: User = {
      id: Date.now().toString(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser; // Mock data for now
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    // return await UserModel.findByIdAndUpdate(id, input, { new: true });
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...input,
      updatedAt: new Date()
    };
    return this.users[userIndex]; // Mock data for now
  }

  async deleteUser(id: string): Promise<boolean> {
    // const result = await UserModel.findByIdAndDelete(id);
    // return !!result;
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    this.users.splice(userIndex, 1);
    return true; // Mock data for now
  }
}

export const userService = new UserService();
`;
}

function generateServiceIndex(): string {
  return `export { healthService } from './health.service';
export { userService } from './user.service';
`;
}

function generateServiceUserModel(): string {
  return `import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
});

export const UserModel = model<IUser>('User', userSchema);
`;
}

function generateServiceHealthRoute(): string {
  return `import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.checkHealth);

export default router;
`;
}

function generateServiceUserRoute(): string {
  return `import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
`;
}

function generateServiceRoutesIndex(): string {
  return `import { Router } from 'express';
import healthRoutes from './health';
import userRoutes from './users';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);

export default router;
`;
}

function generateServiceUserTypes(): string {
  return `export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}
`;
}

function generateServiceUserValidation(): string {
  return `import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
});
`;
}

function generateAuthMiddleware(): string {
  return `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    req.user = user;
    next();
  });
};
`;
}
