import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronRight, ArrowLeft, Clock, DollarSign, GraduationCap, Loader2, AlertCircle, X, Calendar, Award, BookOpen, University, Crown, SlidersHorizontal, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Course Interface based on API response
interface Course {
  courseName: string;
  duration: string;
  cost: string;
  typesOfExams: string;
  intake: string | null;
  university: string;
}

// Updated University Interface based on new API response (filtered fields)
interface UniversityData {
  universityName: string;
  country: string;
  address: string;
  universityLink: string;
  universityId: string;
  countryId: string;
  universityCampusCity: string;
  universityLogo: string;
}

interface UniversityApiResponse {
  universities: UniversityData[];
  totalUniversities: number;
}

interface ApiResponse {
  data: Course[];
  count: number;
}

interface LocationState {
  selectedCountry?: string | { countryName: string; countryCode: string; name: string; id: string };
  userRole?: string;
}

// Utility function to get access token from localStorage
const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error accessing token from storage:', error);
    return null;
  }
};

// Utility function to create axios config with auth headers
const createAuthConfig = () => {
  const token = getAccessToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
};

// Utility function to handle auth errors
const handleAuthError = (error: any, navigate: any) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    // Clear invalid tokens
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    // Redirect to login or home page
    navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
    return true;
  }
  return false;
};

