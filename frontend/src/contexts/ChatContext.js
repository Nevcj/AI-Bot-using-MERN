import React, { createContext, useState, useEffect, useContext } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    // Fetch conversations when user logs in
    useEffect(() => {
        if (user) {
            fetchConversations();
        } else {
            setConversations([]);
            setCurrentConversation(null);
            setMessages([]);
        }
    }, [user]);

    // Fetch messages when current conversation changes
    useEffect(() => {
        if (currentConversation) {
            fetchMessages(currentConversation._id);
        } else {
            setMessages([]);
        }
    }, [currentConversation]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await chatAPI.getConversations();
            setConversations(response.data);

            // Set current conversation to the most recent one if not already set
            if (response.data.length > 0 && !currentConversation) {
                setCurrentConversation(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setError('Failed to load conversations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chatAPI.getMessages(conversationId);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const createConversation = async (title = 'New Conversation') => {
        try {
            setLoading(true);
            setError(null);
            const response = await chatAPI.createConversation(title);
            const newConversation = response.data;

            setConversations([newConversation, ...conversations]);
            setCurrentConversation(newConversation);
            setMessages([]);

            return newConversation;
        } catch (error) {
            console.error('Error creating conversation:', error);
            setError('Failed to create conversation. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content) => {
        if (!currentConversation) {
            // Create a new conversation if none exists
            try {
                const conversation = await createConversation();
                await sendMessageToConversation(conversation._id, content);
            } catch (error) {
                console.error('Failed to create conversation and send message:', error);
                setError('Failed to send message. Please try again.');
            }
        } else {
            await sendMessageToConversation(currentConversation._id, content);
        }
    };

    const sendMessageToConversation = async (conversationId, content) => {
        try {
            setError(null);

            // Validate inputs before sending
            if (!conversationId) {
                throw new Error('Conversation ID is missing');
            }

            if (!content || content.trim() === '') {
                throw new Error('Message content cannot be empty');
            }

            // Optimistically add user message to UI
            const tempUserMsg = {
                _id: Date.now().toString(),
                content,
                role: 'user',
                createdAt: new Date().toISOString(),
                conversationId,
                userId: user?.id || 'unknown'
            };

            setMessages(prev => [...prev, tempUserMsg]);

            // Show typing indicator
            setIsTyping(true);

            // Add request timeout
            const requestConfig = {
                timeout: 10000, // 10 second timeout
            };

            try {
                const response = await chatAPI.sendMessage(conversationId, content, requestConfig);
                console.log('Message sent successfully:', response.data);

                // Add AI response
                setMessages(prev => {
                    // Remove temp message and add actual messages from response
                    const filtered = prev.filter(msg => msg._id !== tempUserMsg._id);
                    return [...filtered, response.data.userMessage, response.data.aiMessage];
                });
            } catch (apiError) {
                // Handle specific error types
                let errorMessage = 'Failed to send message. Please try again.';
                if (apiError.response) {
                    // The request was made and the server responded with an error status
                    console.error('Server error:', apiError.response.status, apiError.response.data);
                    if (apiError.response.status === 401 || apiError.response.status === 403) {
                        errorMessage = 'Authentication error. Please log in again.';
                    } else if (apiError.response.status === 500) {
                        errorMessage = 'Server error. Please try again later.';
                    }
                } else if (apiError.request) {
                    // The request was made but no response was received
                    console.error('No response received:', apiError.request);
                    errorMessage = 'No response from server. Please check your connection.';
                } else {
                    // Something happened in setting up the request
                    console.error('Request setup error:', apiError.message);
                }

                // Remove the temporary message or mark it as failed
                setMessages(prev => {
                    const filtered = prev.filter(msg => msg._id !== tempUserMsg._id);
                    return [...filtered, {
                        ...tempUserMsg,
                        status: 'failed',
                        error: errorMessage
                    }];
                });

                // Set error message for UI
                setError(errorMessage);
                throw apiError;
            }
        } catch (error) {
            console.error('Error in sendMessageToConversation:', error);
            setError(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsTyping(false);
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            setError(null);
            await chatAPI.deleteConversation(conversationId);

            // Update conversations list
            setConversations(conversations.filter(conv => conv._id !== conversationId));

            // If the deleted conversation was the current one, set a new current conversation
            if (currentConversation && currentConversation._id === conversationId) {
                const newCurrentConv = conversations.find(conv => conv._id !== conversationId);
                setCurrentConversation(newCurrentConv || null);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            setError('Failed to delete conversation. Please try again.');
        }
    };

    const value = {
        conversations,
        currentConversation,
        messages,
        loading,
        isTyping,
        error,
        fetchConversations,
        createConversation,
        setCurrentConversation,
        sendMessage,
        deleteConversation,
        clearError: () => setError(null)
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};