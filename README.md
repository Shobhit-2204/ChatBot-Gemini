# 🤖 Gemini Clone - React Edition

A fully functional clone of Google's Gemini AI chat interface built with React and Vite. This application provides an interactive chat experience powered by Google's Gemini API, featuring file uploads, theme toggling, and a beautiful responsive UI.

![Gemini Clone](https://img.shields.io/badge/React-18.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 💬 **Real-time Chat Interface** - Interact with Google's Gemini AI model
- 📎 **File Upload Support** - Upload and analyze images, PDFs, and documents
- 🎨 **Dark/Light Mode** - Toggle between dark and light themes
- 💾 **Local Storage** - Automatically saves chat history
- ⚡ **Typing Effect** - Smooth word-by-word response animation
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🗑️ **Clear History** - Delete all conversations with one click
- 📋 **Copy Messages** - Easy copy-to-clipboard functionality
- 🎯 **Quick Suggestions** - Pre-defined prompts for quick start

## 🚀 Demo

Experience the live application features:
- Ask questions and get AI-powered responses
- Upload images for analysis and description
- Upload documents for summarization
- Switch between dark and light themes
- Persistent chat history across sessions

## 🛠️ Technologies Used

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Google Gemini API** - AI model integration
- **CSS3** - Custom styling with CSS variables
- **Material Symbols** - Google's icon library
- **LocalStorage API** - Client-side data persistence

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn package manager
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/shivamverma0051/Gemini-react.git
cd Gemini-react
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Key**

Open `src/App.jsx` and replace the API key:
```javascript
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
```

⚠️ **Important**: Never commit your actual API key to GitHub!

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
Gemini-react/
├── public/
│   ├── gemini.svg          # Gemini AI icon
│   ├── user.jpg            # User avatar
│   └── vite.svg            # Vite icon
├── src/
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
└── vite.config.js          # Vite configuration
```

## 🎯 Usage

### Basic Chat
1. Type your question in the input field
2. Press Enter or click the send button
3. Wait for the AI response with typing animation

### File Upload
1. Click the 📎 attach icon
2. Select an image, PDF, or document (max 20MB)
3. (Optional) Add a message or question about the file
4. Send to get AI analysis

### Theme Toggle
- Click the light/dark mode icon to switch themes
- Your preference is saved automatically

### Clear Chat
- Click the delete icon to clear all chat history
- Confirmation required before deletion

## 🔑 Environment Variables (Recommended)

For better security, use environment variables:

1. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

2. Update `App.jsx`:
```javascript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

3. Add `.env` to `.gitignore`

## 🎨 Customization

### Change Colors
Edit CSS variables in `src/App.css`:
```css
:root {
  --text-color: #c5c5c5;
  --primary-color: #242424;
  --secondary-color: #383838;
}
```

### Modify Suggestions
Update the suggestions array in `src/App.jsx`:
```javascript
const suggestions = [
  { text: "Your custom prompt", icon: "lightbulb" }
];
```

## 🐛 Troubleshooting

### API Errors
- Verify your API key is correct and active
- Check API quota limits
- Ensure proper internet connection

### File Upload Issues
- File must be under 20MB
- Supported formats: images, PDFs, .doc, .docx, .txt
- Check browser console for specific errors

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` folder, ready for deployment.

## 🚢 Deployment

Deploy to popular platforms:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shivam Verma**
- GitHub: [@Shobhit-2204](https://github.com/Shobhit-2204/)

## 🙏 Acknowledgments

- Google Gemini API for the powerful AI capabilities
- React and Vite teams for excellent tools
- Google Material Symbols for the icons

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

⭐ If you found this project helpful, please give it a star!
