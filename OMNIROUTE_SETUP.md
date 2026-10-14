# OmniRoute Global Installation Guide

This guide explains how to set up and use OmniRoute with the JobsinderMedizin 1.0 project.

## Installation

### Global Installation (Recommended)
```bash
npm install -g omniroute
omniroute --version
```

### Project-Level Installation
The project includes omniroute as a dependency. Use it via npm scripts:
```bash
pnpm omniroute --version
```

## Configuration

OmniRoute configuration for this project is stored in `omniroute.config.yaml`. You can customize:
- Server settings (port, host, environment)
- Provider connections
- Routing strategies
- Caching options
- Logging levels

## Available Commands

### View Status
```bash
pnpm omniroute:status
```

### Start OmniRoute Server
```bash
pnpm omniroute:server
```

### Run Setup Wizard
```bash
pnpm omniroute:setup
```

### Direct OmniRoute Commands
```bash
pnpm omniroute <command> [options]
```

## Global Installation Setup

To enable OmniRoute as a global command for this project:

1. Install globally:
   ```bash
   npm install -g omniroute
   ```

2. Verify installation:
   ```bash
   omniroute --version
   ```

3. Configure your API keys:
   ```bash
   export OMNIROUTE_API_KEY=your-api-key-here
   ```

4. Test the connection:
   ```bash
   omniroute status
   ```

## Using with Next.js

To integrate OmniRoute with your Next.js development workflow:

1. Add to your `.env.local`:
   ```
   OMNIROUTE_API_KEY=your-key
   OMNIROUTE_BASE_URL=http://localhost:3030
   ```

2. Start both servers in separate terminals:
   ```bash
   # Terminal 1: Start Next.js
   pnpm dev

   # Terminal 2: Start OmniRoute
   pnpm omniroute:server
   ```

## Environment Variables

Configure OmniRoute behavior with these environment variables:

- `OMNIROUTE_API_KEY`: Your API key for authentication
- `OMNIROUTE_BASE_URL`: Server base URL (default: http://localhost:3030)
- `OMNIROUTE_CONTEXT`: Server context/profile to use
- `OMNIROUTE_LANG`: CLI display language

## Documentation

For more information, visit:
- [OmniRoute Documentation](https://omniroute.dev)
- Local help: `omniroute --help`
- Command help: `omniroute <command> --help`

## Troubleshooting

### Installation Issues
If omniroute fails to install, try:
```bash
npm cache clean --force
npm install -g omniroute@latest
```

### Connection Issues
Verify the server is running:
```bash
omniroute status
```

### Configuration Issues
Check your config file syntax:
```bash
omniroute config
```
