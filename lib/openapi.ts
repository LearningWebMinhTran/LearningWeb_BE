function makeCrudPaths(
  basePath: string,
  tag: string,
  collectionLabel: string,
  itemLabel: string
) {
  const idParam = [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'MongoDB ObjectId',
    },
  ];

  const listResponses = {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SuccessList' },
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  };

  const itemResponses = {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SuccessItem' },
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  };

  return {
    [basePath]: {
      get: {
        tags: [tag],
        summary: `List ${collectionLabel}`,
        responses: listResponses,
      },
      post: {
        tags: [tag],
        summary: `Create ${itemLabel}`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AnyObject' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessItem' },
              },
            },
          },
          400: itemResponses[400],
        },
      },
    },
    [`${basePath}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Get ${itemLabel}`,
        parameters: idParam,
        responses: itemResponses,
      },
      put: {
        tags: [tag],
        summary: `Update ${itemLabel}`,
        parameters: idParam,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AnyObject' },
            },
          },
        },
        responses: itemResponses,
      },
      delete: {
        tags: [tag],
        summary: `Delete ${itemLabel}`,
        parameters: idParam,
        responses: itemResponses,
      },
    },
  };
}

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'LearningWebBE API',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/',
    },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Assets' },
    { name: 'Categories' },
    { name: 'Contents' },
    { name: 'Courses' },
    { name: 'Users' },
    { name: 'UserNotes' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Conflict',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessItem' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    ...makeCrudPaths('/api/assets', 'Assets', 'assets', 'asset'),
    ...makeCrudPaths('/api/categories', 'Categories', 'categories', 'category'),
    ...makeCrudPaths('/api/contents', 'Contents', 'contents', 'content'),
    ...makeCrudPaths('/api/courses', 'Courses', 'courses', 'course'),
    ...makeCrudPaths('/api/users', 'Users', 'users', 'user'),
    ...makeCrudPaths('/api/user-notes', 'UserNotes', 'user notes', 'user note'),
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      AnyObject: {
        type: 'object',
        additionalProperties: true,
      },
      SuccessItem: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: '#/components/schemas/AnyObject' },
        },
        required: ['success'],
      },
      SuccessList: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/AnyObject' },
          },
        },
        required: ['success'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' },
        },
        required: ['success', 'error'],
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: { $ref: '#/components/schemas/AnyObject' },
            },
            required: ['token', 'user'],
          },
        },
        required: ['success', 'data'],
      },
    },
  },
} as const;

export default openApiSpec;
