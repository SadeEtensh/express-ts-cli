# Express-TS 🚀

A powerful CLI tool to generate Express.js boilerplate with TypeScript, supporting both feature-based and service-based architectures.

## Features

- ✅ **Feature-based Architecture** - Organize code by business domains
- ✅ **Service-based Architecture** - Traditional layered architecture
- ✅ **Multiple Databases** - MongoDB, PostgreSQL, MySQL, or None
- ✅ **TypeScript Ready** - Full type safety out of the box
- ✅ **Production Ready** - Includes security, logging, and error handling
- ✅ **Extensible** - Generate new features easily

## Quick Start

### Using npx (Recommended)

```bash
npx express-ts new my-app
```

## 🏗️ Project Structures

### Feature-Based (Recommended)

```bash
src/features/
├── users/
│ ├── users.controller.ts
│ ├── users.service.ts
│ ├── users.routes.ts
│ ├── users.types.ts
│ ├── users.validation.ts
│ └── users.model.ts
└── products/
```

## Service-Based

```bash
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
└── config/
```

## 🧪 Development

cd my-app
npm install
npm run dev # Start development server
npm run build # Build for production
npm test # Run tests
npm run test:coverage # Test with coverage

## 📊 What's Included

## Base Setup

✅ Express.js with TypeScript

✅ TypeScript strict configuration

✅ Environment variables (.env)

✅ ESLint + Prettier

✅ Git ignore

## Database Support

MongoDB: Mongoose with schemas

PostgreSQL: pg with connection pooling

MySQL: mysql2 with promises

None: No database setup

## Enterprise Features

✅ Authentication (JWT, bcrypt)

✅ File upload handling

✅ Email service templates

✅ API documentation (Swagger)

✅ Redis caching setup

✅ Queue system (Bull)
🤝 Contributing
We welcome contributions! Please see CONTRIBUTING.md for details.

## 📄 License

MIT License - see LICENSE file for details.

## ❤️ Support

Issues: GitHub Issues

Discussions: GitHub Discussions

Email: support@express-ts.dev

<div align="center">
Built with ❤️ for the developer community
Save hours, focus on building features!

Get Started • Report Bug • Request Feature

</div>
