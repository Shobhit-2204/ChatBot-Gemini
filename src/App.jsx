import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isResponseGenerating, setIsResponseGenerating] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatListRef = useRef(null);
  const fileInputRef = useRef(null);

  // API configuration - REPLACE WITH YOUR API KEY
  const GEMINI_API_KEY = "AIzaSyCH8yjuMdEQxuDjKcMzZRLP4x9caiwc3uk";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Suggestions data
  const suggestions = [
    {
      text: "Help me plan a game night with my 5 best friend for under $100",
      icon: "draw"
    },
    {
      text: "Whaat is the best way to learn coding",
      icon: "lightbulb"
    },
    {
      text: "Can you help me find the latest news on web devlopment?",
      icon: "explore"
    },
    {
      text: "Write javascript code ro sum all ekements in an array",
      icon: "code"
    }
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("savedChats");
    const savedTheme = localStorage.getItem("themeColor");

    if (savedTheme === "light_mode") {
      setIsLightMode(true);
    }

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setMessages(parsedChats);
      } catch (error) {
        console.error("Error parsing saved chats:", error);
      }
    }
  }, []);

  // Apply theme to body
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add("light_mode");
    } else {
      document.body.classList.remove("light_mode");
    }
  }, [isLightMode]);

  // Apply hide-header class
  useEffect(() => {
    if (messages.length > 0) {
      document.body.classList.add("hide-header");
    } else {
      document.body.classList.remove("hide-header");
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("savedChats", JSON.stringify(messages));
    }
  }, [messages]);

  // Generate API response
  const generateAPIResponse = async (messageIndex, userText, fileData = null) => {
    try {
      // Prepare the parts array for the API request
      const parts = [];
      
      // Add text part
      if (userText) {
        parts.push({ text: userText });
      }
      
      // Add file data if present
      if (fileData) {
        parts.push({
          inline_data: {
            mime_type: fileData.mimeType,
            data: fileData.data
          }
        });
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: parts
          }]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      // Get the API response text and remove markdown asterisks
      let apiResponse = data?.candidates[0]?.content?.parts[0]?.text || 'No response received';
      
      // Remove markdown formatting for clean display
      apiResponse = apiResponse.replace(/\*\*(.*?)\*\*/g, '$1');
      
      // Show typing effect
      showTypingEffect(apiResponse, messageIndex);

    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = {
          ...updated[messageIndex],
          text: error.message,
          isError: true,
          isLoading: false
        };
        return updated;
      });
      setIsResponseGenerating(false);
    }
  };

  // Show typing effect
  const showTypingEffect = (text, messageIndex) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = {
          ...updated[messageIndex],
          text: words.slice(0, currentWordIndex + 1).join(' '),
          isLoading: false
        };
        return updated;
      });

      currentWordIndex++;

      if (currentWordIndex === words.length) {
        clearInterval(typingInterval);
        setIsResponseGenerating(false);
      }
    }, 75);
  };

  // Handle outgoing chat
  const handleOutgoingChat = async (message) => {
    const textToSend = message || userMessage.trim();
    if ((!textToSend && !selectedFile) || isResponseGenerating) return;

    setIsResponseGenerating(true);

    let fileData = null;
    let displayText = textToSend;

    // Process file if selected
    if (selectedFile) {
      try {
        const base64Data = await fileToBase64(selectedFile);
        fileData = {
          data: base64Data,
          mimeType: selectedFile.type
        };
        
        // Add file info to display text
        displayText = `${textToSend || 'Analyze this file'}\n📎 ${selectedFile.name}`;
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Failed to process file. Please try again.');
        setIsResponseGenerating(false);
        return;
      }
    }

    // Add user message
    setMessages(prev => [...prev, {
      type: 'outgoing',
      text: displayText,
      hasFile: !!selectedFile
    }]);

    setUserMessage('');
    const currentFile = selectedFile;
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Add loading message after a delay
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev, {
          type: 'incoming',
          text: '',
          isLoading: true
        }];
        
        // Generate response for the last incoming message
        setTimeout(() => {
          generateAPIResponse(newMessages.length - 1, textToSend || 'What can you tell me about this file?', fileData);
        }, 100);
        
        return newMessages;
      });
    }, 500);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleOutgoingChat();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestionText) => {
    handleOutgoingChat(suggestionText);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newLightMode = !isLightMode;
    setIsLightMode(newLightMode);
    localStorage.setItem("themeColor", newLightMode ? "light_mode" : "dark_mode");
  };

  // Delete chat
  const deleteChat = () => {
    if (window.confirm("Are you sure you want to delete all messages?")) {
      localStorage.removeItem("savedChats");
      setMessages([]);
    }
  };

  // Copy message
  const copyMessage = (text, event) => {
    navigator.clipboard.writeText(text);
    const icon = event.currentTarget;
    icon.innerText = "done";
    setTimeout(() => icon.innerText = "content_copy", 1000);
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 20MB for Gemini API)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size must be less than 20MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="header">
        <h2 className="title">Hello, there</h2>
        <h4 className="subtitle">How can I help you today?</h4>

        <ul className="suggestion-list">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              className="suggestion"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <h4 className="text">{suggestion.text}</h4>
              <span className="icon material-symbols-rounded">{suggestion.icon}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="chat-list" ref={chatListRef}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.type} ${message.isLoading ? 'loading' : ''}`}
          >
            <div className="message-content">
              <img 
                src={message.type === 'outgoing' ? '/user.jpg' : '/gemini.svg'} 
                alt={message.type === 'outgoing' ? 'user image' : 'gemini image'} 
                className="avatar"
              />
              <p className={`text ${message.isError ? 'error' : ''}`}>
                {message.text}
              </p>
              {message.isLoading && (
                <div className="loading-indicator">
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                </div>
              )}
            </div>
            {message.type === 'incoming' && (
              <span 
                onClick={(e) => copyMessage(message.text, e)}
                className="icon material-symbols-rounded"
              >
                content_copy
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="typing-area">
        <form onSubmit={handleSubmit} className="typing-form">
          {selectedFile && (
            <div className="file-preview">
              <div className="file-chip">
                <span className="icon material-symbols-rounded">description</span>
                <span className="file-name">{selectedFile.name}</span>
                <span 
                  className="icon material-symbols-rounded file-close-icon"
                  onClick={removeFile}
                  title="Remove file"
                >
                  close
                </span>
              </div>
            </div>
          )}
          <div className="input-wrapper">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <span 
              className="icon material-symbols-rounded file-upload-btn"
              onClick={triggerFileInput}
              title="Upload file"
            >
              attach_file
            </span>
            <input 
              type="text" 
              placeholder={selectedFile ? "Add a message (optional)" : "Enter a prompt here"}
              className="typing-input"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required={!selectedFile}
            />
            <button 
              type="submit" 
              className="icon material-symbols-rounded"
            >
              send
            </button>
          </div>
          <div className="action-button">
            <span 
              id="toggle-theme-button" 
              className="icon material-symbols-rounded"
              onClick={toggleTheme}
            >
              {isLightMode ? 'dark_mode' : 'light_mode'}
            </span>
            <span 
              id="delete-chat-button" 
              className="icon material-symbols-rounded"
              onClick={deleteChat}
            >
              delete
            </span>
          </div>
        </form>
        
        <p className="disclaimer-text">
          Gemini may display inaccurate info, including about people, so double-check it's response.
        </p>
      </div>
    </>
  )
}

export default App