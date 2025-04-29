const express = require('express');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const OpenAI = require('openai');

const router = express.Router();

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });  

// Create a new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { title = 'New Conversation' } = req.body;
    const conversation = new Conversation({
      userId: req.user._id,
      title
    });
    
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId: req.user._id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message to AI and get response
router.post('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    
    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId: req.user._id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Save user message
    const userMessage = new Message({
      conversationId,
      userId: req.user._id,
      content,
      role: 'user'
    });
    await userMessage.save();
    
    // Get previous messages for context
    const previousMessages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(10); // Limit to last 10 messages for context
    
    const messageHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message for context
    messageHistory.unshift({
      role: 'system',
      content: 'You are a helpful AI assistant.'
    });
    
    // Get AI response
    const completion = await openai.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: messageHistory,
      });            
    
      const aiResponseContent = completion.choices[0].message.content;
    
    // Save AI response
    const aiMessage = new Message({
      conversationId,
      userId: req.user._id,
      content: aiResponseContent,
      role: 'assistant'
    });
    await aiMessage.save();
    
    res.json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete conversation
router.delete('/conversations/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId: req.user._id 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Delete conversation and related messages
    await Conversation.deleteOne({ _id: conversationId });
    await Message.deleteMany({ conversationId });
    
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;