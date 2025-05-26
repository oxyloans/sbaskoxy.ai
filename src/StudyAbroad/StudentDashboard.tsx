import React, { useState } from 'react';
import { 
  GraduationCap, 
  Globe, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  TrendingUp,
  MapPin,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Send,
  BookOpen,
  Award,
  Target,
  Users,
  Bookmark
} from 'lucide-react';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'universities', label: 'University Search', icon: Building2 },
    { id: 'countries', label: 'Study Destinations', icon: Globe },
    { id: 'scholarships', label: 'Scholarships', icon: Award },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'calendar', label: 'Important Dates', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'support', label: 'Counselor Support', icon: MessageCircle },
  ];

  const kpiCards = [
    { 
      title: 'Total Applications', 
      value: '15', 
      subtitle: '8 Submitted • 4 In Progress • 3 Draft', 
      icon: Send, 
      gradient: 'from-purple-600 via-purple-500 to-purple-400',
      change: '+3 this week'
    },
    { 
      title: 'Countries Explored', 
      value: '6', 
      subtitle: 'USA • UK • Canada • Australia • Germany • Netherlands', 
      icon: Globe, 
      gradient: 'from-purple-500 via-indigo-500 to-purple-400',
      change: '+1 new country'
    },
    { 
      title: 'Universities Shortlisted', 
      value: '24', 
      subtitle: '8 Dream Schools • 10 Target • 6 Safety Schools', 
      icon: Building2, 
      gradient: 'from-indigo-500 via-purple-500 to-purple-400',
      change: '+4 this month'
    },
    { 
      title: 'Application Deadlines', 
      value: '8', 
      subtitle: '3 This Month • 5 Next Month • 2 Overdue', 
      icon: Clock, 
      gradient: 'from-amber-500 via-yellow-400 to-amber-400',
      change: '3 approaching'
    },
    { 
      title: 'Scholarship Applications', 
      value: '12', 
      subtitle: '5 Pending • 3 Approved • 2 Under Review • 2 Rejected', 
      icon: Award, 
      gradient: 'from-yellow-500 via-amber-400 to-yellow-400',
      change: '$45K potential'
    },
    { 
      title: 'Document Progress', 
      value: '18/24', 
      subtitle: 'Transcripts • SOP • LORs • Test Scores • Essays', 
      icon: FileText, 
      gradient: 'from-amber-400 via-yellow-400 to-amber-300',
      change: '75% Complete'
    },
  ];

  const applicationStages = [
    { stage: 'Researching', count: 35, universities: ['MIT', 'Stanford', 'Harvard'], color: 'from-purple-100 to-purple-50', textColor: 'text-purple-700' },
    { stage: 'Shortlisted', count: 24, universities: ['Oxford', 'Cambridge', 'UCL'], color: 'from-purple-200 to-purple-100', textColor: 'text-purple-800' },
    { stage: 'Applied', count: 15, universities: ['Toronto', 'McGill', 'UBC'], color: 'from-purple-300 to-purple-200', textColor: 'text-purple-900' },
    { stage: 'Interview Scheduled', count: 6, universities: ['Yale', 'Princeton'], color: 'from-amber-200 to-amber-100', textColor: 'text-amber-800' },
    { stage: 'Decision Received', count: 3, universities: ['Columbia'], color: 'from-amber-300 to-amber-200', textColor: 'text-amber-900' },
    { stage: 'Accepted & Enrolled', count: 1, universities: ['Berkeley'], color: 'from-yellow-300 to-yellow-200', textColor: 'text-yellow-900' },
  ];

  const recommendedUnis = [
    { 
      name: 'University of California, Berkeley', 
      location: 'California, USA', 
      cost: '$65,000/year', 
      ranking: '#4 Global', 
      deadline: 'December 30, 2024',
      match: '95%',
      programs: 'Computer Science, Data Science',
      acceptance: '17%'
    },
    { 
      name: 'University College London', 
      location: 'London, UK', 
      cost: '£35,000/year', 
      ranking: '#8 Global', 
      deadline: 'January 15, 2025',
      match: '92%',
      programs: 'AI & Machine Learning',
      acceptance: '63%'
    },
    { 
      name: 'University of Toronto', 
      location: 'Toronto, Canada', 
      cost: 'CAD 58,000/year', 
      ranking: '#18 Global', 
      deadline: 'January 31, 2025',
      match: '88%',
      programs: 'Engineering Science',
      acceptance: '43%'
    },
  ];

  const upcomingDeadlines = [
    { university: 'Stanford University', program: 'MS Computer Science', date: 'Dec 15, 2024', daysLeft: 8, priority: 'high' },
    { university: 'MIT', program: 'MS Artificial Intelligence', date: 'Dec 20, 2024', daysLeft: 13, priority: 'high' },
    { university: 'Carnegie Mellon', program: 'MS Software Engineering', date: 'Jan 5, 2025', daysLeft: 29, priority: 'medium' },
    { university: 'University of Washington', program: 'MS Data Science', date: 'Jan 15, 2025', daysLeft: 39, priority: 'medium' },
    { university: 'Georgia Tech', program: 'MS Computer Science', date: 'Feb 1, 2025', daysLeft: 56, priority: 'low' },
  ];

  const documents = [
    { name: 'Academic Transcripts', status: 'completed', type: 'Academic Records', lastUpdated: '2 days ago' },
    { name: 'English Proficiency (IELTS)', status: 'completed', type: 'Language Test', score: '7.5 Overall' },
    { name: 'GRE Test Scores', status: 'completed', type: 'Standardized Test', score: '325/340' },
    { name: 'Statement of Purpose', status: 'in-progress', type: 'Essays', universities: '8 versions' },
    { name: 'Letters of Recommendation', status: 'pending', type: 'References', count: '2/3 received' },
    { name: 'Resume/CV', status: 'completed', type: 'Professional', lastUpdated: '1 week ago' },
    { name: 'Financial Documents', status: 'pending', type: 'Financial Proof', required: '$75,000' },
    { name: 'Passport Copy', status: 'completed', type: 'Identity', expires: 'Valid until 2028' },
  ];

  const scholarships = [
    { name: 'Fulbright Scholarship', amount: '$25,000', deadline: 'Oct 15, 2024', status: 'applied', country: 'USA' },
    { name: 'Chevening Scholarship', amount: 'Full Funding', deadline: 'Nov 2, 2024', status: 'under-review', country: 'UK' },
    { name: 'DAAD Scholarship', amount: '€12,000', deadline: 'Dec 1, 2024', status: 'eligible', country: 'Germany' },
    { name: 'Australia Awards', amount: 'Full Funding', deadline: 'Apr 30, 2025', status: 'bookmarked', country: 'Australia' },
  ];

  const currentSidebarItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-purple-900 bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-amber-500">
              <h2 className="text-xl font-bold text-white">StudyAbroad Pro</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-purple-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-100 to-amber-50 text-purple-700 shadow-sm border-l-4 border-purple-500'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-amber-25 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl">
          <div className="px-6 py-6 bg-gradient-to-r from-purple-600 to-amber-500">
            <h2 className="text-2xl font-bold text-white">StudyAbroad Pro</h2>
            <p className="text-purple-100 text-sm mt-1">Your Study Journey Companion</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-100 to-amber-50 text-purple-700 shadow-sm border-l-4 border-purple-500'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-amber-25 hover:text-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-amber-50 m-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="mt-4 font-semibold text-gray-900">Alex Johnson</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-purple-100">
          <div className="flex items-center justify-between px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                  Welcome back, Alex!
                </h1>
                <p className="text-gray-600 mt-1">You have 8 deadlines approaching this month</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-amber-50 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-semibold text-gray-900 text-sm">Alex Johnson</p>
                  <p className="text-xs text-gray-600">CS Graduate Student</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Profile Strength */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Profile Strength Score</h3>
                    <p className="text-gray-600 mt-1">Complete your profile to increase admission chances</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                      82%
                    </div>
                    <p className="text-sm text-gray-600">Excellent</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-amber-500 h-4 rounded-full shadow-sm" style={{ width: '82%' }}></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Complete SOP and LORs to reach 95%</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-800 font-medium">View Details</button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {kpiCards.map((card, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-purple-50 p-6 hover:shadow-md transition-all duration-200 hover:border-purple-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-sm`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                        <div className="text-xs text-purple-600 font-medium">{card.change}</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{card.subtitle}</p>
                  </div>
                ))}
              </div>

              {/* Application Pipeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Application Pipeline</h3>
                    <p className="text-gray-600 mt-1">Track your progress through each application stage</p>
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm hover:shadow-md transition-shadow">
                    View All Applications
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {applicationStages.map((stage, index) => (
                    <div key={index} className="text-center">
                      <div className={`bg-gradient-to-br ${stage.color} p-6 rounded-2xl mb-3 hover:shadow-sm transition-shadow`}>
                        <div className={`text-2xl font-bold ${stage.textColor} mb-2`}>{stage.count}</div>
                        <div className="space-y-1">
                          {stage.universities.slice(0, 2).map((uni, i) => (
                            <div key={i} className={`text-xs ${stage.textColor} opacity-80`}>{uni}</div>
                          ))}
                          {stage.universities.length > 2 && (
                            <div className={`text-xs ${stage.textColor} opacity-60`}>+{stage.universities.length - 2} more</div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{stage.stage}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recommended Universities */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
                      <p className="text-gray-600 mt-1">Universities matching your profile and preferences</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">View All Matches</button>
                  </div>
                  <div className="space-y-4">
                    {recommendedUnis.map((uni, index) => (
                      <div key={index} className="border border-purple-50 rounded-xl p-5 hover:border-purple-200 hover:bg-gradient-to-r hover:from-purple-25 hover:to-amber-25 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-bold text-gray-900 text-lg">{uni.name}</h4>
                              <span className="bg-gradient-to-r from-purple-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {uni.match} Match
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-3 h-3 mr-2" />
                                  {uni.location}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Star className="w-3 h-3 mr-2" />
                                  {uni.ranking}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-gray-600">Cost: {uni.cost}</div>
                                <div className="text-gray-600">Acceptance: {uni.acceptance}</div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-purple-600 font-medium">{uni.programs}</p>
                              <p className="text-xs text-gray-500 mt-1">Application Deadline: {uni.deadline}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <button className="bg-gradient-to-r from-purple-500 to-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:shadow-md transition-shadow">
                              Apply Now
                            </button>
                            <button className="border border-purple-200 text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-50 transition-colors">
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgent Deadlines */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Urgent Deadlines</h3>
                      <p className="text-gray-600 mt-1 text-sm">Don't miss these important dates</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className={`p-4 rounded-xl border ${
                        deadline.priority === 'high' ? 'border-red-200 bg-gradient-to-r from-red-25 to-red-10' :
                        deadline.priority === 'medium' ? 'border-amber-200 bg-gradient-to-r from-amber-25 to-amber-10' :
                        'border-purple-200 bg-gradient-to-r from-purple-25 to-purple-10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{deadline.university}</h4>
                            <p className="text-xs text-gray-600 mt-1">{deadline.program}</p>
                            <p className="text-xs text-gray-500 mt-1">{deadline.date}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              deadline.priority === 'high' ? 'text-red-600' :
                              deadline.priority === 'medium' ? 'text-amber-600' :
                              'text-purple-600'
                            }`}>
                              {deadline.daysLeft} days
                            </div>
                            <div className="text-xs text-gray-500">remaining</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium py-2 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                    View All Deadlines
                  </button>
                </div>
              </div>

              {/* Documents & Scholarships */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Document Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Document Center</h3>
                      <p className="text-gray-600 mt-1 text-sm">Manage all your application documents</p>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm hover:shadow-md transition-shadow flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload
                    </button>
                  </div>
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-purple-50 rounded-xl hover:border-purple-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          {doc.status === 'completed' ? (
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          ) : doc.status === 'in-progress' ? (
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.type}</p>
                            {doc.score && <p className="text-xs text-purple-600 font-medium">{doc.score}</p>}
                            {doc.lastUpdated && <p className="text-xs text-gray-400">{doc.lastUpdated}</p>}
                          </div>
                        </div>
                        {doc.status === 'completed' && (
                          <div className="flex space-x-2">
                            <button className="text-purple-600 hover:text-purple-800 p-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800 p-1">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scholarship Opportunities */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Scholarship Tracker</h3>
                      <p className="text-gray-600 mt-1 text-sm">Track funding opportunities</p>
                    </div>
                                        <button className="bg-gradient-to-r from-purple-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm hover:shadow-md transition-shadow flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      Find Scholarships
                    </button>
                  </div>
                  <div className="space-y-3">
                    {scholarships.map((scholarship, index) => (
                      <div key={index} className="p-4 border border-purple-50 rounded-xl hover:border-purple-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{scholarship.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{scholarship.country} • {scholarship.amount}</p>
                            <p className="text-xs text-gray-500 mt-1">Deadline: {scholarship.deadline}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            {scholarship.status === 'applied' && (
                              <span className="bg-gradient-to-r from-purple-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium mb-2">
                                Applied
                              </span>
                            )}
                            {scholarship.status === 'under-review' && (
                              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-xs px-2 py-1 rounded-full font-medium mb-2">
                                Under Review
                              </span>
                            )}
                            {scholarship.status === 'eligible' && (
                              <span className="bg-gradient-to-r from-green-500 to-teal-400 text-white text-xs px-2 py-1 rounded-full font-medium mb-2">
                                Eligible
                              </span>
                            )}
                            {scholarship.status === 'bookmarked' && (
                              <span className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium mb-2">
                                Bookmarked
                              </span>
                            )}
                            <button className="text-purple-600 hover:text-purple-800 p-1">
                              {scholarship.status === 'bookmarked' ? (
                                <Bookmark className="w-4 h-4 fill-current" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium py-2 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                    View All Scholarships
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;