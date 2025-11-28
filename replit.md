# YouTube to MP3 Converter

## Overview

This is a web-based YouTube to MP3 converter application that allows users to convert YouTube videos into downloadable MP3 audio files. The application provides real-time conversion with progress tracking, supports videos up to 2 hours in length, and delivers high-quality audio (128kbps+) without requiring user registration or authentication.

The system is designed as a single-purpose utility tool with a streamlined, conversion-focused interface that prioritizes speed, clarity, and user trust.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Framework:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design system
- Material Design 3 principles adapted for utility-focused interfaces
- Dark/light theme support with local storage persistence

**Design System:**
- Custom color system with HSL-based theming
- Typography: Inter (primary), JetBrains Mono (monospace for technical info)
- Spacing system based on Tailwind's 4-unit scale
- Single-column, mobile-first responsive layout (max-w-3xl containers)
- Focused converter card as the primary UI component

**State Management:**
- React hooks for local component state
- TanStack Query for server state, caching, and data synchronization
- No global state management library (Redux/Zustand) - keeping state local and simple

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and routing
- Node.js runtime with ESM modules
- TypeScript for type safety across the stack

**Conversion Pipeline:**
- Child process spawning for executing media extraction tools
- Direct media stream extraction using open-source toolchain (likely yt-dlp or similar)
- Server-side MP3 conversion and temporary file management
- Progress tracking through status updates and job monitoring

**API Design:**
- RESTful endpoints for conversion job management
- JSON-based request/response format
- Job-based conversion model with status tracking (validating → extracting → converting → ready → error)
- Temporary file storage in `/temp` directory with cleanup

**Request Flow:**
1. Client submits YouTube URL
2. Server validates URL and creates conversion job
3. Backend extracts audio stream using external tools
4. Audio converted to MP3 format
5. File made available for download with metadata (title, duration, size)
6. Client polls or receives job status updates

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using JavaScript Map for conversion job state
- No persistent database required for core functionality
- Session-based job tracking without user accounts

**Database Schema (Drizzle ORM configured but not actively used):**
- PostgreSQL configured via Drizzle ORM
- Neon Database serverless driver ready for future persistence
- Schema defined in `shared/schema.ts` with Zod validation
- Migration support configured but storage currently uses MemStorage

**Future Considerations:**
- The application is architected to easily swap MemStorage for PostgreSQL-backed storage
- Drizzle ORM provides type-safe database operations when persistence is needed
- Current design allows stateless operation without database dependencies

### External Dependencies

**Third-Party Services:**
- YouTube (source platform for video content)
- No paid APIs or AI services required
- No authentication providers (no user accounts)

**Key NPM Packages:**
- `@neondatabase/serverless` - Serverless PostgreSQL driver (configured, not actively used)
- `drizzle-orm` & `drizzle-zod` - Type-safe ORM and schema validation
- `zod` - Runtime schema validation for API requests
- `express` - Web server framework
- `child_process` (Node.js built-in) - For spawning media extraction processes
- `nanoid` - Unique ID generation for jobs

**Frontend Dependencies:**
- `@tanstack/react-query` - Server state management
- `@radix-ui/*` - Headless UI components (20+ primitives)
- `wouter` - Lightweight routing
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` & `clsx` - Component variant styling
- `react-hook-form` & `@hookform/resolvers` - Form management with Zod integration

**Development Tools:**
- `tsx` - TypeScript execution for development
- `esbuild` - Fast JavaScript bundler for server code
- Vite plugins for Replit integration (cartographer, dev banner, runtime error overlay)

**Media Processing:**
- yt-dlp for YouTube video/audio extraction
- FFmpeg for audio format conversion (bundled with yt-dlp audio extraction)
- No direct dependency on external APIs - uses open-source toolchain

### Security & Performance Considerations

**Security:**
- URL validation using Zod schemas before processing
- Filename sanitization to prevent path traversal attacks
- Temporary file cleanup to prevent disk space issues
- No user authentication reduces attack surface

**Performance:**
- In-memory storage for fast job lookups
- ESBuild bundling with external dependency management for optimized cold starts
- Allowlist-based bundling strategy for frequently-used server dependencies
- Progress indicators for user feedback during long conversions

**Scalability Constraints:**
- In-memory storage limits horizontal scaling
- Temporary file storage requires shared filesystem for multi-instance deployment
- No queue system for managing conversion workload
- Single-server architecture without load balancing