const CoursesPage: React.FC<{ 
  onCourseSelect?: (course: Course) => void 
}> = ({ onCourseSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All');
  const [selectedCostRange, setSelectedCostRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'duration' | 'university'>('name');

  // Helper function to get country name safely
  const getCountryName = (country: string | { countryName: string; countryCode: string; name: string; id: string } | undefined): string => {
    if (!country) return 'Unknown Country';
    if (typeof country === 'string') return country;
    return country.countryName || country.name || 'Unknown Country';
  };

  // Helper function to get country for API calls
  const getCountryForAPI = (country: string | { countryName: string; countryCode: string; name: string; id: string } | undefined): string => {
    if (!country) return '';
    if (typeof country === 'string') return country;
    return country.countryName || country.name || '';
  };

  // Helper function to format cost display
  const formatCost = (cost: string | null | undefined): string => {
    if (!cost || cost === 'null' || cost === 'undefined' || cost.trim() === '') {
      return 'Contact for Price';
    }
    return cost;
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      setLoading(false);
      setInitialLoad(false);
      return;
    }
  }, [navigate]);

  // Extract unique values for filters
  const degreeTypes = ['All', ...Array.from(new Set(courses.map(course => {
    const match = course.courseName.match(/\[(.*?)\]/);
    return match ? match[1] : 'Other';
  })))];

  const durations = ['All', ...Array.from(new Set(courses.map(course => course.duration || 'Not specified')))];
  
  const universities = ['All', ...Array.from(new Set(courses.map(course => course.university || 'Unknown University')))];

  const costRanges = [
    'All',
    'Under $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $75,000',
    'Above $75,000',
    'Contact for Price'
  ];

  // Helper function to get numeric cost value
  const getNumericCost = (costString: string): number => {
    if (!costString || costString === 'Contact for Price' || costString === 'null') return 0;
    const match = costString.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
  };

  // Helper function to check if cost falls within range
  const costInRange = (cost: string, range: string): boolean => {
    const formattedCost = formatCost(cost);
    if (formattedCost === 'Contact for Price') {
      return range === 'All' || range === 'Contact for Price';
    }
    
    const numericCost = getNumericCost(formattedCost);
    
    switch (range) {
      case 'Under $10,000':
        return numericCost > 0 && numericCost < 10000;
      case '$10,000 - $25,000':
        return numericCost >= 10000 && numericCost <= 25000;
      case '$25,000 - $50,000':
        return numericCost >= 25000 && numericCost <= 50000;
      case '$50,000 - $75,000':
        return numericCost >= 50000 && numericCost <= 75000;
      case 'Above $75,000':
        return numericCost > 75000;
      case 'Contact for Price':
        return formattedCost === 'Contact for Price';
      default:
        return true;
    }
  };

  // Fetch courses based on selected country
  const fetchCourses = async () => {
    const countryName = getCountryForAPI(state?.selectedCountry);
    
    if (!countryName) {
      setError('No country selected. Please go back and select a country.');
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://meta.oxyloans.com/api/student-service/student/getCountryBasedData',
        { countryName: countryName },
        createAuthConfig()
      );

      await new Promise(resolve => setTimeout(resolve, 800));

      const apiResponse: ApiResponse = response.data;
      setCourses(apiResponse.data || []);
      setFilteredCourses(apiResponse.data || []);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      
      if (handleAuthError(err, navigate)) {
        return;
      }
      
      if (err.response?.status === 404) {
        setError(`No programs found for ${getCountryName(state?.selectedCountry)}. Try selecting a different country.`);
      } else if (err.response?.status === 500) {
        setError('Our servers are experiencing issues. Please try again in a few moments.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Connection failed. Please check your internet and try again.');
      } else {
        setError('Unable to load programs. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Updated function to fetch universities based on selected course
  const fetchUniversities = async (course: Course) => {
    if (!course?.courseName) {
      console.error('No course selected');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      return;
    }

    // Show loading state while fetching universities
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center border border-purple-300';
    loadingToast.innerHTML = `
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
      <span class="font-medium">🔍 Finding universities for you...</span>
    `;
    document.body.appendChild(loadingToast);

    try {
      // Updated API call using the new endpoint structure
      const response = await axios.get(
        `https://meta.oxyloans.com/api/student-service/student/${encodeURIComponent(course.courseName)}/getCoursesBasedUniversities`,
        createAuthConfig()
      );
      
      const universityResponse: UniversityApiResponse = response.data;
      
      const cleanedUniversities = universityResponse.universities?.map(university => ({
        universityName: university.universityName,
        country: university.country,
        address: university.address,
        universityLink: university.universityLink,
        universityId: university.universityId,
        countryId: university.countryId,
        universityCampusCity: university.universityCampusCity,
        universityLogo: university.universityLogo
      })) || [];
      
      // Remove loading toast
      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }
      
      // Show user-friendly success message
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 border border-green-300';
      const universityCount = universityResponse.totalUniversities || cleanedUniversities.length;
      const universityText = universityCount === 1 ? 'university' : 'universities';
      successToast.innerHTML = `
        <div class="flex items-center">
          <span class="text-lg mr-2">🎓</span>
          <span class="font-medium">Great! Found ${universityCount} amazing ${universityText}</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => {
        if (successToast.parentNode) {
          document.body.removeChild(successToast);
        }
      }, 3000);
      
      // Navigate to university list page with the cleaned universities data
      navigate('/listofuniversities', { 
        state: { 
          course,
          selectedCountry: getCountryName(state?.selectedCountry),
          universities: cleanedUniversities,
          totalUniversities: universityResponse.totalUniversities || cleanedUniversities.length,
          programName: getFieldOfStudy(course.courseName)
        } 
      });
      
    } catch (err: any) {
      console.error('Error fetching universities:', err);
      
      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }
      
      if (handleAuthError(err, navigate)) {
        return;
      }
      
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 border border-red-300';
      
      let errorMessage = 'Oops! We couldn\'t load the universities right now.';
      let errorDetails = 'Please try again in a moment.';
      
      if (err.response?.status === 404) {
        errorMessage = 'No universities found';
        errorDetails = 'This program might not be available at any universities yet.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server is taking a break';
        errorDetails = 'Our servers are busy. Please try again in a few minutes.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Connection issue';
        errorDetails = 'Please check your internet connection and try again.';
      }
      
      errorToast.innerHTML = `
        <div>
          <div class="flex items-center mb-1">
            <span class="text-lg mr-2">⚠️</span>
            <span class="font-bold">${errorMessage}</span>
          </div>
          <div class="text-sm opacity-90">${errorDetails}</div>
        </div>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => {
        if (errorToast.parentNode) {
          document.body.removeChild(errorToast);
        }
      }, 5000);
      
      navigate('/listofuniversities', { 
        state: { 
          course,
          selectedCountry: getCountryName(state?.selectedCountry),
          universityError: `${errorMessage}: ${errorDetails}`,
          universities: [],
          totalUniversities: 0,
          programName: getFieldOfStudy(course.courseName)
        } 
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [state?.selectedCountry]);

  useEffect(() => {
    let filtered = courses.filter(course => {
      // Search filter
      const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.university.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Degree type filter
      const courseType = course.courseName.match(/\[(.*?)\]/) ? course.courseName.match(/\[(.*?)\]/)![1] : 'Other';
      const matchesDegree = selectedDegree === 'All' || courseType === selectedDegree;
      
      // Duration filter
      const matchesDuration = selectedDuration === 'All' || course.duration === selectedDuration;
      
      // University filter
      const matchesUniversity = selectedUniversity === 'All' || course.university === selectedUniversity;
      
      // Cost range filter
      const matchesCostRange = selectedCostRange === 'All' || costInRange(course.cost, selectedCostRange);
      
      return matchesSearch && matchesDegree && matchesDuration && matchesUniversity && matchesCostRange;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.courseName.localeCompare(b.courseName);
        case 'cost':
          return getNumericCost(formatCost(a.cost)) - getNumericCost(formatCost(b.cost));
        case 'duration':
          const durationA = parseFloat((a.duration || '0').replace(/[^\d.]/g, ''));
          const durationB = parseFloat((b.duration || '0').replace(/[^\d.]/g, ''));
          return durationA - durationB;
        case 'university':
          return a.university.localeCompare(b.university);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, selectedDegree, selectedDuration, selectedUniversity, selectedCostRange, courses, sortBy]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCourseSelect = (course: Course) => {
    if (onCourseSelect) {
      onCourseSelect(course);
    } else {
      fetchUniversities(course);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDegree('All');
    setSelectedDuration('All');
    setSelectedUniversity('All');
    setSelectedCostRange('All');
    setSortBy('name');
  };

  const formatExamRequirements = (exams: string) => {
    if (!exams) return [];
    return exams.split('|').filter(exam => exam.trim());
  };

  const getDegreeType = (courseName: string) => {
    const match = courseName.match(/\[(.*?)\]/);
    return match ? match[1] : '';
  };

  const getFieldOfStudy = (courseName: string) => {
    return courseName.replace(/\[.*?\]/, '').trim();
  };

  const handleRetry = () => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login', { state: { message: 'Please log in to continue.' } });
      return;
    }
    fetchCourses();
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl animate-pulse">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              Discovering Your Future
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Finding premium educational opportunities in<br />
              <span className="font-bold text-purple-700 block mt-2 text-xl">
                {getCountryName(state?.selectedCountry)}
              </span>
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex space-x-1 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Skeleton Header */}
          <div className="mb-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 mr-3"></div>
              <div className="space-y-2">
                <div className="h-8 bg-purple-100 rounded w-80"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {/* Search skeleton - 2 columns */}
              <div className="md:col-span-2 h-10 bg-gray-200 rounded-lg"></div>
              {/* Filter skeletons - 1 column each */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Skeleton Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-80 animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 bg-purple-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="h-16 bg-gray-100 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-auto pt-4">
                    <div className="h-8 bg-purple-100 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-xl">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border-2 border-red-100 mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleRetry}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-medium flex items-center justify-center shadow-md"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <button 
                onClick={handleBackClick}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Simplified Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBackClick}
              className="flex items-center group mr-4"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-purple-200 group-hover:border-purple-400 group-hover:shadow-lg transition-all duration-300">
                <ArrowLeft size={18} className="text-purple-600 group-hover:text-purple-800 transition-colors" />
              </div>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Study Programs in <span className="bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">{getCountryName(state?.selectedCountry)}</span>
              </h1>
              <div className="flex items-center mt-2 text-sm">
                <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-600 font-medium">
                  {filteredCourses.length} of {courses.length} programs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Single Row Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search programs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                >
                  <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Degree Filter */}
            <select 
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="All">All Degrees</option>
              {degreeTypes.slice(1).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Duration Filter */}
            <select 
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="All">Duration</option>
              {durations.slice(1).map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>

            {/* University Filter */}
            <select 
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="All">Universities</option>
              {universities.slice(1).map(university => (
                <option key={university} value={university}>
                  {university.length > 25 ? `${university.substring(0, 25)}...` : university}
                </option>
              ))}
            </select>

            {/* Cost Filter */}
            <select 
              value={selectedCostRange}
              onChange={(e) => setSelectedCostRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="All">Price Range</option>
              {costRanges.slice(1).map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>

            {/* Sort and Clear */}
            <div className="flex gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'cost' | 'duration' | 'university')}
                className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="name">Name</option>
                <option value="cost">Cost</option>
                <option value="duration">Duration</option>
                <option value="university">University</option>
              </select>
              
              <button 
                onClick={clearFilters}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center flex-shrink-0"
                title="Clear all filters"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Improved Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => (
              <div 
                key={`${course.university}-${course.courseName}-${index}`} 
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-purple-300"
                onClick={() => handleCourseSelect(course)}
              >
                {/* Course Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 flex-1 leading-tight">
                      {getFieldOfStudy(course.courseName)}
                    </h3>
                    {getDegreeType(course.courseName) && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {getDegreeType(course.courseName)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3 text-xs">
                    <University className="mr-1 h-3 w-3 text-purple-500 flex-shrink-0" />
                    <span className="truncate">{course.university || 'Unknown University'}</span>
                  </div>
                </div>

                {/* Key Points - Simplified Grid */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-xs text-gray-600">Duration</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{course.duration || 'Not specified'}</span>
                  </div>

                  {/* <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-xs text-gray-600">Cost</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{formatCost(course.cost)}</span>
                  </div> */}

                  {course.intake && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-xs text-gray-600">Next Intake</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{course.intake}</span>
                    </div>
                  )}
                </div>

                {/* Exam Requirements - Simplified */}
                {course.typesOfExams && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Award className="h-3 w-3 mr-1 text-orange-500" />
                      <span className="text-xs font-medium text-gray-700">Required Exams</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formatExamRequirements(course.typesOfExams).slice(0, 2).map((exam, examIndex) => (
                        <span 
                          key={examIndex}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                        >
                          {exam.trim()}
                        </span>
                      ))}
                      {formatExamRequirements(course.typesOfExams).length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{formatExamRequirements(course.typesOfExams).length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2.5 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center text-sm group-hover:shadow-md">
                  <span>View Universities</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-md mx-auto">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Programs Found</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Try adjusting your filters to find more opportunities.
              </p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;