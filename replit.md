# Overview

This is a Facebook Messenger chatbot application that integrates with Google's Gemini AI to provide automated responses. The system features a React-based dashboard for configuration and monitoring, with an Express.js backend that handles Facebook webhook integration and AI response generation. The application allows users to configure bot settings, monitor message activity, test responses, and view real-time statistics through a comprehensive web interface.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**2025-08-18**: Fixed image message handling in Facebook Messenger bot:
- Updated `extractMessageData()` in FacebookService to process image attachments, not just text messages
- Enhanced bot to detect and respond to image messages with appropriate Vietnamese responses
- Updated system prompt to better handle image-related conversations
- Added comprehensive logging for debugging image message processing
- Bot now responds when users send images instead of staying silent

**2025-08-18**: Added professional typing indicators and visual feedback to Messenger bot:
- Implemented Facebook typing indicators (typing_on/typing_off)
- Added message seen markers for immediate feedback
- Enhanced user experience with natural conversation flow
- Bot now shows "typing..." animation while AI generates responses
- Improved error handling with graceful typing indicator cleanup

**2025-08-17**: Successfully resolved all deployment issues and created working build pipeline for Render.com:
- Created `build.cjs` production build script that properly handles both client and server builds
- Fixed vite configuration conflicts by using existing vite.config.ts with production environment detection
- Implemented persistent configuration storage using config.json to prevent data loss on server restarts
- Bot fully configured with Facebook Page Access Token, App Secret, Page ID, and Gemini API Key
- Ready for deployment on Render.com with working webhook URL for Facebook integration

**2025-01-17**: Added comprehensive setup guide component with step-by-step instructions for configuring Facebook Messenger bot with Gemini AI integration. The guide includes:
- Facebook App creation and configuration
- Page Access Token and App Secret retrieval
- Webhook setup with verification
- Gemini API key generation
- Connection testing and bot verification
- Interactive expandable sections with links and code examples

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for configuration, testing, and monitoring
- **Webhook Handling**: Facebook Messenger webhook verification and message processing
- **Development Setup**: Vite middleware integration for hot reloading in development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL (@neondatabase/serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios
- **Data Models**: Bot configurations, message logs, and activity statistics

## Authentication and Authorization
- **Facebook Integration**: Webhook verification using app secret and verify token
- **Security**: Cryptographic signature validation for incoming Facebook webhooks
- **Session Management**: Session-based storage using connect-pg-simple for PostgreSQL session store

## External Service Integrations
- **AI Provider**: Google Gemini AI for natural language processing and response generation
- **Social Platform**: Facebook Messenger API for sending and receiving messages
- **Configuration**: Environment-based API key and token management
- **Monitoring**: Real-time connection testing for both Facebook and Gemini services

# External Dependencies

## Core AI Integration
- **@google/genai**: Google Generative AI client for Gemini API integration
- **Configuration**: Supports multiple Gemini models, temperature control, token limits, and safety settings

## Facebook Messenger Integration
- **Facebook Graph API**: For sending messages and webhook management
- **Webhook Security**: HMAC-SHA256 signature verification for secure message handling

## Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation

## UI and Styling Framework
- **@radix-ui/***: Comprehensive collection of accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: For creating type-safe component variants
- **lucide-react**: Icon library for consistent iconography

## Development and Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React support for Vite
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **cmdk**: Command palette component
- **nanoid**: URL-friendly unique ID generator