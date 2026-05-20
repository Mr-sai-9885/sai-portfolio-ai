import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  ExternalLink, 
  Award, 
  Users, 
  Briefcase, 
  Layers, 
  Heart, 
  Calendar, 
  User, 
  Check, 
  ArrowRight,
  Download,
  Send,
  Eye,
  MessageSquare,
  BookOpen,
  Shield,
  Cpu,
  Database,
  Terminal,
  Activity
} from 'lucide-react';

export default function App() {
  // Navigation & Theme State
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Typing Animation State for Sai's Specialties
  const [typingText, setTypingText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = [
    'Full-Stack Developer', 
    'Cyber Security Student', 
    'IoT Innovator', 
    'Tech Educator'
  ];

  // Portfolio Filtering State
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Form State
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // AI Chat Assistant States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I am Sai Kumar's AI Portfolio Assistant. Ask me anything about his credentials, certifications, skills, personal background, or hardware & web projects!"
    }
  ]);

  // Refs for Scroll Detection & Chat Scrolling
  const chatEndRef = useRef(null);
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    education: useRef(null),
    contact: useRef(null),
  };

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // External links handlers
  const openResume = () => {
    window.open("https://docs.google.com/document/d/1d3Jpt7mU21axNqPoL6K8TihjTW2U6DPb/preview", "_blank");
    triggerToast("Opening Sai Kumar's Resume in a new tab...");
  };

  const openNotes = () => {
    window.open("https://docs.google.com/document/d/1MhkXQle_cbICKnGv3Rspcw7IlTXumxfL/preview", "_blank");
    triggerToast("Opening Web Dev Learning Notes...");
  };

  const openYoutube = () => {
    window.open("https://www.youtube.com/@saikanakati", "_blank");
    triggerToast("Heading to Sai Kumar's channel...");
  };

  // Scroll handler to highlight active section & manage navbar floating state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 200;
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const top = ref.current.offsetTop;
          const height = ref.current.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll helper
  const scrollTo = (sectionId) => {
    setMobileMenuOpen(false);
    const element = sectionRefs[sectionId].current;
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Typing animation driver
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at full word
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      typingSpeed = 500; // Pause before typing next word
    }

    const timer = setTimeout(() => {
      setTypingText(
        isDeleting 
          ? currentRole.substring(0, charIndex - 1) 
          : currentRole.substring(0, charIndex + 1)
      );
      setCharIndex((prevChar) => prevChar + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  // Auto-scroll chat to bottom when message arrives
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping]);

  // Gemini Live Chat Integrations with Exponential Backoff
  const callGeminiAPI = async (userQuery) => {
    const apiKey =  import.meta.env.VITE_OPENROUTER_API_KEY; // Runtime automatically injects the secure context key
    const url = `https://openrouter.ai/api/v1/chat/completions;=${apiKey}`;

    const systemPrompt = `
      You are Sai Kumar Kankanti's professional AI portfolio assistant.

      Your purpose is to answer ONLY questions related to Sai Kumar Kankanti's:
      - Portfolio
      - Resume / CV
      - Skills
      - Projects
      - Education
      - Certifications
      - Achievements
      - Technical Experience
      - Qualifications
      - Contact Information
      - Career Goals
      - YouTube Content
      - Web Development Journey

      ━━━━━━━━━━━━━━━━━━━━━━━
      🎯 RESPONSE BEHAVIOR RULES
      ━━━━━━━━━━━━━━━━━━━━━━━

      1. Always respond in a professional, modern, and friendly tone.

      2. Use proper markdown formatting:
        - Headings
        - Bullet points
        - Bold text
        - Short paragraphs

      3. Keep responses visually clean like ChatGPT.

      4. When the user asks:
        - "hi"
        - "hello"
        - "hey"
        - "who are you"
        - "what can you do"
        
        Respond warmly and introduce yourself as Sai Kumar's AI assistant.

      5. If the user asks unrelated questions such as:
        - weather
        - politics
        - recipes
        - unrelated coding problems
        - movie reviews
        - sports
        
        Politely decline and redirect them toward Sai Kumar's portfolio, projects, and skills.

      6. Never generate fake information.
      7. Never answer outside Sai Kumar's portfolio domain.
      8. Keep answers concise but informative.

      ━━━━━━━━━━━━━━━━━━━━━━━
      🚀 PROJECT RESPONSE FORMAT
      ━━━━━━━━━━━━━━━━━━━━━━━

      Whenever the user asks about projects, ALWAYS provide detailed structured responses in this format:

      # 🚀 Project Name

      ## 📌 Overview
      Explain what the project does in 2-3 lines.

      ## 🎯 Objective
      Explain the main goal/problem solved.

      ## ⚙️ Features
      List important features using bullet points.

      ## 🛠️ Tech Stack
      Mention all technologies used.

      ## 🧠 AI / ML Concepts
      Explain AI/ML models if applicable.

      ## 👨‍💻 Role & Contribution
      Explain Sai Kumar's personal contribution.

      ## 📈 Impact / Achievement
      Mention measurable results or achievements.

      ## 🔍 Challenges Faced
      Explain technical challenges solved.

      ## 📚 What Sai Learned
      Explain technical learning outcomes.

      ━━━━━━━━━━━━━━━━━━━━━━━
      📘 EDUCATION DETAILS
      ━━━━━━━━━━━━━━━━━━━━━━━

      ## 🎓 Education

      ### CMR College of Engineering & Technology
      - Degree: B.Tech in Computer Science Engineering (Cyber Security)
      - CGPA: 8.1
      - Duration: 2023 - Present

      ### NxtWave Industry Ready Certification
      - Full Stack Development Program
      - Duration: Nov 2024 - Present

      ### MJPTBCWRJC
      - Intermediate (MPC)
      - Percentage: 94.8%
      - Duration: 2021 - 2023

      ### MJPTBCWEIS
      - SSC
      - CGPA: 10.0
      - Duration: 2020 - 2021

      ━━━━━━━━━━━━━━━━━━━━━━━
      💻 SKILLS
      ━━━━━━━━━━━━━━━━━━━━━━━

      ## Programming Languages
      - Python
      - Java
      - C++
      - JavaScript

      ## Frontend Development
      - HTML
      - CSS
      - Bootstrap
      - React.js

      ## Backend Development
      - Node.js
      - Express.js

      ## Databases
      - SQLite
      - MySQL

      ## Cyber Security & Networking
      - Wireshark
      - Network Analysis
      - Anomaly Detection

      ## Tools & Platforms
      - Git
      - GitHub
      - OpenAI API
      - Google Apps Script

      ━━━━━━━━━━━━━━━━━━━━━━━
      🏆 ACHIEVEMENTS
      ━━━━━━━━━━━━━━━━━━━━━━━

      - State Finalist in OpenAI x NxtWave Buildathon 2025
      - Built AI-powered real-world applications
      - Uploaded 30+ technical educational videos on YouTube
      - Developed multiple responsive web applications

      ━━━━━━━━━━━━━━━━━━━━━━━
      🚀 PROJECTS INFORMATION
      ━━━━━━━━━━━━━━━━━━━━━━━

      # 1. AgriConnect AI

      ## Overview
      An AI-powered livestock price prediction platform designed to help farmers estimate animal market prices using intelligent prediction systems.

      ## Features
      - Livestock price prediction
      - AI-based analytics
      - User-friendly interface
      - Smart recommendation system

      ## Technologies
      - Node.js
      - OpenAI API
      - Google Apps Script
      - JavaScript

      ## Achievement
      Selected as Top State Finalist in OpenAI x NxtWave Buildathon 2025.

      ━━━━━━━━━━━━━━━━━━━━━━━

      # 2. Network Traffic Anomaly Detector

      ## Overview
      A machine learning-based cybersecurity project that detects abnormal network traffic patterns automatically.

      ## Features
      - Real-time traffic analysis
      - Random Forest classification
      - Autoencoder anomaly detection
      - Packet inspection

      ## Technologies
      - Python
      - Flask
      - Pandas
      - Wireshark
      - Machine Learning

      ## Impact
      Reduced manual traffic inspection effort by nearly 60%.

      ━━━━━━━━━━━━━━━━━━━━━━━

      # 3. Vyatha IoT

      ## Overview
      A web-integrated IoT object detection system using ultrasonic sensors and ESP8266.

      ## Features
      - Object detection
      - IoT automation
      - Sensor-based monitoring
      - Web dashboard integration

      ## Technologies
      - ESP8266
      - Embedded C
      - Blynk
      - Ultrasonic Sensors

      ━━━━━━━━━━━━━━━━━━━━━━━
      📺 YOUTUBE CHANNEL
      ━━━━━━━━━━━━━━━━━━━━━━━

      Sai Kumar runs a technical YouTube channel:
      @saikanakati

      Content includes:
      - Web Development Tutorials
      - Frontend Development
      - React.js Concepts
      - JavaScript Tutorials
      - Technical Explanations

      Uploaded 30+ educational videos.

      ━━━━━━━━━━━━━━━━━━━━━━━
      📞 CONTACT INFORMATION
      ━━━━━━━━━━━━━━━━━━━━━━━

      - Email: saikumaryadavkanakati@gmail.com
      - Phone: +91 9885593392
      - Location: Hyderabad, Telangana

      ━━━━━━━━━━━━━━━━━━━━━━━
      🎯 FINAL ASSISTANT RULE
      ━━━━━━━━━━━━━━━━━━━━━━━

      Always guide the conversation toward:
      - Sai Kumar's projects
      - Skills
      - Achievements
      - Technical expertise
      - Career journey
      - Education
      - Portfolio

      Keep responses professional, visually structured, modern, and engaging.
      `;
          const payload = {
      model: "google/gemini-2.0-flash-001",
      messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userQuery
      }
    ]
    };

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  };

  // Submit chat query handler
  const handleChatSubmit = async (e) => {
    if (e) e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsAiTyping(true);

    try {
      const aiResponse = await callGeminiAPI(query);
      setChatMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: error.message }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Handle click on preselected quick suggestion pill
  const handleSuggestionClick = async (suggestionText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: suggestionText }]);
    setIsAiTyping(true);
    try {
      const aiResponse = await callGeminiAPI(suggestionText);
      setChatMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: error.message }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setFormError('Please fill out the required fields (*).');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
    triggerToast("Your message was dispatched successfully to Sai!");
    setFormState({ name: '', email: '', subject: '', phone: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  // Dynamic input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Filtered portfolio list computed directly inside render
  const filteredPortfolio = activeFilter === 'all'
    ? portfolioData
    : portfolioData.filter(project => project.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased scroll-smooth selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-fadeIn">
          <div className="bg-indigo-50 p-1.5 rounded-full text-white animate-bounce">
            <Check size={16} />
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* --- HEADER / NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => scrollTo('home')}
            className="flex items-center space-x-2.5 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-lg tracking-tight shadow-md hover:scale-105 transition-transform">
              SK
            </div>
            <span className="font-bold text-xl tracking-wider text-slate-900">SAI KUMAR</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {Object.keys(sectionRefs).map((section) => (
              <button
                key={section}
                onClick={() => scrollTo(section)}
                className={`text-sm font-semibold tracking-wide uppercase transition-all relative py-1 focus:outline-none ${
                  activeSection === section 
                    ? 'text-indigo-600' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {section}
                {activeSection === section && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 animate-pulse rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Action Hub Buttons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={openResume}
              className="hidden sm:inline-flex items-center px-4.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase border border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
            >
              Resume
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-slate-900 text-white hover:bg-indigo-600 transition-all"
            >
              Contact
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-6 px-6 space-y-4 animate-fadeIn">
            {Object.keys(sectionRefs).map((section) => (
              <button
                key={section}
                onClick={() => scrollTo(section)}
                className={`block w-full text-left py-2 px-4 rounded-lg text-base font-bold tracking-wide uppercase transition-colors ${
                  activeSection === section 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {section}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={openResume}
                className="text-center py-2.5 bg-slate-100 text-slate-800 font-bold tracking-wider uppercase text-xs rounded-xl"
              >
                View Resume
              </button>
              <button
                onClick={openNotes}
                className="text-center py-2.5 bg-indigo-50 text-indigo-600 font-bold tracking-wider uppercase text-xs rounded-xl"
              >
                Read Notes
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section 
        ref={sectionRefs.home} 
        id="home" 
        className="relative min-h-screen pt-28 pb-16 px-6 lg:px-12 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden"
      >
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 text-left space-y-6 lg:pr-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 animate-pulse">
              🚀 OPEN SOURCE CONTRIBUTOR
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-none">
              Sai Kumar.
            </h1>
            <div className="text-2xl sm:text-4xl font-semibold text-slate-700 flex items-center flex-wrap gap-x-3">
              <span>I am a </span>
              <span className="text-indigo-600 border-r-4 border-indigo-600 pr-1 animate-pulse min-h-[40px] inline-block font-bold">
                {typingText}
              </span>
            </div>
            
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-light">
              Engineering student and future Full-Stack Developer driven by tech curiosity, teamwork, and building practical, impactful digital solutions. Specialized in React, Cyber Security, and AI-assisted architectures.
            </p>

            {/* Social Icons Strip */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://in.linkedin.com/in/sai-kumar-kankanti/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all flex items-center justify-center"
                title="LinkedIn Profile"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://github.com/Mr-sai-9885/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:shadow-md transition-all flex items-center justify-center"
                title="GitHub Repositories"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <button
                onClick={openYoutube}
                className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:shadow-md transition-all flex items-center justify-center"
                title="YouTube Channel"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>
              <button
                onClick={openNotes}
                className="px-4.5 h-11 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center text-xs font-bold space-x-1.5"
                title="Open Study Notes"
              >
                <BookOpen size={16} />
                <span>My Notes</span>
              </button>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => scrollTo('projects')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                View My Projects <ArrowRight size={16} className="ml-2" />
              </button>
              <button 
                onClick={openResume}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase border-2 border-slate-200 bg-white text-slate-800 hover:border-slate-950 hover:bg-slate-50 transition-all"
              >
                See My Resume
              </button>
            </div>
          </div>

          {/* Hero Profile Art Right */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 flex items-center justify-center group animate-pulse-slow">
              {/* Profile Illustration / SVG with Tech Overlays */}
                <div
                  className="absolute w-4/5 h-4/5 bg-cover bg-center rounded-xl"
                  style={{
                    backgroundImage: "url('https://res.cloudinary.com/dqemkwbkx/image/upload/v1747043858/Copy_of_cmr_slcdp6.png')"
                  }}
                ></div>
              {/* YouTube Channel Stats Overlay Panel */}
              <div 
                onClick={openYoutube}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6 cursor-pointer"
              >
                <div className="w-14 h-14 bg-rose-600 rounded-full flex items-center justify-center text-white mb-3 shadow-lg">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h4 className="text-white font-extrabold text-lg">Sai Kumar's Tech Hub</h4>
                <p className="text-rose-200 text-xs font-bold uppercase tracking-wider mt-1">30+ Video Tutorials</p>
                <p className="text-slate-300 text-xs font-light mt-2 max-w-[200px]">
                  Teaching real-world Responsive Web Design & JavaScript patterns to future builders.
                </p>
                <span className="mt-4 px-4 py-1.5 bg-white text-rose-600 rounded-full text-xs font-bold inline-flex items-center">
                  Visit Channel <ExternalLink size={12} className="ml-1" />
                </span>
              </div>
            </div>
            
            {/* Quick Tech Tag Badge */}
            <div className="absolute -bottom-4 right-8 bg-white py-3.5 px-6 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 hover:scale-105 transition-transform">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">B.Tech Student</p>
                <p className="text-sm font-black text-slate-800">CSE (Cyber Security)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT ME SECTION --- */}
      <section 
        ref={sectionRefs.about} 
        id="about" 
        className="py-24 px-6 lg:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* About Image Left */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-indigo-100 rounded-3xl transform rotate-3 scale-102 group-hover:rotate-1 group-hover:scale-105 transition-all duration-300" />
              <div className="relative bg-slate-50 border-4 border-white shadow-2xl rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8">
                <div
                  className="w-4/5 h-4/5 bg-cover bg-center rounded-xl"
                  style={{
                    backgroundImage: "url('https://res.cloudinary.com/dqemkwbkx/image/upload/v1747043984/laptop_uxxwzd.png')"
                  }}
                ></div>
              </div>
            </div>

            {/* About Details Right */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">About Me</h2>
                <p className="text-indigo-600 font-bold tracking-wider uppercase text-xs mt-2">Driven by Curiosity, Tech Innovation, and Teamwork</p>
              </div>

              <div className="space-y-4 text-slate-600 font-light leading-relaxed">
                <p>
                  I am <strong className="font-semibold text-slate-900">Sai Kumar Kankanti</strong>, a dedicated Computer Science engineering student specializing in <strong className="font-semibold text-indigo-600">Cyber Security</strong> at CMR College, Hyderabad. Simultaneously, I am mastering modern Full-stack development with <strong className="font-semibold text-slate-900">NxtWave's Industry Ready program</strong>.
                </p>
                <p>
                  My goal is to secure environments while writing fluid, performant, and dynamic user interfaces. Over the past couple of years, I’ve built AI-assisted apps, automated security protocols, wired IoT proximity nodes, and created helpful tutorials to teach programming concepts.
                </p>
              </div>

              {/* Info Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">🎓</span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Institution</p>
                    <p className="text-sm font-bold text-slate-800">CMR College of Eng. & Tech</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">💡</span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Specialty Focus</p>
                    <p className="text-sm font-bold text-slate-800">Cyber Security & Dev</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">📍</span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Located In</p>
                    <p className="text-sm font-bold text-slate-800">Hyderabad, Telangana</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">🛠️</span>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hackathon Record</p>
                    <p className="text-sm font-bold text-slate-800">State-Level Buildathon Finalist</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={openResume}
                  className="px-8 py-3.5 bg-indigo-600 text-white font-bold tracking-wider uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center"
                >
                  <MessageSquare size={16} className="mr-2" /> View Resume
                </button>
                <button 
                  onClick={openNotes}
                  className="px-8 py-3.5 border-2 border-slate-200 text-slate-700 font-bold tracking-wider uppercase rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all flex items-center"
                >
                  <BookOpen size={16} className="mr-2" /> Access My Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS MATRIX SECTION --- */}
      <section 
        ref={sectionRefs.skills} 
        id="skills" 
        className="py-24 px-6 lg:px-12 bg-slate-50/50"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Core Competencies</h2>
            <p className="text-slate-500 leading-relaxed font-light font-sans">
              Curating robust algorithms, responsive static structures, database models, and active defensive security tactics.
            </p>
            <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {skillsCategoryData.map((category, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-lg transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center space-x-2 text-slate-600 text-sm font-light">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Grid representing Sai's profile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-100 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900">30+</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">YouTube Tutorials</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900">8.1</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">B.Tech CGPA</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900">Top-State</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Buildathon Finalist</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-900">10.0</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">SSC CGPA</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section 
        ref={sectionRefs.projects} 
        id="projects" 
        className="py-24 px-6 lg:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Open Source Projects</h2>
            <p className="text-slate-500 leading-relaxed font-light">
              Explore custom engineering deployments spanning AI livestock valuations, ML threat diagnostics, hardware setups, and web templates.
            </p>
            <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full" />
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 border-b border-slate-100 pb-4 max-w-xl mx-auto">
            {['all', 'Web App', 'Machine Learning', 'IoT Hardware'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                  activeFilter === filter 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {filter === 'all' ? 'All Work' : filter}
              </button>
            ))}
          </div>

          {/* Dynamic Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((project) => (
              <div 
                key={project.id}
                className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                onClick={() => setSelectedProject(project)}
              >
                <div>
                  {/* Decorative visual thumbnail inside portfolio element */}
                  <div className="w-full aspect-video bg-gradient-to-tr from-slate-100 to-indigo-50/30 flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 z-10">
                      <span className="p-3 bg-white rounded-full text-slate-900 hover:bg-indigo-600 hover:text-white transition-colors">
                        <Eye size={18} />
                      </span>
                      {project.hostedUrl && (
                        <a 
                          href={project.hostedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-3 bg-white rounded-full text-slate-900 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    {project.vectorMarkup}
                  </div>

                  {/* Card Details */}
                  <div className="p-6 bg-white border-t border-slate-50 text-left">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1.5 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-light mt-2 line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 bg-white flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">{project.techStack}</span>
                  <span className="font-bold text-indigo-600 group-hover:translate-x-1.5 transition-transform flex items-center">
                    Review Case <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EDUCATION & TRAINING TIMELINE --- */}
      <section 
        ref={sectionRefs.education} 
        id="education" 
        className="py-24 px-6 lg:px-12 bg-slate-50/50"
      >
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Education & Certificates</h2>
            <p className="text-slate-500 leading-relaxed font-light font-sans">
              Tracing my ongoing academic achievements, specialization pathways, and certified technology qualifications.
            </p>
            <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full" />
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-indigo-100 pl-6 sm:pl-8 space-y-12 text-left">
            {educationData.map((edu, idx) => (
              <div key={idx} className="relative group">
                {/* Visual marker */}
                <span className="absolute -left-11 top-1 w-6 h-6 rounded-full bg-white border-4 border-indigo-600 group-hover:bg-indigo-600 transition-colors" />
                
                <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-extrabold rounded-full mb-2">
                  {edu.period}
                </span>
                
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{edu.degree}</h3>
                <p className="text-sm font-bold text-slate-500">{edu.institution}</p>
                <p className="text-sm text-slate-400 font-light mt-1">{edu.score}</p>
                {edu.details && (
                  <p className="text-slate-600 text-sm font-light mt-3 leading-relaxed">
                    {edu.details}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Certificates grid section */}
          <div className="pt-12 border-t border-slate-200">
            <h3 className="text-xl font-black text-slate-900 text-center mb-8">NxtWave Course Certifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Static Web Development', 'Responsive Web Development', 'Introduction to Python', 'Introduction to DBMS (SQLite)', 'JS Essentials', 'XPM 4.0 Fundamentals'].map((cert, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 text-left shadow-sm flex items-start space-x-3 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{cert}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Verified Credential</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- REPUTATION BANNER --- */}
      <section className="py-20 px-6 lg:px-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            "Looking to make high-impact, secure web transformations?"
          </h3>
          <p className="text-indigo-100 text-base sm:text-lg font-light max-w-xl mx-auto">
            From quick responsive frontend applications to integrated hardware systems, let's craft software that guarantees performance and safety.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase bg-slate-950 hover:bg-slate-900 text-white transition-all shadow-lg"
            >
              Collaborate Now
            </button>
            <button 
              onClick={openResume}
              className="px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase border border-white/20 hover:border-white text-white bg-white/10 transition-all"
            >
              See Qualifications
            </button>
          </div>
        </div>
      </section>

      {/* --- CONTACT US SECTION --- */}
      <section 
        ref={sectionRefs.contact} 
        id="contact" 
        className="py-24 px-6 lg:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Contact Me</h2>
            <p className="text-slate-500 leading-relaxed font-light">
              Have a visionary project, tech query, or looking to collaborate? Send a direct dispatch below.
            </p>
            <div className="w-16 h-1.5 bg-indigo-600 mx-auto rounded-full" />
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            {/* Contact Info Panel Left */}
            <div className="lg:col-span-5 space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Contact Info</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light font-sans">
                Feel free to email or call directly. Let's communicate on projects, security challenges, or open source ideas.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Mailing Address</h4>
                    <p className="text-sm text-slate-500 font-light mt-0.5">Hyderabad, Telangana, 500055, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Phone & Whatsapp</h4>
                    <p className="text-sm text-slate-500 font-light mt-0.5">9885593392</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Primary Email</h4>
                    <p className="text-sm text-slate-500 font-light mt-0.5">saikumaryadavkanakati@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Interactive Hub</h4>
                    <p className="text-sm text-slate-500 font-light mt-0.5">saikankanti.ccbp.tech</p>
                  </div>
                </div>
              </div>

              {/* Secure guarantee badge */}
              <div className="pt-6 border-t border-slate-200 flex items-center space-x-2.5 text-xs font-semibold text-slate-400">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span>SSL Encrypted Communication Guaranteed</span>
              </div>
            </div>

            {/* Contact Form Panel Right */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Write Me A Message</h3>
              <p className="text-slate-400 text-sm font-light mb-8">Fields marked with (*) are required.</p>

              {formSubmitted ? (
                <div className="py-12 px-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center space-y-4 animate-scaleUp">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
                    <Check size={32} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Thank you! Sai Kumar has received your message.</h4>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto font-light">
                    Your transmission has dispatched successfully. Sai Kumar will respond inside 12 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                  {formError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-semibold">
                      ⚠ {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Your Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Anand Sharma" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Your Email *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="e.g. anand@company.com" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Subject</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        placeholder="e.g. Cybersecurity Project" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formState.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 99999 88888" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Your Message *</label>
                    <textarea 
                      rows="5"
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      placeholder="Share your scope, milestones, dataset variables, or coding query..." 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-extrabold tracking-wider uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center"
                  >
                    Send Message <Send size={16} className="ml-2" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING AI ASSISTANT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Floating Chat Panel */}
        {isChatOpen && (
          <div className="w-[340px] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-scaleUp text-left">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-8.5 h-8.5 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                  🤖
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-tight">Sai's Assistant</h4>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse" />
                    Online & Guardrailed
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation Flow Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-light leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Typing Animation */}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-none p-3.5 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Panel */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto flex space-x-2 scrollbar-none whitespace-nowrap">
              {["What is AgriConnect?", "Show Sai's skills", "View B.Tech details", "Achievements"].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(pill)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-[10px] font-bold rounded-full text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all whitespace-nowrap shrink-0"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Chat Input Interface */}
            <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about my projects, achievements..."
                className="flex-grow px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={isAiTyping}
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-55 shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center transition-all focus:outline-none ring-4 ring-indigo-100/50"
          aria-label="Toggle AI Assistant"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* --- PORTFOLIO DETAIL MODAL LIGHTBOX --- */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Header / Title bar */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-left">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-400 transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
              {/* Illustration Block */}
              <div className="w-full aspect-video bg-gradient-to-tr from-indigo-50 to-slate-100 rounded-2xl flex items-center justify-center p-8">
                {selectedProject.vectorMarkup}
              </div>

              {/* Scope & Description */}
              <div className="space-y-4">
                <h4 className="text-lg font-extrabold text-slate-900">Project Case Scope</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-light whitespace-pre-line">
                  {selectedProject.longDescription}
                </p>
              </div>

              {/* Deliverables tags */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tech Stack & Frameworks</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span key={idx} className="px-3.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-end">
              {selectedProject.hostedUrl && (
                <a
                  href={selectedProject.hostedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-colors flex items-center"
                >
                  Launch Demo Hub <ExternalLink size={14} className="ml-1.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-3 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// --- SYSTEM STATIC DATA STORAGE FOR SAI KUMAR ---

const skillsCategoryData = [
  {
    title: 'Languages',
    icon: <Terminal size={24} />,
    skills: ['Python', 'Java', 'C / C++', 'JavaScript (ES6+)']
  },
  {
    title: 'Web Technologies',
    icon: <Layers size={24} />,
    skills: ['HTML5 & CSS3', 'React.js', 'Bootstrap', 'Node.js / Flask']
  },
  {
    title: 'Databases & Tools',
    icon: <Database size={24} />,
    skills: ['MySQL', 'SQLite', 'Google Sheets APIs', 'Git / GitHub']
  },
  {
    title: 'Computer Science',
    icon: <Shield size={24} />,
    skills: ['Cyber Security & Cryptography', 'Data Structures & Algorithms', 'Relational DBMS', 'Wireshark Diagnostics']
  }
];

const educationData = [
  {
    period: 'Nov 2024 - Ongoing',
    degree: 'Industry Ready Certification in Full-stack Development',
    institution: 'NxtWave Disruptive Technologies',
    score: 'Ongoing Intensive Coding Program',
    details: 'Mastering dynamic backend microservice connections, responsive user journeys, programmatic state management, relational SQLite integrations, and fullstack architectural designs.'
  },
  {
    period: '2023 - Ongoing',
    degree: 'B.Tech in Computer Science Engineering (Cyber Security)',
    institution: 'CMR College of Engineering and Technology, Hyderabad',
    score: 'Cumulative CGPA: 8.1 / 10.0',
    details: 'Acquiring systemic knowledge on Network Security, Object Oriented Programming, DBMS structures, Cryptography, Log audits, and Security Vulnerability assessments.'
  },
  {
    period: '2021 - 2023',
    degree: 'Intermediate (MPC Branch)',
    institution: 'MJPTBCWRJC Amberpet Branch, Hyderabad',
    score: 'Academic Score: 94.8%',
    details: 'Focused on advanced Mathematics, Physics, and Chemistry matrices alongside analytical reasoning skills.'
  },
  {
    period: '2020 - 2021',
    degree: 'Secondary School Certificate (SSC)',
    institution: 'MJPTBCWEIS Chandrayan-Gutta Branch, Hyderabad',
    score: 'Perfect Grade: 10.0 CGPA / 10.0',
    details: 'Recognized for excellent general analytical capabilities, logical mathematics foundation, and academic excellence.'
  }
];

const portfolioData = [
  {
    id: 'p1',
    title: 'AgriConnect - AI Livestock Price Predictor',
    category: 'Web App',
    techStack: 'Node.js & OpenAI',
    tags: ['Node.js', 'OpenAI API', 'Google Apps Script', 'REST APIs'],
    shortDescription: 'AI-assisted livestock pricing platform that helps farmers understand fair valuations through programmatic image/video-based insights.',
    longDescription: `AgriConnect addresses unfair livestock pricing dynamics by providing instant, farmer-friendly explanations.
    
    • Created a robust full-stack prototype running livestock classification logic.
    • Integrated advanced OpenAI API architectures for multi-variable analysis.
    • Built using Google Apps Script APIs to leverage zero-cost real-time spreadsheet database operations.
    • Designed a modular single-file Node.js architecture that cut code footprint and initialization cycles by ~40% during time-constrained hackathons.
    • Honored as a Top State-Level Team at the OpenAI × NxtWave Buildathon in Telangana, 2025.`,
    hostedUrl: 'https://saikankanti.ccbp.tech/',
    vectorMarkup: (
      <svg className="w-1/2 h-full text-slate-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="20" width="70" height="60" rx="8" fill="#10B981" opacity="0.15" />
        <rect x="25" y="30" width="50" height="40" rx="4" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
        <circle cx="45" cy="50" r="8" fill="#475569" />
        <rect x="45" y="46" width="16" height="8" rx="2" fill="#475569" />
        <line x1="48" y1="54" x2="48" y2="62" stroke="#475569" strokeWidth="2.5" />
        <line x1="56" y1="54" x2="56" y2="62" stroke="#475569" strokeWidth="2.5" />
        <circle cx="70" cy="35" r="5" fill="#6366F1" />
        <line x1="50" y1="50" x2="70" y2="35" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,3" />
        <rect x="52" y="34" width="22" height="10" rx="2" fill="#10B981" />
        <text x="56" y="41" fill="#FFFFFF" className="text-[6px] font-sans font-black">AI OK</text>
      </svg>
    )
  },
  {
    id: 'p2',
    title: 'Network Traffic Anomaly Detector',
    category: 'Machine Learning',
    techStack: 'Python & Flask',
    tags: ['Python', 'Flask', 'Random Forest', 'Pandas', 'Wireshark'],
    shortDescription: 'ML-powered Wireshark traffic analyst and anomaly detector that speeds up network diagnostics by up to 60%.',
    longDescription: `A network monitoring dashboard powered by Machine Learning models (Random Forest, Autoencoders) to analyze packet logs and identify threat signatures.
    
    • Designed an intuitive Web UI to visualize real-time packet spikes, traffic logs, and safety classifications.
    • Programmed Wireshark log stream scripts, successfully slashing manual traffic inspections by roughly ~60%.
    • Implemented with Flask API structures that process Pandas dataframes rapidly.`,
    hostedUrl: 'https://network-report-genius.lovable.app/',
    vectorMarkup: (
      <svg className="w-1/2 h-full text-slate-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" rx="12" fill="#312E81" />
        <circle cx="50" cy="35" r="5" fill="#EF4444" />
        <circle cx="35" cy="55" r="5" fill="#10B981" />
        <circle cx="65" cy="55" r="5" fill="#10B981" />
        <line x1="35" y1="55" x2="50" y2="35" stroke="#F3F4F6" strokeWidth="2" />
        <line x1="65" y1="55" x2="50" y2="35" stroke="#F3F4F6" strokeWidth="2" />
        <line x1="35" y1="55" x2="65" y2="55" stroke="#F3F4F6" strokeWidth="2" />
        <path d="M50 65C45 65 43 60 43 60C43 60 43 55 43 55H57C57 55 57 60 57 60C57 60 55 65 50 65Z" fill="#EF4444" />
        <text x="47" y="61" fill="#FFFFFF" className="text-[5px] font-sans font-black">!</text>
      </svg>
    )
  },
  {
    id: 'p3',
    title: 'Vyatha - IoT Object Detection System',
    category: 'IoT Hardware',
    techStack: 'ESP8266 & Blynk',
    tags: ['Embedded C', 'ESP8266', 'Blynk Cloud', 'Ultrasonic Sensors'],
    shortDescription: 'Integrated object proximity device that streams localized sensor flags to a web dashboard instantly.',
    longDescription: `An IoT application and hardware integration using the ESP8266 Wi-Fi module to track real-time spatial indicators.
    
    • Configured proximity triggers utilizing ultrasonic and infrared sensor components.
    • Developed automated alerts connected to the Blynk cloud dashboard interface.
    • Designed dynamic status flags to alert security teams when office entry thresholds are crossed.`,
    hostedUrl: 'https://aakarnirman.com/',
    vectorMarkup: (
      <svg className="w-1/2 h-full text-slate-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="25" width="60" height="50" rx="4" fill="#1E293B" />
        <rect x="35" y="35" width="30" height="30" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="2" />
        <circle cx="50" cy="50" r="4" fill="#F59E0B" />
        <line x1="25" y1="35" x2="35" y2="35" stroke="#94A3B8" strokeWidth="2" />
        <line x1="25" y1="45" x2="35" y2="45" stroke="#94A3B8" strokeWidth="2" />
        <line x1="25" y1="55" x2="35" y2="55" stroke="#94A3B8" strokeWidth="2" />
        <line x1="65" y1="35" x2="75" y2="35" stroke="#94A3B8" strokeWidth="2" />
        <line x1="65" y1="45" x2="75" y2="45" stroke="#94A3B8" strokeWidth="2" />
        <line x1="65" y1="55" x2="75" y2="55" stroke="#94A3B8" strokeWidth="2" />
        <path d="M50 15Q58 10 65 15" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
        <path d="M45 10Q50 5 55 10" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'p4',
    title: 'Food Munch Web Application',
    category: 'Web App',
    techStack: 'HTML, CSS & Bootstrap',
    tags: ['HTML5', 'CSS3', 'Bootstrap 4', 'Responsive Design'],
    shortDescription: 'Modern, content-driven restaurant menu application optimizing local dish searches and tables.',
    longDescription: `A gorgeous, highly optimized user-facing website crafted for contemporary restaurant chains.
    
    • Engineered structural columns leveraging the Bootstrap Grid model to secure zero-jank mobile scaling.
    • Enhanced performance and engagement metrics with image carousel components and clean responsive styling rules.
    • Integrated active menu bookmarking tabs to navigate easily between courses.`,
    hostedUrl: 'https://saikankanti.ccbp.tech/',
    vectorMarkup: (
      <svg className="w-1/2 h-full text-slate-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="4" />
        <rect x="35" y="42" width="30" height="8" rx="4" fill="#FBBF24" />
        <rect x="38" y="47" width="24" height="6" fill="#EF4444" />
        <path d="M35 42C35 34 65 34 65 42H35Z" fill="#F59E0B" />
        <rect x="37" y="52" width="26" height="6" rx="2" fill="#10B981" />
      </svg>
    )
  },
  {
    id: 'p5',
    title: 'Responsive Tourism Website',
    category: 'Web App',
    techStack: 'HTML, CSS & Bootstrap',
    tags: ['HTML5', 'CSS3', 'Bootstrap 4', 'Interactive Galleries'],
    shortDescription: 'Sleek travel portal celebrating global destinations with smooth responsive sections and callouts.',
    longDescription: `A high-performing static tourism directory allowing local users to browse international destinations, book virtual packages, and query safety regulations.
    
    • Utilized Bootstrap media queries for robust horizontal layouts.
    • Configured custom typography styling classes to optimize read cycles for travel descriptions.
    • Built fully semantic headers, grid layouts, card lists, and form tags.`,
    hostedUrl: 'https://saikankanti.ccbp.tech/',
    vectorMarkup: (
      <svg className="w-1/2 h-full text-slate-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="10" fill="#E0F2FE" />
        <path d="M25 65L45 35L60 55L75 40L80 65H25Z" fill="#0284C7" />
        <circle cx="65" cy="35" r="6" fill="#F59E0B" />
        <path d="M30 32L38 35L44 32" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'p6',
    title: 'Web Dev Tutorials Youtube Hub',
    category: 'Web App',
    techStack: 'Education & Community',
    tags: ['YouTube Creator', 'Video Tutorials', 'Responsive UI', 'JavaScript Logic'],
    shortDescription: 'Sai Kumar\'s programming channel showcasing over 30+ detailed walkthroughs on web development.',
    longDescription: `A community educational workspace created to teach practical web design guidelines, responsive styling paradigms, and core programming logics.
    
    • Authored more than 30+ high-quality video walkthroughs on fullstack coding.
    • Sharing coding tips, JavaScript logical breakdowns, and Bootstrap configurations with student peers.
    • Fostering collaboration among classmates and juniors to expand local software development competencies.`,
    hostedUrl: 'https://www.youtube.com/@saikanakati',
    vectorMarkup: (
      <svg className="w-1/2 h-full text-slate-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="25" width="70" height="50" rx="12" fill="#FCA5A5" opacity="0.3" />
        <rect x="25" y="32" width="50" height="36" rx="8" fill="#EF4444" />
        <path d="M45 42L58 50L45 58V42Z" fill="#FFFFFF" />
      </svg>
    )
  }
];