# Auth Demo

A modern authentication demo built with Next.js 14, TypeScript, and Tailwind CSS. Features phone number validation, user management, and a clean dashboard interface.

## Features

- **Phone Authentication**: Iranian mobile number validation with multiple input formats
- **User Management**: Fetches random user data from randomuser.me API
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **Form Validation**: Zod schema validation with React Hook Form
- **Type Safety**: Full TypeScript implementation
- **Testing**: Unit tests with Vitest and E2E tests with Playwright

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth route group
│   └── (app)/             # Protected app routes
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   └── ui/                # UI components (shadcn/ui)
├── lib/                   # Utility functions
└── tests/                 # Test files
```

## Phone Validation

Supports three Iranian mobile number formats:
- `09xxxxxxxxx`
- `+989xxxxxxxxx`
- `00989xxxxxxxxx`

All formats are normalized to `+989xxxxxxxxx` for storage.

## License

Private project.