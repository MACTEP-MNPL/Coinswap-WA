# CoinSwap API Documentation

## Overview
The CoinSwap API provides endpoints for managing cryptocurrency exchange applications and user data. This API allows users to create buy/sell USDT applications and retrieve user information.

## API Documentation Access

### Swagger UI
- **URL**: `http://localhost:8080/api-docs`
- **Description**: Interactive API documentation with the ability to test endpoints directly
- **Features**:
  - Simple API documentation
  - Interactive endpoint testing
  - Request/response examples
  - Real-time API testing

### JSON Schema
- **URL**: `http://localhost:8080/api-docs.json`
- **Description**: Raw OpenAPI 3.0 specification in JSON format

## Base URL
- **Development**: `http://localhost:8080/api/v1`

## Endpoints Overview

### Health Check
- **GET** `/health` - Check API and database status

### Users
- **GET** `/users/{id}` - Get user by ID
- **GET** `/users/telegram_id/{id}` - Get user by Telegram ID

### Applications
- **GET** `/applications/{id}` - Get application by ID
- **GET** `/applications/user/{userId}` - Get user's applications (with filters)
- **POST** `/applications` - Create new application

## Request Examples

### Create Buy Application
```bash
curl -X POST http://localhost:8080/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "buy",
    "blockchain": "trc20",
    "sell_amount": 100000,
    "sell_currency": "RUB",
    "crypto_address": "TQrZ8tVHjVGa2KqKqpQjgVx6TvQ8XrYQFG",
    "first_name": "John",
    "last_name": "Doe",
    "user_id": "A1B2C3D4"
  }'
```

### Create Sell Application
```bash
curl -X POST http://localhost:8080/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "sell",
    "blockchain": "trc20",
    "sell_amount": 100,
    "first_name": "Jane",
    "last_name": "Smith",
    "user_id": "B2C3D4E5"
  }'
```

### Get User Applications with Filters
```bash
# Get all applications for user
curl http://localhost:8080/api/v1/applications/user/A1B2C3D4

# Get only buy applications
curl http://localhost:8080/api/v1/applications/user/A1B2C3D4?type=buy

# Get only new applications
curl http://localhost:8080/api/v1/applications/user/A1B2C3D4?status=new

# Get new buy applications
curl http://localhost:8080/api/v1/applications/user/A1B2C3D4?type=buy&status=new
```

## Status Codes

### Success Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### Error Codes
- `400 Bad Request` - Invalid request data or validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Application Types
- `buy` - Buy USDT with RUB
- `sell` - Sell USDT for RUB

## Application Status
- `new` - Newly created application
- `in_process` - Application is being processed
- `completed` - Application completed successfully
- `rejected` - Application was rejected

## Testing with Swagger UI

1. **Start the server**: `npm run dev` or `npm start`
2. **Open Swagger UI**: Navigate to `http://localhost:8080/api-docs`
3. **Explore endpoints**: Click on any endpoint to see details
4. **Test endpoints**: Use the "Try it out" button to test endpoints directly
5. **View responses**: See real-time responses and examples 