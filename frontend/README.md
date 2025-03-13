# 🚀 Token Dashboard Frontend

A Next.js frontend application that allows users to connect their wallet and view their token balances across multiple networks.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                   # Next.js app router
│   ├── components/            # React components
│   │   ├── Layout/           # Layout components
│   │   └── Tokens/           # Token-related components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── public/                   # Static assets
└── next.config.js           # Next.js configuration
```

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies:
```bash
npm install
```

### Step 2: ⚙️ Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication
NEXT_PUBLIC_SIGN_MESSAGE="Sign this message to verify your wallet ownership"
```

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: `npm run start`

## 🧩 Key Features

### 🔐 Wallet Connection
- Seamless wallet connection using AppKit
- Support for multiple wallet providers
- Secure signature-based authentication

### 💰 Token Management
- View token balances across multiple networks
- Real-time balance updates
- Support for ERC20 tokens

### 🎨 UI/UX
- Responsive Material-UI design
- Dark/Light mode support
- Loading states and error handling
- Toast notifications

## 🔄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗️ Technical Stack

- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI)
- **Wallet Integration**: AppKit
- **State Management**: React Context
- **HTTP Client**: Axios
- **Type Safety**: TypeScript
- **Styling**: Emotion

## 🚀 Future Improvements

### 🎯 Features
- Token price information
- Transaction history
- Portfolio analytics
- Multiple wallet support
- Network switching
- Token search and filtering

### 🎨 UI/UX
- Enhanced loading states
- Better error messages
- Improved mobile responsiveness
- Accessibility improvements
- Animation and transitions

### 🔧 Technical
- State management optimization
- Performance improvements
- Enhanced error handling
- Better type safety
- Unit testing
- E2E testing

### 🔒 Security
- Enhanced wallet validation
- Additional security checks
- Rate limiting
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Notes

- Ensure the backend server is running
- Configure environment variables properly
- Use Node.js version 18 or higher
- Check browser console for debugging
