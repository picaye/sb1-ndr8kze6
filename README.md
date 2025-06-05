# Swiss Tax Calculator

A comprehensive tax calculation and optimization tool for Swiss tax residents. This application allows users to calculate their taxes across all Swiss cantons and municipalities, with detailed breakdowns and optimization recommendations.

## Features

- **Personal and Financial Information Entry**: Collect user details for tax calculation
- **Cantonal, Municipal, and Federal Tax Calculation**: Accurate tax calculations for all Swiss cantons
- **AI-Powered Tax Optimization**: Smart recommendations for tax savings
- **Multilingual Support**: Available in German, French, Italian, and English
- **Responsive Design**: Works on desktop and mobile devices

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Internationalization**: i18next
- **Building**: Vite

## Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

## Notes on Opening index.html Directly

Due to browser security restrictions (CORS policies), the application cannot be run by opening the `index.html` file directly in a browser. This is a common limitation for modern JavaScript applications that use ES modules.

To view the application:

1. Use the built-in development server (`npm run dev`)
2. Use the preview server after building (`npm run build` && `npm run preview`)
3. Deploy the built files to a web server

## Tax Code Structure

The application implements a comprehensive tax calculation system for Switzerland:

- **Federal Tax**: Progressive tax brackets for single and married taxpayers
- **Cantonal Tax**: Specific tax brackets for major cantons (Zürich, Bern, Geneva, Basel-Stadt, Vaud, Zug) with fallback calculations for other cantons
- **Municipal Tax**: Municipality-specific tax multipliers with canton-based defaults
- **Church Tax**: Where applicable, based on cantonal rates

## Development

The codebase follows a structured approach with:
- Component-based architecture
- Typed interfaces for all data structures
- Utility functions for tax calculations
- Separation of UI and business logic