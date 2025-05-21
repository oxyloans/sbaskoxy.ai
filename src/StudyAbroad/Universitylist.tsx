import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Star, 
  Globe, 
  Briefcase, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  Loader2, 
  AlertCircle, 
  Filter, 
  X, 
  Calendar, 
  Award, 
  BookOpen, 
  MapPin, 
  University, 
  ExternalLink, 
  Building, 
  Phone, 
  Mail, 
  Users,
  ChevronDown,
  Info,
  Heart,
  Share2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// University Interface based on updated API response
interface University {
  universityName: string;
  country: string | null;
  address: string | null;
  agentName: string | null;
  emailOrWeb: string | null;
  telephoneNumber: string | null;
  countOfUniversitiesMappedToAgent: number;
  locationInIndia: string | null;
  universityLink: string | null;
  universityId: string;
  sno: number | null;
}

interface UniversityApiResponse {
  universities: University[];
  totalUniversities: number;
}

interface Course {
  courseName: string;
  duration: string;
  cost: string;
  typesOfExams: string;
  intake: string | null;
  university: string;
}

interface LocationState {
  course?: Course;
  selectedCountry?: string;
}

const UniversityListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'agent' | 'country'>('name');
  const [filterByAgent, setFilterByAgent] = useState<'all' | 'withAgent' | 'withoutAgent'>('all');
  const [selectedUniversities, setSelectedUniversities] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

