import fs from "fs-extra";
import path from "path";
import { generateFeatureBasedStructure } from "./feature-based";
import { generateServiceBasedStructure } from "./service-based";

export interface ProjectConfig {
  name: string;
  architecture: "feature" | "service";
  database: "mongodb" | "postgresql" | "mysql" | "none";
}

export async function createProject(
  projectName: string,
  architecture: string,
  database: string
): Promise<void> {
  const projectPath = path.resolve(process.cwd(), projectName);

  // Create project directory
  await fs.ensureDir(projectPath);

  // Generate base structure
  await generateBaseStructure(projectPath, projectName, database);

  // Generate architecture-specific structure
  if (architecture === "feature") {
    await generateFeatureBasedStructure(projectPath);
  } else {
    await generateServiceBasedStructure(projectPath);
  }
}

async function generateBaseStructure(
  projectPath: string,
  projectName: string,
  database: string
): Promise<void> {
  const baseFiles = {
    "package.json": generatePackageJson(projectName, database),
    "tsconfig.json": generateTsConfig(),
    ".env": generateEnvExample(database),
    ".gitignore": generateGitIgnore(),
    "src/app.ts": generateAppTs(database),
    "src/server.ts": generateServerTs(),
    "src/config/database.ts": generateDatabaseConfig(database),
    "src/middlewares/errorHandler.ts": generateErrorHandler(),
    "src/middlewares/validation.ts": generateValidationMiddleware(),
    "src/types/express.d.ts": generateExpressTypes(),
  };

  for (const [filePath, content] of Object.entries(baseFiles)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content);
  }
}

function generatePackageJson(projectName: string, database: string): string {
  const baseDependencies = {
    express: "^4.18.2",
    cors: "^2.8.5",
    helmet: "^6.0.1",
    compression: "^1.7.4",
    morgan: "^1.10.0",
    dotenv: "^16.0.3",
    joi: "^17.7.0",
  };

  const dbDependencies = {
    mongodb: { mongoose: "^6.8.0" },
    postgresql: { pg: "^8.8.0", "pg-hstore": "^2.3.4" },
    mysql: { mysql2: "^2.3.3" },
    none: {},
  };

  const dependencies = {
    ...baseDependencies,
    ...dbDependencies[database as keyof typeof dbDependencies],
  };

  return JSON.stringify(
    {
      name: projectName,
      version: "1.0.0",
      description: "Express TypeScript application",
      main: "dist/server.js",
      scripts: {
        build: "tsc",
        start: "node dist/server.js",
        dev: "ts-node-dev --respawn --transpile-only src/server.ts",
        test: "jest",
      },
      dependencies,
      devDependencies: {
        "@types/express": "^4.17.17",
        "@types/cors": "^2.8.13",
        "@types/compression": "^1.7.2",
        "@types/morgan": "^1.9.3",
        "@types/node": "^18.15.3",
        typescript: "^4.9.5",
        "ts-node-dev": "^2.0.0",
        jest: "^29.4.3",
        "@types/jest": "^29.4.0",
      },
    },
    null,
    2
  );
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        module: "CommonJS",
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"],
    },
    null,
    2
  );
}

function generateEnvExample(database: string): string {
  let dbVars = "";
  switch (database) {
    case "mongodb":
      dbVars = "MONGODB_URI=mongodb://localhost:27017/your-db";
      break;
    case "postgresql":
      dbVars = "POSTGRES_URL=postgresql://user:password@localhost:5432/your-db";
      break;
    case "mysql":
      dbVars = "MYSQL_URL=mysql://user:password@localhost:3306/your-db";
      break;
  }

  return `PORT=3000
NODE_ENV=development
${dbVars}
JWT_SECRET=your-jwt-secret-key`;
}

function generateGitIgnore(): string {
  return `node_modules/
dist/
.env
*.log
.DS_Store
.coverage
`;
}

function generateAppTs(database: string): string {
  const dbImports =
    database !== "none"
      ? `import { connectDatabase } from './config/database';`
      : "";
  const dbConnection = database !== "none" ? `  await connectDatabase();` : "";

  return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
${dbImports}

import errorHandler from './middlewares/errorHandler';

// Import routes
import healthRoutes from './routes/health';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoutes);

// Error handler
app.use(errorHandler);

export const initializeApp = async () => {
${dbConnection}
  return app;
};

export default app;
`;
}

function generateServerTs(): string {
  return `import { initializeApp } from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const app = await initializeApp();
    
    app.listen(PORT, () => {
      console.log(\`🚀 Server running on port \${PORT}\`);
      console.log(\`📝 Environment: \${process.env.NODE_ENV}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
`;
}

function generateDatabaseConfig(database: string): string {
  switch (database) {
    case "mongodb":
      return `import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/express-ts';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
`;
    case "postgresql":
      return `import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log('✅ Connected to PostgreSQL');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export { pool };
`;
    case "mysql":
      return `import mysql from 'mysql2/promise';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mysql.createConnection({
      uri: process.env.MYSQL_URL,
    });
    console.log('✅ Connected to MySQL');
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    process.exit(1);
  }
};
`;
    default:
      return `export const connectDatabase = async (): Promise<void> => {
  console.log('📝 No database configured');
};
`;
  }
}

function generateErrorHandler(): string {
  return `import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  details?: any;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { name: 'CastError', message, statusCode: 404 } as CustomError;
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = { name: 'MongoError', message, statusCode: 400 } as CustomError;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = { name: 'ValidationError', message: message.join(', '), statusCode: 400 } as CustomError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

export default errorHandler;
`;
}

function generateValidationMiddleware(): string {
  return `import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message
      });
      return;
    }
    next();
  };
};
`;
}

function generateExpressTypes(): string {
  return `import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
`;
}
