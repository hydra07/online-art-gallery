# Online Art Gallery (OAG)

![OAG Logo](./.config/image/logo.svg)

## 📖 Overview

Online Art Gallery (OAG) is a comprehensive platform for sharing, exploring, and managing artworks. The platform enables artists to showcase their work, art enthusiasts to discover and purchase artwork, and administrators to manage the gallery ecosystem.

## ✨ Features

### For Artists

- Create and manage artwork portfolios
- Upload high-quality images with detailed metadata
- Set pricing and availability for works
- Track sales and engagement metrics
- Receive payments directly through the platform

### For Art Enthusiasts

- Discover artwork through advanced search and filtering
- Browse artworks by various categories and styles
- Purchase artworks securely
- Follow favorite artists and receive updates
- Participate in virtual gallery events

### For Administrators

- Comprehensive dashboard for platform management
- User management and moderation tools
- Content moderation and quality control
- Analytics and reporting
- Payment processing and transaction monitoring

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
- [Cloudinary Account](https://cloudinary.com/) - For image storage
- [PayOS Account](https://payos.vn/) - For payment processing (Vietnamese market)
- [OpenAI API Key](https://openai.com/) - For AI features

### Setup

1. Clone the repository

```bash
git clone https://github.com/hydra07/online-art-gallery.git
cd oag
```

1. Run the initialization script to set up the project environment

```powershell
./init.ps1
```

1. Set up environment variables

    - Copy `.env.example` files to `.env` in each project directory
    - Update the environment variables with your configuration

1. Start the development servers

```bash
bun run dev
```

This starts:

- API server (Express backend)
- Client frontend (Next.js)
- Admin dashboard (Next.js)

## 🏗️ Project Architecture

The project follows a monorepo structure with three main components:

1. **API (Backend)**

    - Express.js REST API with TypeScript
    - MongoDB Atlas database with Mongoose ODM
    - JWT authentication and role-based access control
    - Integration with external services (PayOS, Cloudinary, OpenAI)

2. **Client (Frontend)**

    - Next.js 14 with React
    - TypeScript for type safety
    - Tailwind CSS for styling
    - Internationalization support

3. **Client Admin (Dashboard)**
    - Next.js 14 with React
    - TypeScript for type safety
    - Admin-specific components and workflows
    - Advanced data visualization

## 🛠️ Technology Stack

### API (Backend)

- **Core**

    - [Bun](https://bun.sh) - High-performance JavaScript runtime
    - [Express](https://expressjs.com) - Web framework
    - [TypeScript](https://www.typescriptlang.org/) - Type safety

- **Database & Storage**

    - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
        - [Mongoose](https://mongoosejs.com) - ODM
        - [@typegoose/typegoose](https://typegoose.github.io/typegoose/) - TypeScript models
    - [Cloudinary](https://cloudinary.com/) - Cloud-based image storage and transformation

- **Authentication & Security**

    - [JWT](https://jwt.io/) - Token-based auth
    - [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
    - [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs) - OAuth integration
    - [cookie-parser](https://github.com/expressjs/cookie-parser) - Cookie handling
    - [cors](https://github.com/expressjs/cors) - CORS support

- **Real-time Features**

    - [Socket.IO](https://socket.io) - WebSocket implementation for real-time features

- **Validation & Error Handling**

    - [Zod](https://zod.dev) - Schema validation
    - [http-errors](https://github.com/jshttp/http-errors) - HTTP error creation
    - [envalid](https://github.com/af/envalid) - Environment validation

- **Payment Processing**

    - [PayOS](https://payos.vn/) - Vietnamese payment gateway integration

- **AI Integration**

    - [OpenAI](https://openai.com/) - AI models for text and image analysis

- **Logging & Monitoring**
    - [Pino](https://getpino.io) - Logger
    - [pino-http](https://github.com/pinojs/pino-http) - HTTP logging
    - [pino-pretty](https://github.com/pinojs/pino-pretty) - Log formatting

### Client (Frontend)

- **Core**

    - [Next.js 14](https://nextjs.org) - React framework with app router
    - [TypeScript](https://www.typescriptlang.org/) - Type safety
    - [React](https://reactjs.org) - JavaScript library for building user interfaces

- **State Management & Data Fetching**

    - [Zustand](https://zustand-demo.pmnd.rs/) - Client state management
    - [Axios](https://axios-http.com) - HTTP client

- **UI & Styling**

    - [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
    - [Shadcn/ui](https://ui.shadcn.com) - UI component collection
    - [Radix UI](https://www.radix-ui.com) - Headless UI components
    - [Lucide Icons](https://lucide.dev) - Icon library
    - [Three.js](https://threejs.org/) - 3D graphics library
    - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js

- **Forms & Validation**

    - [React Hook Form](https://react-hook-form.com) - Form handling
    - [Zod](https://zod.dev) - Schema validation

- **Authentication**

    - [NextAuth.js](https://next-auth.js.org) - Authentication
    - [JWT](https://jwt.io/) - Token handling

- **Internationalization**
    - [next-intl](https://next-intl-docs.vercel.app) - i18n solution

## 📁 Project Structure

```plaintext
oag/
├── .config/               # Configuration files and scripts
├── .docs/                 # Project documentation
├── .github/               # GitHub workflows and templates
├── api/                   # Express Backend
│   ├── src/
│   │   ├── configs/       # App configurations
│   │   ├── constants/     # Constants and enums
│   │   ├── controllers/   # Request handlers
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── exceptions/    # Custom exceptions
│   │   ├── middleware/    # Custom middlewares
│   │   ├── models/        # Database models
│   │   ├── routers/       # Route definitions
│   │   ├── schemas/       # Validation schemas
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   └── http/              # API endpoint test files
│
├── client/               # Next.js Frontend
│   ├── public/           # Static assets
│   └── src/
│       ├── app/          # App router pages
│       ├── components/   # Reusable components
│       ├── hooks/        # Custom hooks
│       ├── i18n/         # Internationalization
│       ├── lib/          # Utilities
│       ├── messages/     # Translation messages
│       ├── service/      # API services
│       ├── store/        # State management
│       ├── styles/       # Global styles
│       └── types/        # TypeScript types
│
├── client-admin/         # Admin Dashboard (Next.js)
│   ├── public/           # Static assets
│   └── src/
│       ├── app/          # App router pages
│       ├── components/   # Admin-specific components
│       ├── hooks/        # Custom hooks
│       ├── lib/          # Utilities
│       ├── service/      # API services
│       ├── store/        # State management
│       └── types/        # TypeScript types
│
└── package.json          # Root package.json (workspaces)
```

## 🧪 Development Scripts

- **Start all services**

```bash
bun run dev
```

- **Start individual services**

```bash
bun run dev:frontend    # Start Next.js client
bun run dev:backend     # Start Express API
bun run dev:admin       # Start admin dashboard
```

- **Linting & Formatting**

```bash
bun run lint           # Run ESLint on all packages
bun run format         # Format code with Prettier
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/en/api.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [PayOS Documentation](https://payos.vn/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

