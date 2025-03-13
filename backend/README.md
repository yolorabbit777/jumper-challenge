# 🚀 Jumper challenge backend

A Node.js/Express backend service that provides token balance information and authentication for the Token Dashboard application.

## 📁 Project Structure

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `npm install`

### Step 2: ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Authentication
SIGN_MESSAGE="Sign this message to verify your wallet ownership"

# Token API Configuration
ETHERSCAN_API_KEY=your-etherscan-api-key
POLYGONSCAN_API_KEY=your-polygonscan-api-key
OPTIMISM_API_KEY=your-optimism-api-key
ARBITRUM_API_KEY=your-arbitrum-api-key

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

## 📚 API Documentation

The API documentation is available at `/api-docs` when the server is running. Main endpoints include:

- `POST /api/auth/create` - Create new account/session
- `POST /api/session/verify` - Verify session status
- `GET /api/tokens` - Get token balances
- `GET /api/health` - Health check endpoint

## 🧪 Testing

Run tests using the following commands:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:dev
```

## 🔄 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

## 🚀 Future Improvements

### 🔒 Security
- Implement rate limiting per IP/wallet
- Add request validation middleware
- Enhanced security headers
- DDOS protection
- Session management improvements

### ⚡ Performance
- Add caching layer for token balances
- Optimize database queries
- Implement response compression
- Add connection pooling
- Load balancing

### 🎯 Features
- Support additional networks
- Add historical balance tracking
- Include token price information
- Add transaction history
- WebSocket support for real-time updates

### 🏗️ Infrastructure
- Docker containerization
- CI/CD pipeline setup
- Enhanced monitoring and logging
- Automated backup system
- Horizontal scaling support

### 📈 Code Quality
- Increase test coverage
- Implement API versioning
- Enhance error handling
- Add performance monitoring
- Improve documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request