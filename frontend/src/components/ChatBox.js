import React, { useState, useEffect, useRef } from 'react';
import UploadSection from './UploadSection';

function ChatBox({ documentId, messages, onSendMessage, onReceiveMessage, onUploadSuccess }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setUserScrolledUp(false);
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setUserScrolledUp(distanceFromBottom > 100);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    onSendMessage(userMsg);
    setInput('');
    setLoading(true);
    scrollToBottom();
    try {
      const response = await fetch(documentId ? '/rag-chat' : '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          documentId
            ? { message: input, document_id: documentId }
            : { message: input }
        ),
      });
      const data = await response.json();
      onReceiveMessage(data.response);
    } catch (err) {
      onReceiveMessage('Failed to get response from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    if (!userScrolledUp) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <div
      style={{
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: '16px',
        height: '500px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 0 12px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: '1rem',
          paddingRight: '8px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: '8px',
              textAlign: msg.sender === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: msg.sender === 'user' ? '#a7f3d0' : '#bfdbfe',
                padding: '8px 12px',
                borderRadius: '16px',
                maxWidth: '80%',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                fontWeight: msg.text.includes('Document uploaded') ? 'bold' : 'normal',
              }}
            >
              {msg.sender === 'user' ? (
                msg.text
              ) : (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: 'left', color: '#666', fontStyle: 'italic' }}>
            Generating...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {userScrolledUp && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: '85px',
            right: '16px',
            background: '#e0e7ff',
            border: '1px solid #93c5fd',
            borderRadius: '50%',
            padding: '6px 10px',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          ⬇️
        </button>
      )}

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <UploadSection
          onUploadSuccess={(docId) => {
            onUploadSuccess(docId);  // <-- Pass docId to App.js
          }}
          style={{
            padding: '0',
            marginRight: '8px',
          }}
        />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: '16px',
            border: '1px solid #ccc',
            backgroundColor: '#ffffff',
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: '10px 16px',
            borderRadius: '16px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            fontWeight: 'bold',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
