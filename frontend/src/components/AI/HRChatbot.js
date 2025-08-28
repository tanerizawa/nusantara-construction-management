import React, { useState } from 'react';
import {
  Bot,
  MessageCircle,
  Send,
  User,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Download,
  Search,
  Filter,
  MoreVertical,
  Brain,
  Zap,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Minimize2,
  Maximize2,
  Lightbulb
} from 'lucide-react';

const HRChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI HR Assistant. I can help you with employee information, policy questions, scheduling, and more. How can I assist you today?',
      timestamp: new Date(Date.now() - 300000),
      suggestions: [
        'Show me employee performance summary',
        'What\'s our leave policy?',
        'Schedule performance review',
        'Find training opportunities'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [conversationContext, setConversationContext] = useState({
    lastTopic: null,
    userIntent: null,
    followUpExpected: false
  });
  const [quickActions] = useState([
    { id: 1, label: 'Employee Search', icon: '👤', action: 'search_employee' },
    { id: 2, label: 'Leave Request', icon: '📅', action: 'leave_request' },
    { id: 3, label: 'Performance Review', icon: '⭐', action: 'performance_review' },
    { id: 4, label: 'Training Enrollment', icon: '🎓', action: 'training_enrollment' },
    { id: 5, label: 'Policy Questions', icon: '📋', action: 'policy_help' },
    { id: 6, label: 'Payroll Inquiry', icon: '💰', action: 'payroll_help' }
  ]);

  // Mock knowledge base and analytics
  const [analytics] = useState({
    totalQueries: 1247,
    avgResponseTime: 2.3,
    satisfactionRate: 94,
    topQueries: [
      { query: 'Leave policy questions', count: 234, percentage: 18.8 },
      { query: 'Employee information lookup', count: 189, percentage: 15.2 },
      { query: 'Performance review scheduling', count: 156, percentage: 12.5 },
      { query: 'Training recommendations', count: 134, percentage: 10.7 },
      { query: 'Payroll inquiries', count: 98, percentage: 7.9 }
    ],
    recentFeedback: [
      { id: 1, rating: 5, comment: 'Very helpful and quick responses', timestamp: '2025-08-28 10:30' },
      { id: 2, rating: 4, comment: 'Good information but could be more detailed', timestamp: '2025-08-28 09:15' },
      { id: 3, rating: 5, comment: 'Exactly what I needed to know', timestamp: '2025-08-28 08:45' }
    ]
  });

  const predefinedResponses = {
    'leave policy': {
      content: '📋 **YK Group Leave Policy Overview**\n\nHere are your available leave types:\n\n📅 **Annual Leave**: 12 days per year (increases to 15 days after 3 years)\n🏥 **Sick Leave**: 7 days per year with medical certificate\n👶 **Maternity/Paternity Leave**: 3 months paid (mothers), 2 weeks (fathers)\n🏠 **Emergency Leave**: 3 days per year for urgent family matters\n🎓 **Study Leave**: Up to 5 days for professional development\n🏛️ **Religious Leave**: 2 days for major religious observances\n\n**Important Notes:**\n• Submit requests 2 weeks in advance (except emergency)\n• Unused annual leave carries over (max 5 days)\n• Medical certificates required for sick leave >2 days\n\nCurrent leave balance: **8 annual days remaining**',
      followUp: ['Check my leave balance', 'Submit leave request', 'Emergency leave process', 'Leave approval status']
    },
    'performance review': {
      content: '🎯 **Performance Review System**\n\nOur quarterly review process:\n\n**📋 Self-Assessment Phase** (Week 1)\n• Complete self-evaluation form\n• Document key achievements\n• Set preliminary goals\n\n**👥 Manager Review** (Week 2)\n• 360-degree feedback collection\n• Skills assessment\n• Project impact analysis\n\n**💬 Review Meeting** (Week 3)\n• 60-minute discussion session\n• Goal alignment and planning\n• Career development discussion\n\n**📊 Final Documentation** (Week 4)\n• Performance score calculation\n• Development plan creation\n• Compensation review (if applicable)\n\n**Your next review**: Due October 15, 2025\n**Last review score**: 4.7/5.0 (Exceeds Expectations)',
      followUp: ['Schedule review meeting', 'View review template', 'Past review history', 'Manager feedback', 'Goal progress tracking']
    },
    'employee lookup': {
      content: '🔍 **Employee Directory Search**\n\nI can help you find detailed employee information:\n\n**👤 Personal Information**\n• Contact details (email, phone, office location)\n• Department and reporting structure\n• Join date and tenure\n\n**📊 Professional Details**\n• Current role and responsibilities\n• Performance ratings and achievements\n• Skills and certifications\n\n**📅 Availability & Projects**\n• Current project assignments\n• Workload and availability\n• Upcoming leave or training\n\n**🎯 Quick Actions Available:**\n• Send direct message\n• Schedule meeting\n• View organizational chart\n• Access team directory\n\nWho would you like me to look up? You can search by name, employee ID, department, or role.',
      followUp: ['Search by name', 'Browse by department', 'Find by skills', 'Team directory', 'Organizational chart']
    },
    'training': {
      content: '🎓 **Personalized Training Recommendations**\n\nBased on your role as **Project Engineer** and current skill assessment:\n\n**🎯 Priority Training (Recommended)**\n• Advanced BIM Modeling (AutoCAD/Revit) - *Next session: Sept 15*\n• Project Leadership & Team Management - *Online available*\n• Sustainable Construction Practices - *Certificate program*\n\n**💻 Technical Skills Development**\n• Construction Cost Estimation Software\n• Quality Control & Testing Procedures\n• Risk Management in Construction\n\n**🔧 Professional Development**\n• Communication & Presentation Skills\n• Conflict Resolution in Teams\n• Time & Resource Management\n\n**📈 Career Advancement**\n• Professional Engineer (PE) License Prep\n• Construction Project Management (PMP)\n• Safety Management Certification\n\n**Training Budget**: $3,500 remaining this year\n**Completion Rate**: 85% (Above company average)',
      followUp: ['Enroll in recommended training', 'View all available courses', 'Check training schedule', 'Training budget details', 'Certificate tracking']
    },
    'payroll': {
      content: '💰 **Payroll Information & Services**\n\n**📊 Current Pay Period**: August 16-31, 2025\n**💵 Next Payday**: September 5, 2025\n**🏦 Payment Method**: Direct Deposit (Bank ***1234)\n\n**Recent Payslip Summary:**\n• Gross Pay: Rp 12,000,000\n• Basic Salary: Rp 10,500,000\n• Performance Bonus: Rp 1,200,000\n• Overtime: Rp 300,000\n• Deductions: Rp 1,800,000 (Tax, Insurance, BPJS)\n• **Net Pay**: Rp 10,200,000\n\n**📋 Available Services:**\n• Download payslips (last 12 months)\n• Tax certificate (Form 1721-A1)\n• Salary adjustment requests\n• Banking details update\n• Overtime claim submission\n\n**💡 Quick Tip**: Your next salary review is scheduled for December 2025',
      followUp: ['Download latest payslip', 'View tax certificate', 'Update bank details', 'Submit overtime claim', 'Salary history']
    },
    'policy_help': {
      content: '📚 **HR Policies & Procedures**\n\nHere are our key policies you might need:\n\n**👔 Code of Conduct**\n• Professional behavior standards\n• Ethics and integrity guidelines\n• Conflict of interest policies\n\n**⏰ Working Hours & Attendance**\n• Core hours: 8:00 AM - 5:00 PM\n• Flexible time: ±2 hours adjustment\n• Remote work policy (2 days/week max)\n\n**🏥 Health & Safety**\n• Site safety requirements\n• Equipment usage protocols\n• Incident reporting procedures\n\n**💻 IT & Data Security**\n• Password and access policies\n• Data handling guidelines\n• Equipment usage rules\n\n**🤝 Anti-Harassment & Diversity**\n• Zero tolerance policy\n• Reporting mechanisms\n• Support resources\n\nWhich specific policy would you like to know more about?',
      followUp: ['Working hours policy', 'Remote work guidelines', 'Safety protocols', 'IT security policy', 'Report policy violation']
    },
    'search_employee': {
      content: '🔍 **Advanced Employee Search**\n\nI can help you find employees using various criteria:\n\n**📝 Search Options:**\n• By name (full or partial)\n• By employee ID\n• By department or team\n• By job title or role\n• By skills or certifications\n• By project assignment\n• By office location\n\n**📊 Available Information:**\n• Contact details and location\n• Reporting structure\n• Current projects and workload\n• Skills and expertise\n• Availability status\n\nHow would you like to search? Just tell me the name, department, or any other criteria.',
      followUp: ['Search by name', 'Browse departments', 'Find by skills', 'Current projects', 'Office locations']
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(inputValue);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();
    let response = {
      id: messages.length + 2,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      suggestions: []
    };

    // Enhanced keyword matching with context awareness
    if (lowerInput.includes('leave') || lowerInput.includes('vacation') || lowerInput.includes('time off')) {
      response = { ...response, ...predefinedResponses['leave policy'] };
      setConversationContext({ lastTopic: 'leave', userIntent: 'policy_inquiry', followUpExpected: true });
    } else if (lowerInput.includes('performance') || lowerInput.includes('review') || lowerInput.includes('evaluation')) {
      response = { ...response, ...predefinedResponses['performance review'] };
      setConversationContext({ lastTopic: 'performance', userIntent: 'review_inquiry', followUpExpected: true });
    } else if (lowerInput.includes('employee') || lowerInput.includes('find') || lowerInput.includes('contact') || lowerInput.includes('search')) {
      response = { ...response, ...predefinedResponses['employee lookup'] };
      setConversationContext({ lastTopic: 'search', userIntent: 'employee_lookup', followUpExpected: true });
    } else if (lowerInput.includes('training') || lowerInput.includes('course') || lowerInput.includes('skill') || lowerInput.includes('certification')) {
      response = { ...response, ...predefinedResponses['training'] };
      setConversationContext({ lastTopic: 'training', userIntent: 'development_inquiry', followUpExpected: true });
    } else if (lowerInput.includes('salary') || lowerInput.includes('payroll') || lowerInput.includes('pay') || lowerInput.includes('bonus')) {
      response = { ...response, ...predefinedResponses['payroll'] };
      setConversationContext({ lastTopic: 'payroll', userIntent: 'compensation_inquiry', followUpExpected: true });
    } else if (lowerInput.includes('policy') || lowerInput.includes('rule') || lowerInput.includes('procedure') || lowerInput.includes('guideline')) {
      response = { ...response, ...predefinedResponses['policy_help'] };
      setConversationContext({ lastTopic: 'policy', userIntent: 'policy_inquiry', followUpExpected: true });
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      response.content = '👋 Hello! Great to see you here. I\'m your AI HR Assistant, ready to help with:\n\n🔍 **Employee Information** - Find colleagues, contact details, org charts\n📋 **HR Policies** - Leave, attendance, conduct guidelines\n⭐ **Performance** - Reviews, goal tracking, feedback\n🎓 **Training** - Courses, certifications, skill development\n💰 **Payroll** - Salary info, tax documents, benefits\n📅 **Leave Management** - Requests, balances, approvals\n\nWhat can I help you with today?';
      response.suggestions = ['Find an employee', 'Check leave policy', 'Schedule performance review', 'View training courses'];
      setConversationContext({ lastTopic: 'greeting', userIntent: 'general_help', followUpExpected: false });
    } else if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      response.content = '😊 You\'re very welcome! I\'m always here to help with any HR-related questions or tasks.\n\nIs there anything else I can assist you with today? I can help with:\n• Employee directory searches\n• Policy clarifications\n• Leave requests and tracking\n• Training recommendations\n• Performance review scheduling\n• Payroll inquiries\n\nJust let me know!';
      response.suggestions = ['Find another employee', 'Check my benefits', 'View upcoming training', 'Nothing else, thanks'];
      setConversationContext({ lastTopic: 'thanks', userIntent: 'gratitude', followUpExpected: false });
    } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      response.content = '🤖 **I\'m your comprehensive HR AI Assistant!** Here\'s what I can help you with:\n\n**🔍 Employee Services**\n• Find employee contact information\n• Browse organizational charts\n• Check team availability\n• Search by skills or expertise\n\n**📋 HR Policies & Procedures**\n• Leave and attendance policies\n• Code of conduct guidelines\n• Safety and security protocols\n• Remote work procedures\n\n**⭐ Performance & Development**\n• Performance review scheduling\n• Goal tracking and updates\n• Training recommendations\n• Career development planning\n\n**💼 Administrative Tasks**\n• Payroll and benefit inquiries\n• Document requests\n• Leave applications\n• Certification tracking\n\n**🎯 Quick Actions**\n• Submit requests instantly\n• Get policy clarifications\n• Schedule appointments\n• Generate reports\n\nTry asking me something specific, or use the suggestions below!';
      response.suggestions = ['Employee directory', 'Leave policies', 'Training courses', 'Performance reviews', 'Payroll information'];
      setConversationContext({ lastTopic: 'capabilities', userIntent: 'feature_inquiry', followUpExpected: false });
    } else {
      // Smart fallback with context awareness
      const contextualResponse = generateContextualResponse(input, conversationContext);
      response.content = contextualResponse.content;
      response.suggestions = contextualResponse.suggestions;
      setConversationContext({ 
        lastTopic: 'general', 
        userIntent: 'unclear_request', 
        followUpExpected: true 
      });
    }

    return response;
  };

  const generateContextualResponse = (input, context) => {
    // Provide intelligent responses based on conversation context
    if (context?.lastTopic === 'leave' && input.toLowerCase().includes('balance')) {
      return {
        content: '📊 **Your Current Leave Balance**:\n\n📅 **Annual Leave**: 8 days remaining (out of 12)\n🏥 **Sick Leave**: 7 days remaining\n🏠 **Emergency Leave**: 3 days remaining\n🎓 **Study Leave**: 5 days remaining\n\n**Recent Leave History:**\n• July 15-16: Annual leave (2 days)\n• August 5: Sick leave (1 day)\n• June 20: Emergency leave (1 day)\n\n**Next Leave Request**: None pending\n**Leave Year**: Ends December 31, 2025',
        suggestions: ['Submit new leave request', 'View leave calendar', 'Leave policy details', 'Approval workflow']
      };
    }
    
    if (context?.lastTopic === 'search' || input.toLowerCase().includes('find')) {
      return {
        content: '🔍 To help you find the right person, I can search by:\n\n**👤 Personal Details**\n• Full name or nickname\n• Employee ID (EMP-XXX)\n• Email address\n\n**🏢 Organizational Info**\n• Department (Engineering, Construction, etc.)\n• Job title or position\n• Team or project assignment\n• Office location\n\n**🎯 Skills & Expertise**\n• Technical skills\n• Certifications\n• Project experience\n• Language abilities\n\n**Example searches:**\n• "Find Budi from Engineering"\n• "Who knows AutoCAD?"\n• "Show me the Construction team"\n• "Find project managers in Jakarta"\n\nWhat would you like to search for?',
        suggestions: ['Find by name', 'Search by department', 'Find by skills', 'Browse all employees']
      };
    }

    // Default intelligent response
    return {
      content: `🤔 I understand you're asking about "${input}". Let me help you with that!\n\nI'm constantly learning and can assist with:\n\n**📋 HR Information & Policies**\n• Employee handbook and procedures\n• Leave and attendance policies\n• Performance review processes\n• Compensation and benefits\n\n**👥 Employee Services**\n• Directory and contact information\n• Team structures and reporting\n• Skills and expertise lookup\n• Availability and scheduling\n\n**🎓 Learning & Development**\n• Training course catalog\n• Certification tracking\n• Skill gap analysis\n• Career development paths\n\n**⚡ Quick Actions**\n• Submit various HR requests\n• Schedule meetings and reviews\n• Generate reports and documents\n• Get instant policy clarifications\n\nCould you be more specific about what you need help with?`,
      suggestions: [
        'Employee directory',
        'HR policies',
        'Training programs',
        'Leave management',
        'Performance reviews',
        'Payroll inquiries'
      ]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center relative"
        >
          <Bot className="h-8 w-8" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMaximized ? 'inset-4' : 'bottom-6 right-6 w-96 h-[600px]'} z-50 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">HR AI Assistant</h3>
              <p className="text-sm opacity-90">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'chat' ? 'bg-white text-purple-600' : 'text-white/80'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-1" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-white text-purple-600' : 'text-white/80'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'help' ? 'bg-white text-purple-600' : 'text-white/80'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-1" />
            Help
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick Actions (only show if no messages or conversation starting) */}
              {messages.length <= 1 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleSuggestionClick(action.label)}
                        className="flex items-center gap-2 p-3 text-left text-sm text-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 rounded-lg transition-all duration-200 border border-purple-100"
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span className="font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-3 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'order-2 ml-2 bg-purple-600' : 'order-1 mr-2 bg-gray-300'}`}>
                    {message.type === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <Bot className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about HR..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Queries</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalQueries}</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.avgResponseTime}s</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                    <p className="text-2xl font-bold text-purple-600">{analytics.satisfactionRate}%</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-orange-600">156</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Top Queries */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Queries</h3>
              <div className="space-y-3">
                {analytics.topQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{query.query}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${query.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{query.count}</p>
                      <p className="text-xs text-gray-600">{query.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
              <div className="space-y-3">
                {analytics.recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{feedback.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* FAQ Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I check my leave balance?",
                    answer: "Simply ask me 'What's my leave balance?' or click the Leave Request quick action. I'll show your current balance for all leave types."
                  },
                  {
                    question: "Can you help me find a colleague's contact info?",
                    answer: "Yes! Just ask 'Find [name]' or use the Employee Search feature. I can provide contact details, department info, and current availability."
                  },
                  {
                    question: "How do I schedule a performance review?",
                    answer: "Ask me to 'Schedule my performance review' and I'll guide you through the process, check your manager's availability, and set up the meeting."
                  },
                  {
                    question: "What training courses are available for me?",
                    answer: "I provide personalized training recommendations based on your role, current skills, and career goals. Just ask about 'training opportunities'."
                  },
                  {
                    question: "How accurate is the information you provide?",
                    answer: "I'm connected to live HR systems and databases, so information like leave balances, employee directories, and policies are always current and accurate."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <h4 className="font-medium text-gray-900 mb-1">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                What I Can Do
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    category: "Employee Services",
                    icon: "👥",
                    items: ["Find employee contacts", "Browse organizational charts", "Check team availability", "Search by skills"]
                  },
                  {
                    category: "HR Policies",
                    icon: "📋",
                    items: ["Leave policies", "Code of conduct", "Remote work guidelines", "Safety protocols"]
                  },
                  {
                    category: "Performance & Development",
                    icon: "⭐",
                    items: ["Schedule reviews", "Track goals", "Training recommendations", "Career planning"]
                  },
                  {
                    category: "Administrative",
                    icon: "💼",
                    items: ["Payroll inquiries", "Benefit information", "Document requests", "Leave applications"]
                  }
                ].map((capability, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">{capability.icon}</span>
                      {capability.category}
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {capability.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Tricks */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Tips for Better Conversations
              </h3>
              <div className="space-y-3">
                {[
                  "Be specific: 'Find John from Engineering' works better than just 'Find John'",
                  "Use natural language: Ask questions like you would to a colleague",
                  "Try follow-up questions: I remember our conversation context",
                  "Use quick actions: Click the suggestion buttons for faster navigation",
                  "Provide feedback: Use thumbs up/down to help me improve"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-yellow-600">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                Need Human Help?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                While I can handle most HR questions, sometimes you might need to speak with a human colleague.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                  Contact HR Team
                </button>
                <button className="px-3 py-2 border border-purple-600 text-purple-600 text-sm rounded-lg hover:bg-purple-50 transition-colors">
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRChatbot;
