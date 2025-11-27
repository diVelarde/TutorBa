import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  User, 
  Search,
  ArrowLeft,
  File,
  Download
} from 'lucide-react';
import '../styles/Chat.css';

// Dummy API (replace with your actual API calls)
const fakeApi = {
  auth: {
    me: async () => ({ id: 1, full_name: 'Student User' })
  },
  entities: {
    Conversation: {
      list: async () => ([
        {
          id: 1,
          participant_1_id: 1,
          participant_1_name: 'Student User',
          participant_2_id: 2,
          participant_2_name: 'Jane Tutor',
          last_message: 'See you tomorrow!',
          last_message_time: new Date().toISOString()
        },
        {
          id: 2,
          participant_1_id: 1,
          participant_1_name: 'Student User',
          participant_2_id: 3,
          participant_2_name: 'Mark Tutor',
          last_message: 'Thanks for the help!',
          last_message_time: new Date().toISOString()
        }
      ]),
      update: async () => true
    },
    Message: {
      filter: async () => ([
        { id: 1, sender_id: 2, sender_name: 'Jane Tutor', content: 'Hi! How can I help you?', created_date: new Date().toISOString() },
        { id: 2, sender_id: 1, sender_name: 'Student User', content: 'I need help with calculus', created_date: new Date().toISOString() },
        { id: 3, sender_id: 2, sender_name: 'Jane Tutor', content: 'Sure! Let\'s schedule a session.', created_date: new Date().toISOString() }
      ]),
      create: async (data) => ({ id: Date.now(), ...data, created_date: new Date().toISOString() })
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => ({ file_url: URL.createObjectURL(file) })
    }
  }
};

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      const user = await fakeApi.auth.me();
      setCurrentUser(user);
      const allConversations = await fakeApi.entities.Conversation.list();
      const userConversations = allConversations.filter(
        c => c.participant_1_id === user.id || c.participant_2_id === user.id
      );
      setConversations(userConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const conversationMessages = await fakeApi.entities.Message.filter({ conversation_id: conversationId });
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !uploading) return;

    try {
      const message = await fakeApi.entities.Message.create({
        conversation_id: selectedConversation.id,
        sender_id: currentUser.id,
        sender_name: currentUser.full_name,
        content: newMessage
      });
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await fakeApi.integrations.Core.UploadFile({ file });
      const message = await fakeApi.entities.Message.create({
        conversation_id: selectedConversation.id,
        sender_id: currentUser.id,
        sender_name: currentUser.full_name,
        content: `Shared a file: ${file.name}`,
        file_url,
        file_name: file.name
      });
      setMessages([...messages, message]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (conversation.participant_1_id === currentUser?.id) {
      return { id: conversation.participant_2_id, name: conversation.participant_2_name };
    }
    return { id: conversation.participant_1_id, name: conversation.participant_1_name };
  };

  const filteredConversations = conversations.filter(c => {
    const other = getOtherParticipant(c);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="chat-spinner"></div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-layout">
          {/* Conversations List */}
          <div className={`chat-sidebar ${selectedConversation ? 'chat-sidebar-hidden' : ''}`}>
            <div className="chat-sidebar-header">
              <h2 className="chat-sidebar-title">Messages</h2>
              <div className="chat-search">
                <Search className="chat-search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="chat-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="chat-conversations-list">
              {filteredConversations.length === 0 ? (
                <div className="chat-empty">
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conversation => {
                  const other = getOtherParticipant(conversation);
                  const isActive = selectedConversation?.id === conversation.id;
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`chat-conversation-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="chat-avatar chat-avatar-rose">
                        {other.name?.[0] || 'U'}
                      </div>
                      <div className="chat-conversation-info">
                        <p className="chat-conversation-name">{other.name}</p>
                        <p className="chat-conversation-preview">
                          {conversation.last_message || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="chat-main">
              {/* Chat Header */}
              <div className="chat-header">
                <button
                  className="chat-back-btn"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="chat-avatar chat-avatar-rose chat-avatar-sm">
                  {getOtherParticipant(selectedConversation).name?.[0] || 'U'}
                </div>
                <h3 className="chat-header-name">
                  {getOtherParticipant(selectedConversation).name}
                </h3>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((message) => {
                  const isOwn = message.sender_id === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`chat-message ${isOwn ? 'chat-message-own' : 'chat-message-other'}`}
                    >
                      <div className={`chat-bubble ${isOwn ? 'chat-bubble-own' : 'chat-bubble-other'}`}>
                        {message.file_url ? (
                          <a
                            href__={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`chat-file-link ${isOwn ? 'chat-file-link-own' : ''}`}
                          >
                            <File size={20} />
                            <span>{message.file_name}</span>
                            <Download size={16} />
                          </a>
                        ) : (
                          <p className="chat-message-text">{message.content}</p>
                        )}
                        <p className={`chat-message-time ${isOwn ? 'chat-message-time-own' : ''}`}>
                          {formatTime(message.created_date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref__={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  ref__={fileInputRef}
                  type="file"
                  className="chat-file-input"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="chat-btn chat-btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="chat-text-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={uploading}
                />
                <button 
                  type="submit" 
                  className="chat-btn chat-btn-send"
                  disabled={uploading || !newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          ) : (
            <div className="chat-placeholder">
              <User size={64} className="chat-placeholder-icon" />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}