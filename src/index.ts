#!/usr/bin/env node

/**
 * Instagram Analytics MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { InstagramClient } from './platforms/instagram/client.js';
import { getAllTools } from './tools.js';
import { PROMPTS, getPromptContent } from './prompts.js';
import { handleInstagramTool } from './handlers.js';
import { logger } from './utils/logger.js';
import { serializeForClient } from './utils/redact.js';

// Load environment variables
dotenv.config();

// Package version kept in sync
const VERSION = '3.0.0';

// Initialize client
const instagramClient = process.env.INSTAGRAM_ACCESS_TOKEN
  ? new InstagramClient({
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      accountId: process.env.INSTAGRAM_ACCOUNT_ID,
      apiVersion: process.env.INSTAGRAM_API_VERSION,
    })
  : null;

/**
 * Create and configure the MCP server
 */
export function createServer() {
  const server = new Server(
    {
      name: 'instagram-analytics-mcp',
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
    }
  );

  // Helper to format success responses
  function formatSuccess(data: unknown) {
    return {
      content: [
        {
          type: 'text' as const,
          text: serializeForClient(data),
        },
      ],
    };
  }

  // Helper to format error responses
  function formatError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text' as const,
          text: serializeForClient({ error: message }),
        },
      ],
      isError: true,
    };
  }

  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getAllTools(),
    };
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleInstagramTool(name, (args ?? {}) as Record<string, unknown>, instagramClient);
      return formatSuccess(result);
    } catch (error) {
      return formatError(error);
    }
  });

  // Register list prompts handler
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: PROMPTS,
    };
  });

  // Register get prompt handler
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const promptContent = getPromptContent(name, (args ?? {}) as Record<string, string>);
      return promptContent;
    } catch (error) {
      throw new Error(`Failed to get prompt: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  return server;
}

// Create server instance
const server = createServer();

// Export for programmatic usage
export { server, InstagramClient };
export { getAllTools } from './tools.js';
export { PROMPTS, getPromptContent } from './prompts.js';
export { handleInstagramTool } from './handlers.js';
export type { InstagramConfig } from './platforms/instagram/types.js';

// Start server when run directly
const entryPoint = process.argv[1] ? realpathSync(process.argv[1]) : undefined;

if (entryPoint === fileURLToPath(import.meta.url)) {
  const transport = new StdioServerTransport();

  logger.info(`Instagram Analytics MCP Server v${VERSION} starting...`, {
    configured: !!instagramClient,
  });

  server.connect(transport).catch((error) => {
    logger.error('Failed to start server', error);
    process.exit(1);
  });
}
