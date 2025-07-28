// src/pages/ClientContactPage.jsx

import React, { useState, useEffect, useRef } from 'react';
// FIXED: Import the custom useAuth hook for consistency
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import api from '../services/api';
import './ClientContactPage.css';

const socket = io(import.meta.env.VITE_API_BASE_URL); // Your backend URL

const ClientContactPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [teamRecipientId, setTeamRecipientId] = useState(null);
  // FIXED: Use the custom hook to get the user object
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      // The user object from the context already contains the ID
      if (user?.id) {
        try {
          // 1. Fetch the client's own message history (this is correct)
          const historyResponse = await api.get('/api/messages/my-messages');
          setMessages(historyResponse.data);

          // 2. FIXED: Use a dedicated, secure endpoint to find the support contact.
          // This avoids trying to fetch all users, which is a security risk.
          const supportContactResponse = await api.get('/api/users/support-contact');
          
          if (supportContactResponse.data?._id) {
            setTeamRecipientId(supportContactResponse.data._id);
          } else {
            console.error("Configuration error: No support contact found.");
          }

        } catch (error) {
          console.error("Failed to fetch initial chat data:", error.response || error);
        }
      }
    };
    fetchInitialData();
  }, [user]);

  useEffect(() => {
    // Make sure to use the correct user ID field from your JWT (often 'id' or 'sub')
    const userId = user?.id || user?._id; 
    if (userId) {
      socket.emit('joinRoom', userId);
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
    return () => socket.off('receiveMessage');
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !teamRecipientId) {
        alert("Cannot send message. Support contact not configured.");
        return;
    }
    
    const userId = user?.id || user?._id;
    socket.emit('sendMessage', {
      senderId: userId,
      receiverId: teamRecipientId,
      content: newMessage,
      isClientMessage: true,
    });
    setNewMessage('');
  };

  return (
    // ... your JSX is correct
    <div className="page-container">
      <div className="page-header">
        <h1>Contact Support</h1>
      </div>
      <div className="messaging-container" style={{ height: '70vh' }}>
        <div className="chat-panel" style={{ width: '100%' }}>
          <div className="messages-area">
            {messages.map((msg, index) => (
              <div key={msg._id || index} className={`message ${msg.sender._id === (user?.id || user?._id) ? 'sent' : 'received'}`}>
                 <div className="message-bubble">
                      <div className="message-sender">{msg.sender.name}</div>
                      <p>{msg.content}</p>
                    </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="message-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to the team..."
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientContactPage;