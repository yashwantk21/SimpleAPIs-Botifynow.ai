import React, { useState } from 'react';
import ChatBox from './components/ChatBox';

function App() {
  const [documentId, setDocumentId] = useState(null);
  const [messages, setMessages] = useState([]);

  const cleanMarkdown = (text) => {
    return text
      .replace(/#+\s*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/---|\*\*\*|___/g, '');
  };

  const handleUploadSuccess = (docId) => {
    setDocumentId(docId);
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: 'Document uploaded successfully. RAG chat activated.' },
    ]);
  };

  const handleMessageSend = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleBotResponse = (response) => {
    const cleaned = cleanMarkdown(response);
    setMessages((prev) => [...prev, { sender: 'bot', text: cleaned }]);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #dbeafe, #fef9ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '775px',
          background: 'rgba(255, 255, 255, 0.75)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)',
            padding: '1rem 2rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: 'inset 0 0 5px rgba(255,255,255,0.4)',
          }}
        >
          <h1
            className="title"
            style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: '600',
              color: 'white',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
            }}
          >
            BotifyNow.ai
          </h1>
        </div>

        <ChatBox
          documentId={documentId}
          messages={messages}
          onSendMessage={handleMessageSend}
          onReceiveMessage={handleBotResponse}
          onUploadSuccess={handleUploadSuccess} 
        />
      </div>
    </div>
  );
}

export default App;
