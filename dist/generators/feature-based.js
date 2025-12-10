"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFeatureBasedStructure = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function generateFeatureBasedStructure(projectPath, featureName) {
    if (featureName) {
        await generateFeature(projectPath, featureName);
    }
    else {
        await generateInitialFeatureStructure(projectPath);
    }
}
exports.generateFeatureBasedStructure = generateFeatureBasedStructure;
// export async function generateFeatureBasedStructure(
//   projectPath: string,
//   featureName?: string
// ): Promise<void> {
//   if (featureName) {
//     await generateFeature(projectPath, featureName);
//   } else {
//     await generateInitialFeatureStructure(projectPath);
//   }
// }
async function generateInitialFeatureStructure(projectPath) {
    const featureStructure = {
        // Health feature
        "src/features/health/health.controller.ts": generateHealthController(),
        "src/features/health/health.service.ts": generateHealthService(),
        "src/features/health/health.routes.ts": generateHealthRoutes(),
        "src/features/health/health.types.ts": generateHealthTypes(),
        "src/features/health/health.validation.ts": generateHealthValidation(),
        // User feature example
        "src/features/users/users.controller.ts": generateUserController(),
        "src/features/users/users.service.ts": generateUserService(),
        "src/features/users/users.routes.ts": generateUserRoutes(),
        "src/features/users/users.types.ts": generateUserTypes(),
        "src/features/users/users.validation.ts": generateUserValidation(),
        "src/features/users/users.model.ts": generateUserModel(),
        // Routes index
        "src/routes/health.ts": generateHealthRouteIndex(),
        "src/routes/users.ts": generateUserRouteIndex(),
        "src/routes/index.ts": generateRoutesIndex(),
    };
    for (const [filePath, content] of Object.entries(featureStructure)) {
        const fullPath = path_1.default.join(projectPath, filePath);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(fullPath));
        await fs_extra_1.default.writeFile(fullPath, content);
    }
}
async function generateFeature(projectPath, featureName) {
    const featureDir = path_1.default.join(projectPath, "src", "features", featureName);
    // Check if we're in a valid project structure
    if (!(await isValidProjectStructure(projectPath))) {
        throw new Error("Not a valid express-ts project. Please run this command in a project created with express-ts.");
    }
    const featureFiles = {
        [`${featureName}.controller.ts`]: generateFeatureController(featureName),
        [`${featureName}.service.ts`]: generateFeatureService(featureName),
        [`${featureName}.routes.ts`]: generateFeatureRoutes(featureName),
        [`${featureName}.types.ts`]: generateFeatureTypes(featureName),
        [`${featureName}.validation.ts`]: generateFeatureValidation(featureName),
        [`${featureName}.model.ts`]: generateFeatureModel(featureName),
    };
    await fs_extra_1.default.ensureDir(featureDir);
    for (const [fileName, content] of Object.entries(featureFiles)) {
        const filePath = path_1.default.join(featureDir, fileName);
        await fs_extra_1.default.writeFile(filePath, content);
    }
    // Update routes index
    await updateRoutesIndex(projectPath, featureName);
}
// Helper function to validate project structure
async function isValidProjectStructure(projectPath) {
    const requiredPaths = [
        "src/features",
        "src/routes",
        "package.json",
        "tsconfig.json",
    ];
    for (const requiredPath of requiredPaths) {
        const fullPath = path_1.default.join(projectPath, requiredPath);
        if (!(await fs_extra_1.default.pathExists(fullPath))) {
            return false;
        }
    }
    return true;
}
// async function generateFeature(
//   projectPath: string,
//   featureName: string
// ): Promise<void> {
//   const featureDir = path.join(projectPath, "src", "features", featureName);
//   const featureFiles = {
//     [`${featureName}.controller.ts`]: generateFeatureController(featureName),
//     [`${featureName}.service.ts`]: generateFeatureService(featureName),
//     [`${featureName}.routes.ts`]: generateFeatureRoutes(featureName),
//     [`${featureName}.types.ts`]: generateFeatureTypes(featureName),
//     [`${featureName}.validation.ts`]: generateFeatureValidation(featureName),
//     [`${featureName}.model.ts`]: generateFeatureModel(featureName),
//   };
//   await fs.ensureDir(featureDir);
//   for (const [fileName, content] of Object.entries(featureFiles)) {
//     const filePath = path.join(featureDir, fileName);
//     await fs.writeFile(filePath, content);
//   }
//   // Update routes index
//   await updateRoutesIndex(projectPath, featureName);
// }
// Template generators for feature files
function generateHealthController() {
    return `import { Request, Response } from 'express';
import { HealthService } from './health.service';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  checkHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await this.healthService.getHealthStatus();
      res.status(200).json(health);
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Health check failed' 
      });
    }
  };
}

export default new HealthController();
`;
}
function generateHealthService() {
    return `import { HealthStatus } from './health.types';

export class HealthService {
  async getHealthStatus(): Promise<HealthStatus> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };
  }
}

export default new HealthService();
`;
}
function generateHealthRoutes() {
    return `import { Router } from 'express';
import HealthController from './health.controller';

const router = Router();

router.get('/', HealthController.checkHealth);

export default router;
`;
}
function generateHealthTypes() {
    return `export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  version: string;
}
`;
}
function generateHealthValidation() {
    return `import Joi from 'joi';

export const healthValidation = {
  // Add validation schemas if needed for health endpoints
};
`;
}
function generateHealthRouteIndex() {
    return `import { Router } from 'express';
import healthRoutes from '../features/health/health.routes';

const router = Router();

router.use('/', healthRoutes);

export default router;
`;
}
// User feature templates (as example)
function generateUserController() {
    return `import { Request, Response } from 'express';
import { UserService } from './users.service';
import { CreateUserInput, UpdateUserInput } from './users.types';
import { validateRequest } from '../../middlewares/validation';
import { createUserSchema, updateUserSchema } from './users.validation';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
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
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
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
  };

  createUser = [
    validateRequest(createUserSchema),
    async (req: Request<{}, {}, CreateUserInput>, res: Response): Promise<void> => {
      try {
        const user = await this.userService.createUser(req.body);
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
  ];

  updateUser = [
    validateRequest(updateUserSchema),
    async (req: Request<{ id: string }, {}, UpdateUserInput>, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const user = await this.userService.updateUser(id, req.body);
        
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
  ];

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.userService.deleteUser(id);
      
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
  };
}

export default new UserController();
`;
}
function generateUserService() {
    return `import { CreateUserInput, UpdateUserInput, User } from './users.types';
// Import your database model here
// import UserModel from './users.model';

export class UserService {
  // In-memory storage for demonstration
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    // Replace with actual database call
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    // Replace with actual database call
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...input,
      updatedAt: new Date()
    };

    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}

export default new UserService();
`;
}
function generateUserRoutes() {
    return `import { Router } from 'express';
import UserController from './users.controller';

const router = Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
`;
}
function generateUserTypes() {
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
function generateUserValidation() {
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
function generateUserModel() {
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
function generateUserRouteIndex() {
    return `import { Router } from 'express';
import userRoutes from '../features/users/users.routes';

const router = Router();

router.use('/', userRoutes);

export default router;
`;
}
function generateRoutesIndex() {
    return `import { Router } from 'express';
import healthRoutes from './health';
import userRoutes from './users';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);

export default router;
`;
}
// Dynamic feature generators
function generateFeatureController(featureName) {
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return `import { Request, Response } from 'express';
import { ${className}Service } from './${featureName}.service';

export class ${className}Controller {
  private ${featureName}Service: ${className}Service;

  constructor() {
    this.${featureName}Service = new ${className}Service();
  }

  // Add your controller methods here
  get${className}s = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.${featureName}Service.get${className}s();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch ${featureName}s'
      });
    }
  };
}

export default new ${className}Controller();
`;
}
function generateFeatureService(featureName) {
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return `import { ${className} } from './${featureName}.types';

export class ${className}Service {
  private ${featureName}s: ${className}[] = [];

  async get${className}s(): Promise<${className}[]> {
    return this.${featureName}s;
  }

  // Add your service methods here
}

export default new ${className}Service();
`;
}
function generateFeatureRoutes(featureName) {
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return `import { Router } from 'express';
import ${className}Controller from './${featureName}.controller';

const router = Router();

router.get('/', ${className}Controller.get${className}s);

// Add more routes as needed

export default router;
`;
}
function generateFeatureTypes(featureName) {
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return `export interface ${className} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Create${className}Input {
  // Add input fields
}

export interface Update${className}Input {
  // Add update fields
}
`;
}
function generateFeatureValidation(featureName) {
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return `import Joi from 'joi';

export const create${className}Schema = Joi.object({
  // Add validation rules
});

export const update${className}Schema = Joi.object({
  // Add validation rules
});
`;
}
function generateFeatureModel(featureName) {
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    return `import { Schema, model, Document } from 'mongoose';

export interface I${className} extends Document {
  // Define your schema fields
  createdAt: Date;
  updatedAt: Date;
}

const ${featureName}Schema = new Schema<I${className}>({
  // Add your schema definition
}, {
  timestamps: true
});

export const ${className}Model = model<I${className}>('${className}', ${featureName}Schema);
`;
}
async function updateRoutesIndex(projectPath, featureName) {
    const routesIndexPath = path_1.default.join(projectPath, "src", "routes", "index.ts");
    const className = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    const newRoute = `import ${featureName}Routes from './${featureName}';\n`;
    const newUse = `router.use('/${featureName}s', ${featureName}Routes);\n`;
    try {
        let content = await fs_extra_1.default.readFile(routesIndexPath, "utf8");
        // Add import
        const importIndex = content.lastIndexOf("import");
        const lastImport = content.indexOf(";", importIndex) + 1;
        content =
            content.slice(0, lastImport) +
                "\n" +
                newRoute +
                content.slice(lastImport);
        // Add route
        const routerUseIndex = content.indexOf("router.use");
        content =
            content.slice(0, routerUseIndex) + newUse + content.slice(routerUseIndex);
        await fs_extra_1.default.writeFile(routesIndexPath, content);
    }
    catch (error) {
        console.warn("Could not update routes index automatically");
    }
}
