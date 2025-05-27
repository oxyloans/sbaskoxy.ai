import React, { useState } from "react";
import {
  GraduationCap,
  Globe,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  Circle,
  FileText,
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronRight,
  Star,
  Timer,
  Clock,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Filter,
  Plus,
  Download,
  Eye,
  Send,
  Award,
  Bookmark,
  ChevronDown,
  Settings,
  LogOut,
  ExternalLink,
  List,
  Grid3X3,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const progress = 82;
  const circumference = 2 * Math.PI * 15.9155;
  const dashoffset = circumference * (1 - progress / 100);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const navigate = useNavigate();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: GraduationCap },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "universities", label: "University Search", icon: Building2 },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "documents", label: "My Documents", icon: FileText },
    { id: "profile", label: "My Profile", icon: User },
    { id: "support", label: "Counselor Support", icon: MessageCircle },
  ];

  const kpiCards = [
    {
      title: "Total Applications",
      value: "15",
      subtitle: "8 Submitted • 4 In Progress • 3 Draft",
      icon: Send,
      change: "+3 this week",
      trend: "up",
    },
    {
      title: "Universities Shortlisted",
      value: "24",
      subtitle: "8 Dream Schools • 10 Target • 6 Safety Schools",
      icon: Building2,
      change: "+4 this month",
      trend: "up",
    },
    {
      title: "Application Deadlines",
      value: "8",
      subtitle: "3 This Month • 5 Next Month • 2 Overdue",
      icon: Clock,
      change: "3 approaching",
      trend: "urgent",
    },
    {
      title: "Document Progress",
      value: "18/24",
      subtitle: "Transcripts • SOP • LORs • Test Scores • Essays",
      icon: FileText,
      change: "75% Complete",
      trend: "progress",
    },
  ];

  const applicationStages = [
    {
      stage: "Research",
      count: 24,
      universities: ["MIT", "Stanford", "Harvard"],
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      stage: "Applied",
      count: 12,
      universities: ["UC Berkeley", "CMU", "Caltech"],
      color: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      stage: "Under Review",
      count: 8,
      universities: ["Yale", "Princeton", "Cornell"],
      color: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      stage: "Interview",
      count: 5,
      universities: ["Columbia", "NYU"],
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      stage: "Offers",
      count: 3,
      universities: ["Boston U.", "Northeastern"],
      color: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      stage: "Enrolled",
      count: 0,
      universities: [],
      color: "bg-gray-50",
      textColor: "text-gray-600",
    },
  ];

  const recommendedUnis = [
    {
      name: "University of California, Berkeley",
      location: "California, USA",
      cost: "$65,000/year",
      ranking: "#4 Global",
      deadline: "December 30, 2024",
      match: "95%",
      programs: "Computer Science, Data Science",
      acceptance: "17%",
      logo: "🎓",
      country: "USA",
    },
    {
      name: "University College London",
      location: "London, UK",
      cost: "£35,000/year",
      ranking: "#8 Global",
      deadline: "January 15, 2025",
      match: "92%",
      programs: "AI & Machine Learning",
      acceptance: "63%",
      logo: "🏛️",
      country: "UK",
    },
    {
      name: "University of Toronto",
      location: "Toronto, Canada",
      cost: "CAD 58,000/year",
      ranking: "#18 Global",
      deadline: "January 31, 2025",
      match: "88%",
      programs: "Engineering Science",
      acceptance: "43%",
      logo: "🍁",
      country: "CANADA",
    },
    {
      name: "Brock University",
      location: "Ontario, Canada",
      cost: "CAD 28,000/year",
      ranking: "#45 Canada",
      deadline: "March 1, 2025",
      match: "85%",
      programs: "Bachelor of Science in Nursing",
      acceptance: "78%",
      logo: "🏫",
      country: "CANADA",
    },
    {
      name: "Canadore College",
      location: "Ontario, Canada",
      cost: "CAD 22,000/year",
      ranking: "Top College",
      deadline: "April 15, 2025",
      match: "90%",
      programs: "Practical Nursing Program",
      acceptance: "65%",
      logo: "🎓",
      country: "CANADA",
    },
    {
      name: "Centennial College",
      location: "Toronto, Canada",
      cost: "CAD 25,000/year",
      ranking: "Premier College",
      deadline: "May 1, 2025",
      match: "87%",
      programs: "Bachelor of Science in Nursing",
      acceptance: "72%",
      logo: "🏛️",
      country: "CANADA",
    },
  ];

  const upcomingDeadlines = [
    {
      university: "Stanford University",
      program: "MS Computer Science",
      date: "Dec 15, 2024",
      daysLeft: 8,
      priority: "high",
    },
    {
      university: "MIT",
      program: "MS Artificial Intelligence",
      date: "Dec 20, 2024",
      daysLeft: 13,
      priority: "high",
    },
    {
      university: "Carnegie Mellon",
      program: "MS Software Engineering",
      date: "Jan 5, 2025",
      daysLeft: 29,
      priority: "medium",
    },
    {
      university: "University of Washington",
      program: "MS Data Science",
      date: "Jan 15, 2025",
      daysLeft: 39,
      priority: "medium",
    },
    {
      university: "Georgia Tech",
      program: "MS Computer Science",
      date: "Feb 1, 2025",
      daysLeft: 56,
      priority: "low",
    },
  ];

  const documents = [
    {
      name: "Academic Transcripts",
      status: "completed",
      type: "Academic Records",
      lastUpdated: "2 days ago",
    },
    {
      name: "English Proficiency (IELTS)",
      status: "completed",
      type: "Language Test",
      score: "7.5 Overall",
    },
    {
      name: "GRE Test Scores",
      status: "completed",
      type: "Standardized Test",
      score: "325/340",
    },
    {
      name: "Statement of Purpose",
      status: "in-progress",
      type: "Essays",
      universities: "8 versions",
    },
    {
      name: "Letters of Recommendation",
      status: "pending",
      type: "References",
      count: "2/3 received",
    },
    {
      name: "Resume/CV",
      status: "completed",
      type: "Professional",
      lastUpdated: "1 week ago",
    },
    {
      name: "Financial Documents",
      status: "pending",
      type: "Financial Proof",
      required: "$75,000",
    },
    {
      name: "Passport Copy",
      status: "completed",
      type: "Identity",
      expires: "Valid until 2028",
    },
  ];

  const scholarships = [
    {
      name: "Fulbright Scholarship",
      amount: "$25,000",
      deadline: "Oct 15, 2024",
      status: "Applied",
      country: "USA",
    },
    {
      name: "Chevening Scholarship",
      amount: "Full Funding",
      deadline: "Nov 2, 2024",
      status: "Under-review",
      country: "UK",
    },
    {
      name: "DAAD Scholarship",
      amount: "€12,000",
      deadline: "Dec 1, 2024",
      status: "Eligible",
      country: "Germany",
    },
    {
      name: "Australia Awards",
      amount: "Full Funding",
      deadline: "Apr 30, 2025",
      status: "Bookmarked",
      country: "Australia",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <div>
                <h2 className="text-lg font-bold">StudyAbroad Pro</h2>
                <p className="text-violet-100 text-xs mt-0.5">
                  Your Study Journey
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-violet-100 hover:text-white hover:bg-violet-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="p-3 space-y-1 overflow-y-auto h-full pb-20">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
          <div className="px-6 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
            <h2 className="text-xl font-bold">StudyAbroad Pro</h2>
            <p className="text-violet-100 text-sm mt-1">Your Study Journey</p>
          </div>
          <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 bg-gray-50 m-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Alex Johnson
                </p>
                <p className="text-xs text-gray-600">Graduate Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-6 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="ml-3 lg:ml-0">
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  Welcome back, Alex!
                </h1>
                <p className="text-gray-600 mt-0.5 text-sm">
                  You have 8 deadlines approaching this month
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-medium text-gray-900 text-xs">
                      Alex Johnson
                    </p>
                    <p className="text-xs text-gray-600">CS Graduate</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm">
                      <LogOut className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6">
          {activeTab === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-8 p-6">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Profile Strength Card - First column */}
                <div className="xl:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                    {/* Circle Progress */}
                    <div className="flex flex-col items-center mb-2">
                      <div className="relative w-20 h-20">
                        <svg
                          viewBox="0 0 36 36"
                          className="w-full h-full -rotate-90"
                        >
                          {/* Track */}
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="2"
                          />
                          {/* Progress */}
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke="url(#grad)"
                            strokeWidth="2"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={dashoffset}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient
                              id="grad"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">
                            {progress}%
                          </span>
                          <span className="text-xs text-violet-600 font-medium">
                            Excellent
                          </span>
                        </div>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-gray-800">
                        Profile Strength
                      </h3>
                    </div>

                    {/* Steps */}
                    <ul className="flex-1 space-y-3 mb-3">
                      {[
                        { label: "Personal Details", done: true },
                        { label: "Academic Background", done: true },
                        { label: "Test Scores", done: true },
                        { label: "Resume / CV", done: true },
                        {
                          label: "Statement of Purpose",
                          done: false,
                          progress: 8,
                        },
                        {
                          label: "Recommendation Letters",
                          done: false,
                          progress: 5,
                        },
                      ].map((step) => (
                        <li
                          key={step.label}
                          className={`flex items-center justify-between p-3 rounded-lg transition ${
                            step.done
                              ? "bg-green-50"
                              : step.progress! > 0
                              ? "bg-orange-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center min-w-0">
                            {step.done ? (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mr-3" />
                            ) : step.progress! > 0 ? (
                              <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mr-3" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mr-3" />
                            )}
                            <span
                              className={`text-sm font-medium truncate ${
                                step.done ? "text-gray-700" : "text-gray-600"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {step.done ? (
                            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Done
                            </span>
                          ) : step.progress! > 0 ? (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              +{step.progress}%
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <button className="mt-auto w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition flex items-center justify-center space-x-2">
                      <span>Complete Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Content Area - Second column spanning 3 cols */}
                <div className="xl:col-span-3 space-y-6">
                  {/* KPI Cards - Responsive grid with equal heights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiCards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 h-full"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 shadow-sm w-fit mb-4">
                              <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {card.value}
                              </div>
                              <div
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  card.trend === "up"
                                    ? "bg-green-100 text-green-700"
                                    : card.trend === "urgent"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {card.change}
                              </div>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {card.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {card.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Application Pipeline */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Application Pipeline
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Track your progress through each application stage
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium py-2.5 px-5 rounded-xl hover:from-violet-600 hover:to-purple-600 shadow-sm transition-all duration-300">
                        View All Applications
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {applicationStages.map((stage, index) => (
                        <div
                          key={index}
                          className="text-center group cursor-pointer"
                        >
                          <div
                            className={`${stage.color} border border-gray-100 p-4 rounded-xl mb-3 hover:shadow-sm transition-all duration-300 group-hover:scale-105`}
                          >
                            <div
                              className={`text-2xl font-bold ${stage.textColor} mb-2`}
                            >
                              {stage.count}
                            </div>
                            <div className="space-y-1">
                              {stage.universities.slice(0, 2).map((uni, i) => (
                                <div
                                  key={i}
                                  className="text-xs text-gray-600 font-medium truncate"
                                >
                                  {uni}
                                </div>
                              ))}
                              {stage.universities.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{stage.universities.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {stage.stage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Information Card */}
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        Bachelor of Science in Nursing
                      </h3>
                      <p className="text-violet-100 mb-2">
                        Premium Educational Program in Canada
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          B.S.N
                        </span>
                        <span className="bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                          🏆 26 Institutions
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs font-medium opacity-80">
                        DURATION
                      </div>
                      <div className="text-lg font-bold">4 years</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <DollarSign className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs font-medium opacity-80">
                        AVG COST
                      </div>
                      <div className="text-lg font-bold">INR 20.7L</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Calendar className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs font-medium opacity-80">
                        INTAKE
                      </div>
                      <div className="text-lg font-bold">Jun 2025</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Universities Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Recommended Universities
                    </h3>
                    <p className="text-gray-600">
                      Top matches based on your profile and preferences
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/all-universities")}
                    className="text-violet-600 hover:text-violet-700 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>View All Universities</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Search and Controls */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search universities..."
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("cards")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "cards"
                            ? "bg-violet-500 text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-violet-500 text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-gray-900 rounded-xl hover:bg-amber-500 transition-colors font-medium">
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>

                {/* University Cards */}
                {viewMode === "cards" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {recommendedUnis.map((uni, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-violet-300 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                              {uni.logo}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 text-lg">
                                {uni.name}
                              </h4>
                              <div className="flex items-center space-x-2 text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{uni.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                  {uni.country}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {uni.ranking}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-5 h-5 text-amber-400 fill-current" />
                              <span className="font-bold text-violet-600 text-lg">
                                {uni.match}
                              </span>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-gray-600 font-medium">
                                ANNUAL COST
                              </span>
                            </div>
                            <div className="font-bold text-gray-900">
                              {uni.cost}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-gray-600 font-medium">
                                DEADLINE
                              </span>
                            </div>
                            <div className="font-bold text-gray-900">
                              {uni.deadline}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-xs text-gray-600 font-medium mb-2">
                            PROGRAM
                          </div>
                          <div className="text-sm text-gray-900 font-medium">
                            {uni.programs}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-sm">
                            <span className="text-gray-600">
                              Acceptance Rate:{" "}
                            </span>
                            <span className="font-bold text-gray-900">
                              {uni.acceptance}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recommendedUnis.map((uni, index) => (
                      <div
                        key={index}
                        className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 px-4 rounded-lg transition"
                      >
                        <div className="flex items-start space-x-4 flex-1 mb-4 sm:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                            {uni.logo}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                              {uni.name}
                            </h4>
                            <div className="text-sm text-gray-600">
                              {uni.location} • {uni.country}
                            </div>
                            <div className="text-xs text-gray-500">
                              {uni.ranking}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-sm">
                            <span className="text-gray-600">Match: </span>
                            <span className="font-bold text-violet-600">
                              {uni.match}
                            </span>
                          </div>
                          <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm hover:from-violet-600 hover:to-purple-600 transition">
                            Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Upcoming Deadlines
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Don't miss these important application dates
                    </p>
                  </div>
                  <button className="text-violet-600 hover:text-violet-700 font-medium flex items-center space-x-1 transition-colors">
                    <span>View Calendar</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-5 rounded-xl border-l-4 ${
                        deadline.priority === "high"
                          ? "bg-red-50 border-red-500"
                          : deadline.priority === "medium"
                          ? "bg-amber-50 border-amber-500"
                          : "bg-green-50 border-green-500"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-xl ${
                            deadline.priority === "high"
                              ? "bg-red-100"
                              : deadline.priority === "medium"
                              ? "bg-amber-100"
                              : "bg-green-100"
                          }`}
                        >
                          {deadline.priority === "high" ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : deadline.priority === "medium" ? (
                            <Timer className="w-5 h-5 text-amber-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {deadline.university}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {deadline.program}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold text-lg ${
                            deadline.priority === "high"
                              ? "text-red-600"
                              : deadline.priority === "medium"
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {deadline.daysLeft} days left
                        </div>
                        <div className="text-sm text-gray-600">
                          {deadline.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="max-w-7xl mx-auto space-y-6 p-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  My Applications
                </h3>
                <div className="space-y-4">
                  {upcomingDeadlines.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {app.university}
                          </h4>
                          <p className="text-sm text-gray-600">{app.program}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                app.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : app.priority === "medium"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {app.priority === "high"
                                ? "Urgent"
                                : app.priority === "medium"
                                ? "Medium"
                                : "Low"}{" "}
                              Priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {app.date}
                          </div>
                          <div className="text-sm text-gray-600">
                            {app.daysLeft} days left
                          </div>
                        </div>
                        <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium">
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "universities" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    University Search
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Add to Shortlist</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendedUnis.map((uni, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                            {uni.logo}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                              {uni.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{uni.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="font-bold text-violet-600">
                            {uni.match}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Annual Cost:
                          </span>
                          <span className="font-medium text-gray-900">
                            {uni.cost}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Deadline:
                          </span>
                          <span className="font-medium text-gray-900">
                            {uni.deadline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Acceptance:
                          </span>
                          <span className="font-medium text-gray-900">
                            {uni.acceptance}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium">
                          Apply Now
                        </button>
                        <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    My Documents
                  </h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Upload Document</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            doc.status === "completed"
                              ? "bg-green-100"
                              : doc.status === "in-progress"
                              ? "bg-amber-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <FileText
                            className={`w-5 h-5 ${
                              doc.status === "completed"
                                ? "text-green-600"
                                : doc.status === "in-progress"
                                ? "text-amber-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-gray-600">{doc.type}</p>
                          {doc.score && (
                            <p className="text-sm text-violet-600 font-medium">
                              {doc.score}
                            </p>
                          )}
                          {doc.universities && (
                            <p className="text-sm text-amber-600 font-medium">
                              {doc.universities}
                            </p>
                          )}
                          {doc.count && (
                            <p className="text-sm text-blue-600 font-medium">
                              {doc.count}
                            </p>
                          )}
                          {doc.required && (
                            <p className="text-sm text-red-600 font-medium">
                              {doc.required}
                            </p>
                          )}
                          {doc.expires && (
                            <p className="text-sm text-green-600 font-medium">
                              {doc.expires}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            doc.status === "completed"
                              ? "bg-green-500"
                              : doc.status === "in-progress"
                              ? "bg-amber-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "scholarships" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Scholarship Opportunities
                  </h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
                    <Search className="w-4 h-4" />
                    <span>Find More</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scholarships.map((scholarship, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                              {scholarship.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  scholarship.country === "USA"
                                    ? "bg-blue-100 text-blue-800"
                                    : scholarship.country === "UK"
                                    ? "bg-red-100 text-red-800"
                                    : scholarship.country === "Germany"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {scholarship.country}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            scholarship.status === "Applied"
                              ? "bg-blue-100 text-blue-800"
                              : scholarship.status === "Under-review"
                              ? "bg-amber-100 text-amber-800"
                              : scholarship.status === "Eligible"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {scholarship.status.replace("-", " ")}
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="font-bold text-violet-600">
                            {scholarship.amount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Deadline:
                          </span>
                          <span className="font-medium text-gray-900">
                            {scholarship.deadline}
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium">
                        {scholarship.status === "eligible"
                          ? "Apply Now"
                          : "View Details"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  My Profile
                </h3>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Alex Johnson
                    </h4>
                    <p className="text-gray-600">
                      Computer Science Graduate Student
                    </p>
                    <p className="text-sm text-gray-500">
                      Profile Strength: 82%
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-gray-900 mb-3">
                      Personal Information
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="font-medium text-gray-900">
                          alex.johnson@email.com
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <p className="font-medium text-gray-900">
                          +1 (555) 123-4567
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          Location
                        </label>
                        <p className="font-medium text-gray-900">
                          New York, USA
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-3">
                      Academic Information
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">
                          Current Degree
                        </label>
                        <p className="font-medium text-gray-900">
                          Bachelor's in Computer Science
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">GPA</label>
                        <p className="font-medium text-gray-900">3.8/4.0</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          Graduation Year
                        </label>
                        <p className="font-medium text-gray-900">2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Counselor Support
              </h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Get Expert Guidance
                </h4>
                <p className="text-gray-600 mb-6">
                  Connect with our experienced counselors for personalized
                  advice
                </p>
                <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                  Schedule Consultation
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
