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

const DashboardOverview: React.FC = () => {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const navigate = useNavigate();
  const progress = 82;
  const circumference = 2 * Math.PI * 15.9155;
  const dashoffset = circumference * (1 - progress / 100);

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

  return (
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
  );
};

export default DashboardOverview;