// Fetch universities based on selected course
const fetchUniversities = async () => {
  if (!state?.course?.courseName) {
    setError('No course selected');
    setLoading(false);
    setInitialLoad(false);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const courseName = state.course.courseName; 
    const response = await axios.get(
      `https://meta.oxyloans.com/api/student-service/student/${encodeURIComponent(courseName)}/getCoursesBasedUniversities`,
      {} // Empty body since we're sending the course name as part of the URL
    );
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const apiResponse: UniversityApiResponse = response.data;
    setUniversities(apiResponse.universities || []);
    setFilteredUniversities(apiResponse.universities || []);
  } catch (err) {
    console.error('Error fetching universities:', err);
    setError('Failed to fetch universities. Please check your connection and try again.');
  } finally {
    setLoading(false);
    setInitialLoad(false);
  }
};

  useEffect(() => {
    fetchUniversities();
  }, [state?.course?.courseName]);

  // Filter and sort universities
  useEffect(() => {
    let filtered = universities.filter(university => {
      const matchesSearch = university.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (university.agentName && university.agentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (university.locationInIndia && university.locationInIndia.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAgent = filterByAgent === 'all' || 
                          (filterByAgent === 'withAgent' && university.agentName) ||
                          (filterByAgent === 'withoutAgent' && !university.agentName);
      
      return matchesSearch && matchesAgent;
    });

    // Sort universities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.universityName.localeCompare(b.universityName);
        case 'agent':
          const agentA = a.agentName || '';
          const agentB = b.agentName || '';
          return agentA.localeCompare(agentB);
        case 'country':
          const countryA = a.country || state?.selectedCountry || '';
          const countryB = b.country || state?.selectedCountry || '';
          return countryA.localeCompare(countryB);
        default:
          return 0;
      }
    });

    setFilteredUniversities(filtered);
  }, [searchTerm, universities, sortBy, filterByAgent, state?.selectedCountry]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleUniversitySelect = (university: University) => {
    // Toggle selection for future features
    const newSelected = new Set(selectedUniversities);
    if (newSelected.has(university.universityId)) {
      newSelected.delete(university.universityId);
    } else {
      newSelected.add(university.universityId);
    }
    setSelectedUniversities(newSelected);
    
    // Navigate to university details or next step
    console.log('Selected university:', university);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setFilterByAgent('all');
  };

  const getDegreeType = (courseName: string) => {
    const match = courseName.match(/\[(.*?)\]/);
    return match ? match[1] : '';
  };

  const getFieldOfStudy = (courseName: string) => {
    return courseName.replace(/\[.*?\]/, '').trim();
  };

  const formatExamRequirements = (exams: string) => {
    if (!exams) return [];
    return exams.split('|').filter(exam => exam.trim());
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareUniversity = (university: University, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: university.universityName,
        text: `Check out ${university.universityName} for ${state?.course?.courseName}`,
        url: university.universityLink || window.location.href
      });
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(university.universityLink || window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Enhanced loading screen with course context
  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                <University className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Search className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Finding Universities</h2>
            <p className="text-gray-600">
              Searching for the best institutions offering<br />
              <span className="font-semibold text-indigo-600">
                {state?.course?.courseName ? getFieldOfStudy(state.course.courseName) : 'your selected program'}
              </span>
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex space-x-1 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">This may take a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading state during data fetch
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Animated Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-96"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
          </div>

          {/* Course Info Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 mb-8 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-4 lg:mb-0 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-80"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Search and Filters Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 mb-8 animate-pulse">
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* University Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 h-96 animate-pulse">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-16 bg-gray-100 rounded-xl"></div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={fetchUniversities}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <button 
                onClick={handleBackClick}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackClick}
              className="flex items-center group mr-6"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:scale-105 transition-all duration-300 shadow-sm">
                <ArrowLeft size={20} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </div>
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Universities for
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block sm:inline sm:ml-3">
                  {state?.course ? getFieldOfStudy(state.course.courseName) : 'Your Program'}
                </span>
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                {filteredUniversities.length} of {universities.length} institutions found
                {state?.selectedCountry && (
                  <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {state.selectedCountry}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Course Information Card */}
        {state?.course && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
              <div className="bg-white rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="mb-6 lg:mb-0">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-4">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {getFieldOfStudy(state.course.courseName)}
                        </h2>
                        {getDegreeType(state.course.courseName) && (
                          <span className="mt-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                            {getDegreeType(state.course.courseName)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600">Selected program overview</p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <Clock className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-bold text-gray-800">{state.course.duration}</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <DollarSign className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">Annual Cost</p>
                      <p className="font-bold text-gray-800">{state.course.cost}</p>
                    </div>

                    {state.course.intake && (
                      <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <Calendar className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-1">Next Intake</p>
                        <p className="font-bold text-gray-800">{state.course.intake}</p>
                      </div>
                    )}

                    {state.course.typesOfExams && (
                      <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <Award className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-1">Required Exams</p>
                        <p className="font-bold text-gray-800">
                          {formatExamRequirements(state.course.typesOfExams).length} exam(s)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filters Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search universities, agents, or locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-lg placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">View Mode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    viewMode === 'card'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Card View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>

            {/* Filter Toggle for Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className={`ml-2 h-4 w-4 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-6`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'agent' | 'country')}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                >
                  <option value="name">University Name</option>
                  <option value="agent">Agent Name</option>
                  <option value="country">Country</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Availability</label>
                <select 
                  value={filterByAgent}
                  onChange={(e) => setFilterByAgent(e.target.value as 'all' | 'withAgent' | 'withoutAgent')}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                >
                  <option value="all">All Universities</option>
                  <option value="withAgent">With Agent</option>
                  <option value="withoutAgent">Without Agent</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                <div className="flex gap-2">
                  <button 
                    onClick={clearFilters}
                    className="flex-1 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200 text-sm font-medium"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </button>
                  <button 
                    onClick={() => setSelectedUniversities(new Set(filteredUniversities.map(u => u.universityId)))}
                    className="flex-1 p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center border border-indigo-200 text-sm font-medium"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Select All
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-gray-200">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-semibold text-gray-800">
                  Showing {filteredUniversities.length} of {universities.length} universities
                </p>
                <p className="text-sm text-gray-600">
                  {selectedUniversities.size > 0 && (
                    <span className="text-indigo-600 font-medium">
                      {selectedUniversities.size} selected
                    </span>
                  )}
                </p>
              </div>
              {filteredUniversities.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-700 capitalize mr-2">
                    Sorted by: {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  {filterByAgent !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {filterByAgent === 'withAgent' ? 'With Agent' : 'No Agent'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Universities Grid/List */}
        {filteredUniversities.length > 0 ? (
          <div className={
            viewMode === 'card' 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredUniversities.map((university, index) => {
              const isSelected = selectedUniversities.has(university.universityId);
              
              if (viewMode === 'list') {
                return (
                  <div 
                    key={university.universityId || index}
                    className={`bg-white/80 backdrop-blur-sm border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      isSelected ? 'border-indigo-300 bg-indigo-50/50' : 'border-white/20 hover:border-indigo-200'
                    }`}
                    onClick={() => handleUniversitySelect(university)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-800 mr-3">
                            {university.universityName}
                          </h3>
                          <div className="flex gap-2">
                            {university.agentName && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                Agent Available
                              </span>
                            )}
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                              {state?.selectedCountry || university.country || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          {university.agentName && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 text-indigo-500 mr-2" />
                              <span>Agent: {university.agentName}</span>
                            </div>
                          )}
                          {university.locationInIndia && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                              <span>India Office: {university.locationInIndia}</span>
                            </div>
                          )}
                          {university.emailOrWeb && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 text-indigo-500 mr-2" />
                              <span className="truncate">{university.emailOrWeb}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {university.universityLink && (
                          <button
                            onClick={(e) => handleExternalLink(university.universityLink!, e)}
                            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all duration-300 flex items-center text-sm font-medium"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Site
                          </button>
                        )}
                        <button
                          onClick={(e) => handleShareUniversity(university, e)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium text-sm">
                          Get Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Card view
              return (
                <div 
                  key={university.universityId || index}
                  className={`bg-white/80 backdrop-blur-sm border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col ${
                    isSelected 
                      ? 'border-indigo-300 ring-2 ring-indigo-100 bg-indigo-50/30' 
                      : 'border-white/20 hover:border-indigo-200 hover:shadow-lg'
                  }`}
                  onClick={() => handleUniversitySelect(university)}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                          {university.universityName}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {state?.selectedCountry || university.country || 'Unknown'}
                          </span>
                          {university.agentName && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Agent Available
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={(e) => handleShareUniversity(university, e)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        {isSelected && (
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 pb-4 flex-1">
                    <div className="space-y-4">
                      {university.agentName && (
                        <div className="flex items-start p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-green-600 font-medium mb-1">Agent Representative</p>
                            <p className="font-semibold text-gray-800 text-sm">{university.agentName}</p>
                            {university.countOfUniversitiesMappedToAgent > 1 && (
                              <p className="text-xs text-green-600 mt-1">
                                Represents {university.countOfUniversitiesMappedToAgent} universities
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {university.locationInIndia && (
                        <div className="flex items-start p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-blue-600 font-medium mb-1">India Office</p>
                            <p className="font-semibold text-gray-800 text-sm">{university.locationInIndia}</p>
                          </div>
                        </div>
                      )}

                      {university.address && (
                        <div className="flex items-start p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Building className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-purple-600 font-medium mb-1">Campus Address</p>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-2">{university.address}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        {university.emailOrWeb && (
                          <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <Mail className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-1">Contact</p>
                              <p className="font-medium text-gray-800 text-sm truncate">{university.emailOrWeb}</p>
                            </div>
                          </div>
                        )}

                        {university.telephoneNumber && (
                          <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <Phone className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Phone</p>
                              <p className="font-medium text-gray-800 text-sm">{university.telephoneNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-4 mt-auto">
                    <div className="space-y-3">
                      {university.universityLink && (
                        <button 
                          onClick={(e) => handleExternalLink(university.universityLink!, e)}
                          className="w-full bg-white text-indigo-600 border-2 border-indigo-200 py-3 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 flex items-center justify-center font-medium text-sm group/btn"
                        >
                          <Globe className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                          Visit University Website
                          <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                      )}
                      
                      <button className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center font-medium text-sm shadow-lg hover:shadow-xl group/btn">
                        <Info className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                        Get Detailed Information
                        <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Enhanced Empty State
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/20 max-w-lg mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <University className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Universities Found</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any universities matching your search criteria. 
                This might be because the course is highly specialized or our database is being updated.
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </button>
                  <button 
                    onClick={handleBackClick}
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Choose Different Course
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-800 mb-1">Helpful Tips:</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Try searching with different keywords</li>
                        <li>• Remove some filters to broaden your search</li>
                        <li>• Check if you've selected the correct course</li>
                        <li>• Contact our support team for assistance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Selection Summary (when universities are selected) */}
        {selectedUniversities.size > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 max-w-sm w-full mx-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedUniversities.size} universities selected
                  </p>
                  <p className="text-xs text-gray-600">Ready to compare or get details</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedUniversities(new Set())}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium">
                    Compare
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityListPage;