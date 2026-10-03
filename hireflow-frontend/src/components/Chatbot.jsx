import { useState, useRef, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/chatbot.css";

const screeningQuestions = {
    "Frontend Engineer": [
        "What is the difference between Virtual DOM and Shadow DOM?",
        "Explain React Hooks and how they changed component logic.",
        "How do you optimize a high-traffic web application's performance?"
    ],
    "Backend Developer": [
        "What are the pros and cons of Microservices vs Monolith?",
        "How do you handle SQL injection and basic security in Spring Boot?",
        "Explain REST vs GraphQL and when to use which."
    ],
    "Data Scientist": [
        "What is the difference between Supervised and Unsupervised learning?",
        "Explain Overfitting and how to prevent it.",
        "How do you handle missing data in a large dataset?"
    ],
    "DevOps Engineer": [
        "Explain the concept of Infrastructure as Code (IaC).",
        "What is the difference between Continuous Deployment and Continuous Delivery?",
        "How do you secure a CI/CD pipeline?"
    ],
    "UI/UX Designer": [
        "What are the core principles of accessibility in web design?",
        "How do you conduct user research for a new technical product?",
        "Explain the difference between UI and UX in a single sentence."
    ],
    "Mobile Developer": [
        "What are the trade-offs between Native and Cross-platform development?",
        "How do you manage state in a complex mobile application?",
        "Explain the App Store/Play Store review process for security."
    ]
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const userRole = localStorage.getItem("role") || "GUEST";
    const userEmail = localStorage.getItem("userEmail") || "guest";
    const historyKey = `chat_history_${userEmail}`;
    const [screeningMode, setScreeningMode] = useState(null); // null or { stage: 0, role: "" }
    const [screeningAnswers, setScreeningAnswers] = useState([]);

    const initialMessage = {
        id: 1,
        text: userRole === "ADMIN" ? "Welcome, Administrator. I am the HireFlow System Intelligence. How can I assist with platform monitoring today?" :
            userRole === "RECRUITER" ? "Welcome back! Ready to find your next star candidate? Ask me about candidate matching or job posting!" :
                "Welcome to HireFlow AI! 🤖 I'm your dedicated career assistant. How can I help you land your dream job?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(historyKey);
        return saved ? JSON.parse(saved) : [initialMessage];
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        localStorage.setItem(historyKey, JSON.stringify(messages));
    }, [messages, historyKey]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getBotResponse = (query, role) => {
        const text = query.toLowerCase();

        // Admin Specific Logic
        if (role === "ADMIN") {
            if (text.includes("user") || text.includes("manage")) return "As an Admin, you can manage all platform users in the 'Users' section. You can verify recruiters and audit job seeker profiles.";
            if (text.includes("stat") || text.includes("report") || text.includes("data")) return "The 'AI Reports' page provides real-time platform intelligence including network size, revenue, and system health.";
            if (text.includes("health") || text.includes("server")) return "System health is currently at 98%+. You can monitor real-time server load and database usage from your dashboard stats.";
        }

        // Recruiter Specific Logic
        if (role === "RECRUITER") {
            if (text.includes("post") || text.includes("job")) return "Navigate to 'Post a Job' in the sidebar. Once posted, our AI will instantly start matching candidates to your requirements.";
            if (text.includes("candidate") || text.includes("applicant") || text.includes("hiring")) return "You can view all applicants in the 'Applications' tab. Look for the 'Match Score' to see who our AI recommends first!";
            if (text.includes("score") || text.includes("percentage")) return "The match score represents technical alignment. A score above 80% indicates a high-probability match for your role.";
        }

        // Job Seeker / Generic Logic
        if (text.match(/hi|hello|hey|greetings/)) {
            return role === "RECRUITER" ? "Hello! I'm here to streamline your hiring. What can I do for you?" : "Hello there! Ready to take the next step in your career? Ask me about jobs or resume matching!";
        }

        if (text.includes("dashboard") || text.includes("home")) {
            return "The dashboard gives you a bird's-eye view of your activity. You can see your stats and recent actions right there!";
        }

        if (text.includes("job") || text.includes("vacancy") || text.includes("apply")) {
            return "You can find listings in the 'Job Market'. Try the 'AI Recommended' tab for roles that match your unique skill set!";
        }

        if (text.includes("resume") || text.includes("cv") || text.includes("match")) {
            return "Upload your PDF in the 'Resume Match' section and I'll give you a detailed breakdown of how well you fit any role.";
        }

        if (text.includes("who") && text.includes("you")) {
            return "I am the HireFlow AI Assistant, designed to bridge the gap between talent and opportunity using advanced machine learning. 🚀";
        }

        const fallbacks = [
            "That's a great question! I'm here to help you navigate HireFlow effectively. What else would you like to know?",
            "I'm still learning, but I can certainly help you find information on this dashboard! What's your main goal today?",
            "Interesting! You might find more details in the 'AI Analytics' section of your dashboard.",
            "I'm here to help you succeed. Try asking about specific features like 'Resume Matching' or 'AI Reports'."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    };

    const handleSend = useCallback(async (e, forcedInput = null) => {
        if (e) e.preventDefault();
        const messageText = forcedInput || input;
        if (!messageText.trim()) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { id: Date.now(), text: messageText, sender: "user", timestamp };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // --- SCREENING MODE LOGIC ---
        if (screeningMode) {
            const nextStage = screeningMode.stage + 1;
            const roleQuestions = screeningQuestions[screeningMode.role];

            const completedAnswers = [...screeningAnswers, { q: roleQuestions[screeningMode.stage], a: messageText }];
            setScreeningAnswers(completedAnswers);

            if (nextStage < roleQuestions.length) {
                setScreeningMode({ ...screeningMode, stage: nextStage });
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: `Question ${nextStage + 1}: ${roleQuestions[nextStage]}`,
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                    setIsTyping(false);
                }, 1000);
                return;
            } else {
                // Screening Finished
                setScreeningMode(null);
                setTimeout(async () => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: "Interview complete! 🎯 I'm now synthesizing your performance into a technical feedback report...",
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);

                    try {
                        const interviewTranscript = completedAnswers.map(a => `Q: ${a.q}\nA: ${a.a}`).join("\n\n");
                        const feedbackResponse = await axiosInstance.post("/ai/chat", {
                            message: `Evaluate this technical interview for the role of ${screeningMode.role}. Provide strengths, areas to improve, and a technical score from 0-100.\n\n${interviewTranscript}`
                        });
                        const feedback = feedbackResponse.data?.response || "Great job finishing the screening!";

                        setMessages(prev => [...prev, {
                            id: Date.now() + 2,
                            text: feedback,
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);

                        // Sync with backend
                        await axiosInstance.post("/ai/screening/complete", {
                            role: screeningMode.role,
                            answers: completedAnswers,
                            feedback: feedback
                        });

                    } catch {
                        setMessages(prev => [...prev, {
                            id: Date.now() + 3,
                            text: "Your screening is complete, but live AI feedback is unavailable right now. Your answers are still saved locally in this chat; try again after the backend AI key is configured.",
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]);
                    }
                    setIsTyping(false);
                }, 1500);
                return;
            }
        }

        // --- NORMAL CHAT LOGIC ---
        if (messageText === "Interview Prep" || messageText.toLowerCase().includes("start screening")) {
            const botMsg = {
                id: Date.now() + 1,
                text: "I can conduct a preliminary technical screening for you. Which role are you targeting?",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
            return;
        }

        if (Object.keys(screeningQuestions).includes(messageText)) {
            setScreeningMode({ stage: 0, role: messageText });
            setScreeningAnswers([]);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: `Great! Let's start the technical screening for ${messageText}. Question 1: ${screeningQuestions[messageText][0]}`,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        try {
            // Priority 1: Use HireFlow's AI Engine via Backend
            const response = await axiosInstance.post("/ai/chat", {
                message: messageText,
            });

            if (response.data && response.data.response && !response.data.response.toLowerCase().includes("offline mode")) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: response.data.response,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setIsTyping(false);
                return; // 🚀 Success! Exit.
            } else {
                console.warn("Backend AI in offline/placeholder mode, trying Gemini/Local...");
            }
        } catch (error) {
            console.warn("AI Engine unreachable (check backend on port 8081):", error.message);
        }

        // Backend unavailable: keep the assistant usable with local navigation guidance.
        try {
            const botResponse = getBotResponse(messageText, userRole);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `${botResponse}\n\nLive AI is currently unavailable. Ask the administrator to configure GEMINI_API_KEY on the backend.`,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (err) {
            console.error("Critical Chatbot Error:", err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm having trouble connecting to the HireFlow AI service. Please try again later.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [input, screeningMode, screeningAnswers, userRole]);

    useEffect(() => {
        if (isOpen) scrollToBottom();

        const handleOpenChat = (e) => {
            setIsOpen(true);
            if (e.detail) {
                handleSend(null, e.detail);
            }
        };

        const handleAction = (e) => {
            if (e.detail?.action === 'focus') {
                setIsOpen(true);
                setTimeout(() => {
                    const input = document.querySelector('.chatbot-input');
                    input?.focus();
                }, 500);
            }
        };

        window.addEventListener('openChatbot', handleOpenChat);
        window.addEventListener('chatbotAction', handleAction);
        return () => {
            window.removeEventListener('openChatbot', handleOpenChat);
            window.removeEventListener('chatbotAction', handleAction);
        };
    }, [isOpen, handleSend]);

    const clearChat = () => {
        setMessages([initialMessage]);
    };

    const quickActions = userRole === "RECRUITER" ? [
        "How to post a job?", "Candidate matching", "Tips for recruiters"
    ] : userRole === "ADMIN" ? [
        "System Stats", "Manage Users", "AI Reports"
    ] : [
        "Find Jobs", "Resume Review", "Interview Prep"
    ];

    return (
        <div className="chatbot-anchor">
            {isOpen && (
                <div className="chatbot-window glass-morphism shadow-2xl">
                    <div className="chatbot-header">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bot-avatar-header">
                                <i className="bi bi-robot"></i>
                                <span className="online-indicator pulsate"></span>
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">HireFlow AI</h6>
                                <span className="extra-small opacity-75">Always Online</span>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="icon-btn" onClick={clearChat} title="Clear Chat">
                                <i className="bi bi-trash3"></i>
                            </button>
                            <button className="icon-btn close-btn" onClick={() => setIsOpen(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-container ${msg.sender}`}>
                                {msg.sender === "bot" && (
                                    <div className="message-avatar">
                                        <i className="bi bi-robot"></i>
                                    </div>
                                )}
                                <div className={`message-bubble ${msg.sender}`}>
                                    <div className="message-text">{msg.text}</div>
                                    <div className="message-time">{msg.timestamp}</div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-container bot">
                                <div className="message-avatar">
                                    <i className="bi bi-robot"></i>
                                </div>
                                <div className="message-bubble bot typing-indicator">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-actions-area">
                        {quickActions.map(action => (
                            <button key={action} className="quick-action-btn" onClick={() => handleSend(null, action)}>
                                {action}
                            </button>
                        ))}
                    </div>

                    <form className="chatbot-input-area" onSubmit={handleSend}>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="chatbot-input"
                                placeholder="Ask HireFlow AI anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="chatbot-send-btn" disabled={!input.trim()}>
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <button
                className={`chatbot-trigger shadow-premium ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? (
                    <i className="bi bi-chevron-down"></i>
                ) : (
                    <div className="trigger-content">
                        <div className="bot-icon-wrapper">
                            <i className="bi bi-robot"></i>
                            <span className="notification-dot"></span>
                        </div>
                        <span className="trigger-text">AI ASSISTANT</span>
                    </div>
                )}
            </button>
        </div>
    );
}
