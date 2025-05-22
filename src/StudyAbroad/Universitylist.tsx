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
  Share2,
  Grid3X3,
  List,
  SlidersHorizontal,
  CheckCircle2,
  Crown
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
        `http://65.0.147.157:9001/api/student-service/student/${encodeURIComponent(courseName)}/getCoursesBasedUniversities`,
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
    const newSelected = new Set(selectedUniversities);
    if (newSelected.has(university.universityId)) {
      newSelected.delete(university.universityId);
    } else {
      newSelected.add(university.universityId);
    }
    setSelectedUniversities(newSelected);
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
      navigator.clipboard.writeText(university.universityLink || window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Enhanced loading screen with course context
  if (initialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-xl animate-pulse">
                <University className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-bounce shadow-md">
                <Search className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Finding Universities
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Searching for institutions offering<br />
              <span className="font-bold text-purple-700 block mt-1">
                {state?.course?.courseName ? getFieldOfStudy(state.course.courseName) : 'your selected program'}
              </span>
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex space-x-1 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading state during data fetch
  if (loading) {
    return (
      <div className="bg-white">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Skeleton */}
          <div className="mb-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 mr-3"></div>
              <div className="space-y-2">
                <div className="h-6 bg-purple-100 rounded w-64"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Course Info Skeleton */}
          <div className="bg-white border border-purple-100 rounded-xl shadow-md p-4 mb-6 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-3 lg:mb-0 space-y-2">
                <div className="h-5 bg-purple-100 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Skeleton */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg mb-3"></div>
            <div className="flex gap-3">
              <div className="h-8 bg-gray-200 rounded-md flex-1"></div>
              <div className="h-8 bg-gray-200 rounded-md w-24"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 h-64 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="h-8 bg-gray-100 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-auto pt-3">
                    <div className="h-6 bg-purple-100 rounded-md"></div>
                    <div className="h-6 bg-yellow-100 rounded-md"></div>
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 border-2 border-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={fetchUniversities}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-medium flex items-center justify-center shadow-md text-sm"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <button 
                onClick={handleBackClick}
                className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm text-sm"
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
    <div className=" bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBackClick}
              className="flex items-center group mr-4"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-purple-200 group-hover:border-purple-400 group-hover:shadow-md transition-all duration-300">
                <ArrowLeft size={16} className="text-purple-600 group-hover:text-purple-800 transition-colors" />
              </div>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                Elite Universities for
                <span className="bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent block sm:inline sm:ml-2">
                  {state?.course ? getFieldOfStudy(state.course.courseName) : 'Your Program'}
                </span>
              </h1>
              <div className="flex items-center mt-2 text-sm">
                <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-gray-600 font-medium">
                  {filteredUniversities.length} of {universities.length} institutions
                </span>
                {state?.selectedCountry && (
                  <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-xs font-medium border border-purple-300">
                    {state.selectedCountry}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Course Information Card */}
        {state?.course && (
          <div className="bg-white border border-purple-200 rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-0.5">
              <div className="bg-white rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center mr-3 shadow-md">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">
                          {getFieldOfStudy(state.course.courseName)}
                        </h2>
                        {getDegreeType(state.course.courseName) && (
                          <span className="mt-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full shadow-sm">
                            {getDegreeType(state.course.courseName)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Premium Educational Program</p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <Clock className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-purple-600 font-bold mb-1">DURATION</p>
                      <p className="font-bold text-gray-800 text-xs">{state.course.duration}</p>
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <DollarSign className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xs text-yellow-600 font-bold mb-1">COST</p>
                      <p className="font-bold text-gray-800 text-xs">{state.course.cost}</p>
                    </div>

                    {state.course.intake && (
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <Calendar className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-600 font-bold mb-1">INTAKE</p>
                        <p className="font-bold text-gray-800 text-xs">{state.course.intake}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-purple-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search universities, agents, or locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-sm placeholder-gray-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-purple-600 transition-colors" />
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Mode & Filter Toggle */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-purple-50 border border-purple-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-2 text-xs font-bold rounded-md transition-all duration-300 flex items-center ${
                    viewMode === 'card'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <Grid3X3 className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-xs font-bold rounded-md transition-all duration-300 flex items-center ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <List className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg border border-yellow-300 hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-bold text-xs"
              >
                <SlidersHorizontal className="mr-1 h-3 w-3" />
                Filters
                <ChevronDown className={`ml-1 h-3 w-3 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'agent' | 'country')}
                className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs bg-white font-medium text-purple-800"
              >
                <option value="name">Sort by Name</option>
                <option value="agent">Sort by Agent</option>
                <option value="country">Sort by Country</option>
              </select>

              <select 
                value={filterByAgent}
                onChange={(e) => setFilterByAgent(e.target.value as 'all' | 'withAgent' | 'withoutAgent')}
                className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs bg-white font-medium text-purple-800"
              >
                <option value="all">All Universities</option>
                <option value="withAgent">With Agent</option>
                <option value="withoutAgent">Without Agent</option>
              </select>

              <button 
                onClick={clearFilters}
                className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center border border-gray-300 text-xs font-bold"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {isFilterOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-3">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'agent' | 'country')}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs bg-white font-medium text-purple-800"
                >
                  <option value="name">Sort by Name</option>
                  <option value="agent">Sort by Agent</option>
                  <option value="country">Sort by Country</option>
                </select>

                <select 
                  value={filterByAgent}
                  onChange={(e) => setFilterByAgent(e.target.value as 'all' | 'withAgent' | 'withoutAgent')}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs bg-white font-medium text-purple-800"
                >
                  <option value="all">All Universities</option>
                  <option value="withAgent">With Agent</option>
                  <option value="withoutAgent">Without Agent</option>
                </select>

                <button 
                  onClick={clearFilters}
                  className="w-full px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center border border-gray-300 text-xs font-bold"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 mt-4 border-t border-gray-200">
            <div>
              <p className="text-sm font-bold text-gray-800 flex items-center">
                <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                {filteredUniversities.length} Universities
              </p>
              {selectedUniversities.size > 0 && (
                <p className="text-xs text-purple-600 font-bold">
                  {selectedUniversities.size} selected
                </p>
              )}
            </div>
            {filteredUniversities.length > 0 && filterByAgent !== 'all' && (
              <span className="mt-2 sm:mt-0 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs font-bold border border-blue-300">
                {filterByAgent === 'withAgent' ? 'With Agent' : 'Direct'}
              </span>
            )}
          </div>
        </div>

        {/* Universities Grid/List */}
        {filteredUniversities.length > 0 ? (
          <div className={
            viewMode === 'card' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4"
              : "space-y-4"
          }>
            {filteredUniversities.map((university, index) => {
              const isSelected = selectedUniversities.has(university.universityId);
              
              if (viewMode === 'list') {
                return (
                  <div 
                    key={university.universityId || index}
                    className={`bg-white border rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg ring-2 ring-purple-200' 
                        : 'border-gray-300 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleUniversitySelect(university)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 mb-3 lg:mb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800 mr-3 line-clamp-2 mb-2">
                              {university.universityName}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold rounded-full shadow-sm">
                                {state?.selectedCountry || university.country || 'International'}
                              </span>
                              {university.agentName && (
                                <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs font-bold rounded-full shadow-sm">
                                  Agent
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center ml-3 shadow-md">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                          {university.agentName && (
                            <div className="flex items-center text-xs text-gray-700 font-medium">
                              <Users className="h-3 w-3 text-purple-600 mr-2 flex-shrink-0" />
                              <span className="truncate">Agent: {university.agentName}</span>
                            </div>
                          )}
                          {university.locationInIndia && (
                            <div className="flex items-center text-xs text-gray-700 font-medium">
                              <MapPin className="h-3 w-3 text-purple-600 mr-2 flex-shrink-0" />
                              <span className="truncate">Office: {university.locationInIndia}</span>
                            </div>
                          )}
                          {university.emailOrWeb && (
                            <div className="flex items-center text-xs text-gray-700 font-medium">
                              <Mail className="h-3 w-3 text-purple-600 mr-2 flex-shrink-0" />
                              <span className="truncate">{university.emailOrWeb}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 lg:flex-col lg:gap-2">
                        {university.universityLink && (
                          <button
                            onClick={(e) => handleExternalLink(university.universityLink!, e)}
                            className="px-3 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 flex items-center text-xs font-bold shadow-sm"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Visit
                          </button>
                        )}
                        <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-bold text-xs whitespace-nowrap shadow-md">
                          Details
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
                  className={`bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col ${
                    isSelected 
                      ? 'border-purple-400 ring-2 ring-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-white' 
                      : 'border-gray-300 hover:border-purple-400 hover:shadow-lg'
                  }`}
                  onClick={() => handleUniversitySelect(university)}
                >
                  {/* Card Header */}
                  <div className="p-3 pb-2">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                          {university.universityName}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold rounded-full shadow-sm">
                            {state?.selectedCountry || university.country || 'Intl'}
                          </span>
                          {university.agentName && (
                            <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs font-bold rounded-full shadow-sm">
                              Agent
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <button
                          onClick={(e) => handleShareUniversity(university, e)}
                          className="p-1 rounded-md bg-gray-100 border border-gray-300 text-gray-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
                        >
                          <Share2 className="h-3 w-3" />
                        </button>
                        {isSelected && (
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-3 pb-2 flex-1">
                    <div className="space-y-2">
                      {university.agentName && (
                        <div className="flex items-start p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                            <Users className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-green-700 font-bold mb-0.5">AGENT</p>
                            <p className="font-bold text-gray-800 text-xs truncate">{university.agentName}</p>
                          </div>
                        </div>
                      )}

                      {university.locationInIndia && (
                        <div className="flex items-start p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                            <MapPin className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-700 font-bold mb-0.5">OFFICE</p>
                            <p className="font-bold text-gray-800 text-xs truncate">{university.locationInIndia}</p>
                          </div>
                        </div>
                      )}

                      {university.emailOrWeb && (
                        <div className="flex items-start p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                            <Mail className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 font-bold mb-0.5">CONTACT</p>
                            <p className="font-bold text-gray-800 text-xs truncate">{university.emailOrWeb}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 pt-2 mt-auto">
                    <div className="space-y-2">
                      {university.universityLink && (
                        <button 
                          onClick={(e) => handleExternalLink(university.universityLink!, e)}
                          className="w-full bg-white text-purple-700 border border-purple-300 py-2 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-sm"
                        >
                          <Globe className="mr-1 h-3 w-3" />
                          Website
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </button>
                      )}
                      
                      <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-md hover:shadow-lg">
                        <Crown className="mr-1 h-3 w-3" />
                        Details
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Enhanced Empty State
          <div className="text-center py-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                  <University className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Universities Found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                No universities match your search criteria. 
                Try adjusting your filters.
              </p>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-bold flex items-center justify-center shadow-md text-sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </button>
                  <button 
                    onClick={handleBackClick}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-bold flex items-center justify-center shadow-md text-sm"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Selection Summary */}
        {selectedUniversities.size > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-xs">
            <div className="bg-white border border-purple-300 rounded-xl shadow-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800 flex items-center">
                    <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                    {selectedUniversities.size} Selected
                  </p>
                  <p className="text-xs text-purple-600 font-medium">Ready to compare</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedUniversities(new Set())}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-md hover:border-gray-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-xs font-bold shadow-md">
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