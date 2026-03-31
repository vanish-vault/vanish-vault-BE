import type { Application } from "express";

export const initSwagger = (app: Application) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require("swagger-ui-express");

    const spec = {
      openapi: "3.0.0",
      info: { title: "Vanish Vault API", version: "1.0.0" },
      servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
              email: { type: "string" },
            },
          },
          File: {
            type: "object",
            properties: {
              id: { type: "string" },
              filename: { type: "string" },
              path: { type: "string" },
              status: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          Secret: {
            type: "object",
            properties: {
              id: { type: "string" },
              secretId: { type: "string" },
              title: { type: "string" },
              views: { type: "integer" },
              isBurnable: { type: "boolean" },
              expiresAt: { type: "string", format: "date-time" },
              createdAt: { type: "string", format: "date-time" },
              user: { $ref: "#/components/schemas/User" },
              files: {
                type: "array",
                items: { $ref: "#/components/schemas/File" },
              },
            },
          },
          AuthResponse: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  user: { $ref: "#/components/schemas/User" },
                  accessToken: { type: "string" },
                  refreshToken: { type: "string" },
                },
              },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  details: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
      paths: {
        "/v1/api/auth/register": {
          post: {
            tags: ["Auth"],
            summary: "Register a new user",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      email: { type: "string" },
                      password: { type: "string" },
                    },
                    required: ["username", "email", "password"],
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "Created",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/AuthResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/auth/login": {
          post: {
            tags: ["Auth"],
            summary: "Login with username or email",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      identifier: { type: "string" },
                      password: { type: "string" },
                    },
                    required: ["identifier", "password"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/AuthResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/auth/refresh": {
          post: {
            tags: ["Auth"],
            summary: "Refresh access token using refresh token",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      refreshToken: { type: "string" },
                    },
                    required: ["refreshToken"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        message: { type: "string" },
                        data: {
                          type: "object",
                          properties: {
                            accessToken: { type: "string" },
                            refreshToken: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/auth/google": {
          post: {
            tags: ["Auth"],
            summary: "Login or signup with Google OAuth",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      idToken: {
                        type: "string",
                        description: "Google ID token from OAuth",
                      },
                    },
                    required: ["idToken"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "OK - User logged in or created",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/AuthResponse" },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/secrets": {
          get: {
            tags: ["Secrets"],
            summary: "Get active secrets for the authenticated user",
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                name: "page",
                in: "query",
                schema: { type: "integer", minimum: 1, default: 1 },
              },
              {
                name: "limit",
                in: "query",
                schema: { type: "integer", minimum: 1, default: 10 },
              },
            ],
            responses: {
              "200": {
                description: "List of active secrets",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            totalActive: { type: "integer" },
                            page: { type: "integer" },
                            totalPages: { type: "integer" },
                            secrets: {
                              type: "array",
                              items: { $ref: "#/components/schemas/Secret" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Secrets"],
            summary: "Create a new secret",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      secret: {
                        type: "string",
                        description: "Base64 encoded data",
                      },
                      title: { type: "string" },
                      views: { type: "integer", minimum: 1 },
                      password: { type: "string" },
                      isBurnable: { type: "boolean" },
                      expiresAt: { type: "string", format: "date-time" },
                      ipRange: { type: "string" },
                      files: { type: "array", items: { type: "string" } },
                    },
                    required: ["views", "isBurnable", "expiresAt"],
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "Secret created",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: { $ref: "#/components/schemas/Secret" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/api/secrets/{id}": {
          post: {
            tags: ["Secrets"],
            summary: "Retrieve and consume a secret",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      password: { type: "string" },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Secret retrieved and view count decremented",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          allOf: [{ $ref: "#/components/schemas/Secret" }],
                          properties: {
                            burned: { type: "boolean" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          delete: {
            tags: ["Secrets"],
            summary: "Delete a secret",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              "200": {
                description: "Secret deleted",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/api/secrets/{id}/check": {
          get: {
            tags: ["Secrets"],
            summary: "Check secret metadata",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              "200": {
                description: "Secret metadata",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            views: { type: "integer" },
                            expiresAt: { type: "string", format: "date-time" },
                            isPasswordProtected: { type: "boolean" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/api/files/temp/signed-url": {
          post: {
            tags: ["Files"],
            summary: "Create a temporary signed URL for a file",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      filename: { type: "string" },
                      contentType: { type: "string" },
                      fileSize: { type: "integer" },
                    },
                    required: ["filename", "contentType", "fileSize"],
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "Created",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            filename: { type: "string" },
                            status: { type: "string" },
                            signedUrl: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
              "403": {
                description:
                  "Monthly file upload quota reached (only applies to plans where maxFiles > 0; Pro plan with maxFiles -1 is never blocked)",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: false },
                        error: {
                          type: "object",
                          properties: {
                            message: {
                              type: "string",
                              example:
                                "Monthly file upload limit reached (10 files/month). Resets on the 1st of next month.",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/api/plans": {
          get: {
            tags: ["Plans"],
            summary: "Get all plans",
            responses: {
              "200": {
                description: "Plans retrieved successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                              price: { type: "number" },
                              currency: { type: "string" },
                              limits: {
                                type: "object",
                                properties: {
                                  secrets: { type: "number" },
                                  files: { type: "number" },
                                  storage: { type: "number" },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/api/plans/user-plan": {
          get: {
            tags: ["Plans"],
            summary: "Get user plan",
            security: [{ bearerAuth: [] }],
            responses: {
              "200": {
                description: "User plan retrieved successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            plan: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                price: { type: "number" },
                                currency: { type: "string" },
                                limits: {
                                  type: "object",
                                  properties: {
                                    secrets: { type: "number" },
                                    files: { type: "number" },
                                    storage: { type: "number" },
                                  },
                                },
                              },
                            },
                            usage: {
                              type: "number",
                              description: "Current number of active secrets",
                            },
                            total: {
                              type: "number",
                              description:
                                "Maximum secrets allowed by plan (maxSecrets)",
                            },
                            monthlyFileUploads: {
                              type: "number",
                              description:
                                "Number of files successfully uploaded this calendar month (resets on 1st of each month). Always 0 semantically for unlimited plans.",
                              example: 3,
                            },
                            maxFiles: {
                              type: "number",
                              description:
                                "Maximum file uploads allowed per month by the plan. -1 means unlimited (Pro plan).",
                              example: 10,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/v1/api/payment/create-subscription": {
          post: {
            tags: ["Payment"],
            summary: "Create a subscription",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      planId: { type: "string" },
                    },
                    required: ["planId"],
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "Created",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            entity: { type: "string" },
                            plan_id: { type: "string" },
                            customer_email: { type: "string" },
                            status: { type: "string" },
                            current_start: { type: "string" },
                            current_end: { type: "string" },
                            ended_at: { type: "string" },
                            quantity: { type: "number" },
                            notes: { type: "array" },
                            charge_at: { type: "string" },
                            start_at: { type: "string" },
                            end_at: { type: "string" },
                            auth_attempts: { type: "number" },
                            total_count: { type: "number" },
                            paid_count: { type: "number" },
                            customer_notify: { type: "boolean" },
                            created_at: { type: "number" },
                            expire_by: { type: "number" },
                            short_url: { type: "string" },
                            has_scheduled_changes: { type: "boolean" },
                            change_scheduled_at: { type: "string" },
                            source: { type: "string" },
                            remaining_count: { type: "number" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/payment/transaction-webhook": {
          post: {
            tags: ["Payment"],
            summary: "Transaction webhook",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Transaction webhook",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: { type: "string" },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/user/change-password": {
          post: {
            tags: ["User"],
            summary: "Update password",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      oldPassword: { type: "string" },
                      newPassword: { type: "string" },
                    },
                    required: ["newPassword"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Password updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: { type: "string" },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
        "/v1/api/user/change-name": {
          post: {
            tags: ["User"],
            summary: "Update name",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                    },
                    required: ["name"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Name updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        data: { type: "string" },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
            },
          },
        },
      },
    };

    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(spec));
    console.log("swagger-ui mounted at /swagger");
  } catch (err: any) {
    console.warn("Failed to mount swagger-ui-express:", err?.message || err);
  }
};
