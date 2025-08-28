import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

export default function AIAssistantScreen({ navigation }) {
  const { user } = useAuth();
  const { isConnected } = useOffline();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `Hello ${user?.name || 'there'}! I'm your AI HR Assistant. I can help you with:

• Check attendance records
• Apply for leave
• View performance metrics
• Get project updates
• Answer HR policy questions
• Schedule meetings
• Generate reports

How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'Show my attendance this month',
        'Apply for sick leave',
        'What are my performance metrics?',
        'Tell me about company policies'
      ]
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    Keyboard.dismiss();

    // Simulate AI processing delay
    setTimeout(() => {
      handleAIResponse(messageText.trim());
    }, 1500);
  };

  const handleAIResponse = async (userInput) => {
    try {
      const response = await generateAIResponse(userInput);
      
      const aiMessage = {
        id: Date.now(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        data: response.data
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage = {
        id: Date.now(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (input) => {
    const lowerInput = input.toLowerCase();

    // Mock AI responses based on keywords
    if (lowerInput.includes('attendance') || lowerInput.includes('check in') || lowerInput.includes('check out')) {
      return {
        content: `📊 **Your Attendance Summary**

**This Month:**
• Total Working Days: 22
• Days Present: 20
• Days Absent: 2
• Attendance Rate: 91%

**Recent Check-ins:**
• Today: 08:15 AM - Working (7h 45m so far)
• Yesterday: 08:00 AM - 17:00 PM (8h)
• Dec 11: 08:30 AM - 17:15 PM (7h 45m)

Your attendance is good, but try to improve consistency for better performance ratings.`,
        suggestions: [
          'Show this week\'s attendance',
          'Set attendance reminder',
          'View attendance policy'
        ]
      };
    }

    if (lowerInput.includes('leave') || lowerInput.includes('vacation') || lowerInput.includes('sick')) {
      return {
        content: `🏖️ **Leave Management**

**Your Leave Balance:**
• Annual Leave: 12 days remaining
• Sick Leave: 8 days remaining
• Personal Leave: 3 days remaining

**Recent Leave Requests:**
• Dec 20-22: Annual Leave (Pending Approval)
• Nov 15: Sick Leave (Approved)

Would you like to apply for new leave or check existing requests?`,
        suggestions: [
          'Apply for annual leave',
          'Apply for sick leave',
          'View leave policy',
          'Check leave balance'
        ]
      };
    }

    if (lowerInput.includes('performance') || lowerInput.includes('metrics') || lowerInput.includes('rating')) {
      return {
        content: `⭐ **Performance Overview**

**Current Rating: 4.5/5.0**

**Key Metrics:**
• Project Completion: 95%
• Quality Score: 4.7/5
• Team Collaboration: 4.6/5
• Innovation: 4.2/5

**Recent Achievements:**
• Completed Modern Office Complex project ahead of schedule
• Led safety training for 20+ workers
• Implemented new quality control processes

**Areas for Improvement:**
• Technical skills development
• Leadership training opportunities

Your performance is excellent! Keep up the great work.`,
        suggestions: [
          'View detailed performance report',
          'Set performance goals',
          'Request feedback from manager',
          'View training opportunities'
        ]
      };
    }

    if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('assignment')) {
      return {
        content: `🏗️ **Current Projects & Tasks**

**Active Project:**
**Modern Office Complex** (Site Manager)
• Progress: 75% Complete
• Timeline: On track (Due: Jan 31, 2025)
• Budget: 95% utilized
• Team Size: 15 members

**Today's Tasks:**
✅ Morning safety briefing
🔄 Quality inspection (In Progress)
⏳ Client meeting at 2 PM
⏳ Progress report review

**Upcoming Deadlines:**
• Foundation inspection - Dec 15
• Electrical work completion - Dec 20
• Client presentation - Dec 18`,
        suggestions: [
          'View project timeline',
          'Update task status',
          'Schedule team meeting',
          'Generate progress report'
        ]
      };
    }

    if (lowerInput.includes('policy') || lowerInput.includes('rule') || lowerInput.includes('guideline')) {
      return {
        content: `📋 **HR Policies & Guidelines**

**Work Hours:**
• Standard: 8:00 AM - 5:00 PM
• Break: 12:00 PM - 1:00 PM
• Overtime: After 8 hours/day

**Leave Policies:**
• Annual Leave: 24 days/year
• Sick Leave: 12 days/year
• Maternity/Paternity: As per labor law

**Safety Guidelines:**
• Hard hat required at all times
• Safety briefing before each shift
• Report incidents immediately

**Code of Conduct:**
• Professional behavior expected
• Zero tolerance for harassment
• Confidentiality agreements apply

Need specific policy details?`,
        suggestions: [
          'View safety guidelines',
          'Check leave policies',
          'Read code of conduct',
          'Download employee handbook'
        ]
      };
    }

    if (lowerInput.includes('schedule') || lowerInput.includes('meeting') || lowerInput.includes('calendar')) {
      return {
        content: `📅 **Schedule & Meetings**

**Today's Schedule:**
• 9:00 AM - Safety briefing ✅
• 11:00 AM - Site inspection ✅
• 2:00 PM - Client meeting ⏳
• 4:00 PM - Team standup ⏳

**This Week:**
• Dec 15 - Foundation inspection
• Dec 16 - Progress review with PM
• Dec 18 - Client presentation
• Dec 19 - Quality audit

**Available Time Slots:**
• Tomorrow 10:00 AM - 12:00 PM
• Dec 16 after 3:00 PM
• Dec 17 morning

Would you like to schedule a meeting?`,
        suggestions: [
          'Schedule a meeting',
          'View full calendar',
          'Set reminder',
          'Check availability'
        ]
      };
    }

    if (lowerInput.includes('report') || lowerInput.includes('generate') || lowerInput.includes('export')) {
      return {
        content: `📊 **Reports & Analytics**

**Available Reports:**
• Daily Attendance Report
• Weekly Performance Summary
• Monthly Project Progress
• Safety Incident Log
• Overtime Analysis

**Quick Stats:**
• Projects Completed: 12
• Team Members Managed: 15
• Safety Record: 0 incidents this month
• Client Satisfaction: 4.8/5

**Recent Reports:**
• Nov Performance Report (Generated Dec 1)
• Q4 Project Summary (Generated Nov 30)

Which report would you like me to generate?`,
        suggestions: [
          'Generate attendance report',
          'Create performance summary',
          'Export project data',
          'View safety metrics'
        ]
      };
    }

    // Default response for unrecognized queries
    return {
      content: `I understand you're asking about "${input}". While I'm still learning, I can help you with:

🎯 **Main Areas:**
• **Attendance** - Check records, set reminders
• **Leave Management** - Apply, check balance
• **Performance** - View metrics, set goals
• **Projects** - Track progress, updates
• **Policies** - HR guidelines, safety rules
• **Scheduling** - Meetings, calendar
• **Reports** - Generate various reports

Please try asking about one of these areas, or be more specific about what you need help with.`,
      suggestions: [
        'Show my attendance',
        'Check leave balance',
        'View current projects',
        'Help with HR policies'
      ]
    };
  };

  const handleSuggestionPress = (suggestion) => {
    sendMessage(suggestion);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer
        ]}
      >
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessage : styles.assistantMessage,
          message.isError && styles.errorMessage
        ]}>
          {!isUser && (
            <View style={styles.assistantIcon}>
              <Ionicons 
                name={message.isError ? "warning" : "sparkles"} 
                size={16} 
                color={message.isError ? "#EF4444" : "#3B82F6"} 
              />
            </View>
          )}
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText,
            message.isError && styles.errorMessageText
          ]}>
            {message.content}
          </Text>
        </View>
        
        <Text style={[
          styles.messageTime,
          isUser ? styles.userMessageTime : styles.assistantMessageTime
        ]}>
          {formatTime(message.timestamp)}
        </Text>

        {/* Suggestions */}
        {message.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Ionicons name="sparkles" size={16} color="#3B82F6" />
        <Animated.View style={[styles.typingDots, { opacity: typingAnimation }]}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </Animated.View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="sparkles" size={24} color="#3B82F6" />
          <Text style={styles.headerText}>AI Assistant</Text>
        </View>
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline" size={16} color="#F59E0B" />
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about HR, projects, or policies..."
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <ScrollView 
          horizontal 
          style={styles.quickActionsContainer}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => sendMessage('Show my attendance today')}
          >
            <Ionicons name="time-outline" size={16} color="#3B82F6" />
            <Text style={styles.quickActionText}>Attendance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => sendMessage('Check my leave balance')}
          >
            <Ionicons name="calendar-outline" size={16} color="#10B981" />
            <Text style={styles.quickActionText}>Leave</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => sendMessage('Show current projects')}
          >
            <Ionicons name="construct-outline" size={16} color="#F59E0B" />
            <Text style={styles.quickActionText}>Projects</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => sendMessage('View performance metrics')}
          >
            <Ionicons name="trending-up-outline" size={16} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Performance</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  assistantMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  assistantIcon: {
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#1F2937',
  },
  errorMessageText: {
    color: '#DC2626',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 16,
  },
  userMessageTime: {
    color: '#9CA3AF',
    textAlign: 'right',
  },
  assistantMessageTime: {
    color: '#9CA3AF',
    textAlign: 'left',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginLeft: 16,
  },
  suggestionChip: {
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  suggestionText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B7280',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: '#1F2937',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sendButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  quickActionsContainer: {
    flexDirection: 'row',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
