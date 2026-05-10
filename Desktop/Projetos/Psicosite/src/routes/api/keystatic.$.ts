import { createFileRoute } from '@tanstack/react-router';
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from '../../../keystatic.config';

const handler = makeGenericAPIRouteHandler({
  config,
  localBaseDirectory: process.cwd(),
  apiPrefix: '/api/keystatic',
});

export const Route = createFileRoute('/api/keystatic/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const response = await handler(request);
          return new Response(response.body, {
            status: response.status,
            headers: response.headers as HeadersInit,
          });
        } catch (error) {
          console.error('Keystatic API Error:', error);
          return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const response = await handler(request);
          return new Response(response.body, {
            status: response.status,
            headers: response.headers as HeadersInit,
          });
        } catch (error) {
          console.error('Keystatic API Error:', error);
          return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
