# LexiVoice Frontend - React

Modern React frontend for the LexiVoice legal chatbot application.

## Features

- ✅ Google OAuth authentication
- ✅ Guest mode support
- ✅ Real-time chat interface
- ✅ Voice recognition (speech-to-text)
- ✅ Voice mode support (Vox Mode)
- ✅ Collapsible sidebar with chat history
- ✅ Responsive design
- ✅ Message loading indicators
- ✅ Clean, modern UI

## Prerequisites

- Node.js 14+ and npm 6+
- Backend running on `http://127.0.0.1:8000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://127.0.0.1:8000
```

## Running the Application

### Development Mode
```bash
npm start
```

The application will open at `http://localhost:3000`

### Build for Production
```bash
npm build
```

The optimized build will be created in the `build/` directory.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── assets/          # Logo, avatars, backgrounds
│   └── fonts/           # Custom fonts
├── src/
│   ├── components/      # React components
│   │   ├── Sidebar.js
│   │   ├── Header.js
│   │   ├── ChatArea.js
│   │   ├── InputArea.js
│   │   └── MessageBubble.js
│   ├── pages/           # Page components
│   │   ├── LoginPage.js
│   │   └── ChatPage.js
│   ├── services/        # API and utility services
│   │   ├── apiService.js
│   │   ├── authService.js
│   │   └── speechService.js
│   ├── styles/          # CSS modules
│   ├── App.js           # Main App component
│   ├── App.css
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── package.json
├── .env.example
└── .gitignore
```

## Components

### Sidebar
- Logo and app title
- Menu items (New Chat, Browse Chats)
- Search functionality for chat history
- User profile section with avatar
- Collapsible toggle

### Header
- App title and tagline
- Guest mode indicator
- Login button (for guest users)

### ChatArea
- Displays messages with auto-scroll
- Message bubbles with different styles for user/bot
- Loading indicators

### InputArea
- Text input field
- Voice mode toggle
- Speech recognition support
- Mode switch for Vox Mode

### MessageBubble
- User and bot message styling
- Loading animations
- Typing indicators

## Services

### apiService.js
Handles API communication with the backend:
```javascript
import { chatService } from './services/apiService';

// Send message to backend
const response = await chatService.sendMessage("your question");
```

### authService.js
Handles Google OAuth and authentication:
```javascript
import { initializeGoogleAuth, renderGoogleButton } from './services/authService';

// Initialize and render Google button
initializeGoogleAuth(callback);
renderGoogleButton('containerId');
```

### speechService.js
Handles speech recognition:
```javascript
import { useSpeechRecognition, startListening } from './services/speechService';

const recognition = useSpeechRecognition();
startListening(recognition, onResult, onError);
```

## Environment Variables

```
REACT_APP_GOOGLE_CLIENT_ID    # Your Google OAuth Client ID
REACT_APP_API_URL             # Backend API URL (default: http://127.0.0.1:8000)
```

## Authentication Flow

1. **Login Page**: User can sign in with Google or continue as guest
2. **User Data**: User information stored in `localStorage`
3. **Session Management**: Automatic redirect based on auth status
4. **Logout**: Clear user data and return to login page

## Keyboard Shortcuts

- **Enter**: Send message (text mode)
- **Click Vox Mode**: Toggle voice input

## Troubleshooting

### Google Button Not Appearing
- Ensure Google Identity Services script is loaded in `public/index.html`
- Check Google Client ID is correct in `.env`

### Speech Recognition Not Working
- Verify browser supports Web Speech API (Chrome, Edge, Safari)
- Check microphone permissions
- Ensure HTTPS or localhost is being used

### API Connection Error
- Verify backend is running on `http://127.0.0.1:8000`
- Check CORS settings in backend
- Verify `REACT_APP_API_URL` in `.env`

### Chat History Not Persisting
- Currently using mock data - implement backend storage for persistence

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

## License

MIT

## Support

For issues or questions, please contact the development team.
