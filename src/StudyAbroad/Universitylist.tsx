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
  Crown,
  ChevronLeft,
  RotateCcw,
  Eye,
  GitCompare,
  BookmarkPlus,
  FilterX
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Country API Response Interface
interface CountryResponse {
  countries: Array<{
    countryName: string;
    id: string;
    countryCode: string;
    name: string;
  }>;
  totalCountries: number;
}

// Updated Course Interface based on actual API response
interface Course {
  courseName: string;
  duration: string;
  cost: string | null;
  typesOfExams: string | null;
  intake: string;
  university: string;
  degree: string;
  tutionFee1styr: string | null;
  applicationFee: string;
  courseUrl: string;
  intake2: string | null;
  intake3: string | null;
  universityCampusCity: string;
  address: string;
}

interface CoursesApiResponse {
  data: Course[];
  count: number;
}

interface LocationState {
  course?: Course;
  selectedCountry?: string;
}

interface SearchFilters {
  university?: string;
  degree?: string;
  duration?: string;
  courseName?: string;
}

// Updated country options based on API data
const COUNTRY_OPTIONS = [
  { code: 'USA', name: 'United States', flag: '🇺🇸' },
  { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
  { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'GER', name: 'Germany', flag: '🇩🇪' },
  { code: 'FRA', name: 'France', flag: '🇫🇷' },
  { code: 'NLD', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SWE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NOR', name: 'Norway', flag: '🇳🇴' },
  { code: 'IRL', name: 'Ireland', flag: '🇮🇪' }
];

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
  console.log('Creating auth config with token:', token ? 'Token found' : 'No token');
  
  if (!token) {
    throw new Error('No authorization token found');
  }
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
};

// Utility function to handle auth errors
const handleAuthError = (error: any, navigate: any) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.log('Authentication error detected, clearing tokens and redirecting to login');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    navigate('/login', { 
      state: { 
        message: 'Session expired. Please log in again.',
        from: window.location.pathname 
      } 
    });
    return true;
  }
  return false;
};

const UniversityListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<string>(state?.selectedCountry || 'USA');
  
  // Dynamic filter options from API data
  const [availableCountries, setAvailableCountries] = useState<{code: string, name: string, flag: string}[]>([]);
  const [availableDegrees, setAvailableDegrees] = useState<string[]>([]);
  const [availableDurations, setAvailableDurations] = useState<string[]>([]);
  const [availableUniversities, setAvailableUniversities] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 30;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;
  
  // Filters
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // Selection and comparison
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get country info with flag
  const getCountryInfo = (countryName: string) => {
    const countryMapping: { [key: string]: { name: string, flag: string } } = {
      'USA': { name: 'United States', flag: '🇺🇸' },
      'United States': { name: 'United States', flag: '🇺🇸' },
      'CAN': { name: 'Canada', flag: '🇨🇦' },
      'Canada': { name: 'Canada', flag: '🇨🇦' },
      'AU': { name: 'Australia', flag: '🇦🇺' },
      'Australia': { name: 'Australia', flag: '🇦🇺' },
      'UK': { name: 'United Kingdom', flag: '🇬🇧' },
      'United Kingdom': { name: 'United Kingdom', flag: '🇬🇧' },
      'GERMANY': { name: 'Germany', flag: '🇩🇪' },
      'Germany': { name: 'Germany', flag: '🇩🇪' },
      'IRL': { name: 'Ireland', flag: '🇮🇪' },
      'Ireland': { name: 'Ireland', flag: '🇮🇪' },
      'France': { name: 'France', flag: '🇫🇷' },
      'Netherlands': { name: 'Netherlands', flag: '🇳🇱' },
      'Sweden': { name: 'Sweden', flag: '🇸🇪' },
      'Norway': { name: 'Norway', flag: '🇳🇴' }
    };
    
    const mapping = countryMapping[countryName];
    return {
      name: mapping ? mapping.name : countryName,
      flag: mapping ? mapping.flag : '🌍'
    };
  };

  // Extract filter options from courses data
  const extractFilterOptions = (coursesData: Course[]) => {
    try {
      // Extract unique countries from API data
      const countrySet = new Set<string>();
      
      coursesData.forEach(course => {
        // Extract country from address field (last part after comma)
        const address = course.address || '';
        const parts = address.split(',').map(part => part.trim());
        const country = parts[parts.length - 1];
        
        if (country) {
          countrySet.add(country);
        }
      });
      
      const countries = Array.from(countrySet).map(countryName => {
        const countryInfo = getCountryInfo(countryName);
        return {
          code: countryName, // Use the actual country name from API as code
          name: countryInfo.name,
          flag: countryInfo.flag
        };
      });
      
      // Remove duplicates based on name and sort
      const uniqueCountries = countries.filter((country, index, self) => 
        index === self.findIndex(c => c.name === country.name)
      );
      
      setAvailableCountries(uniqueCountries.sort((a, b) => a.name.localeCompare(b.name)));

      // Extract unique degrees
      const degreeSet = new Set(coursesData.map(course => course.degree).filter(Boolean));
      const degrees = Array.from(degreeSet);
      setAvailableDegrees(degrees.sort());

      // Extract unique durations
      const durationSet = new Set(coursesData.map(course => course.duration).filter(Boolean));
      const durations = Array.from(durationSet);
      setAvailableDurations(durations.sort());

      // Extract unique universities (limit to prevent dropdown overflow)
      const universitySet = new Set(coursesData.map(course => course.university).filter(Boolean));
      const universities = Array.from(universitySet);
      setAvailableUniversities(universities.sort().slice(0, 100)); // Limit to 100 universities

      console.log('Extracted filter options:', {
        countries: uniqueCountries.map(c => `${c.name} (${c.code})`),
        degrees: degrees.length,
        durations: durations.length,
        universities: universities.length
      });
    } catch (error) {
      console.error('Error extracting filter options:', error);
    }
  };

  // Fetch countries from dedicated API
  const fetchCountriesFromAPI = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.log('No token available for fetching countries');
        return;
      }

      console.log('Fetching countries from dedicated API...');

      const response = await axios.get(
        'https://meta.oxyloans.com/api/student-service/student/getAll-countries',
        createAuthConfig()
      );

      console.log('Countries API Response:', response.data);

      const countryData: CountryResponse = response.data;
      
      if (countryData.countries && Array.isArray(countryData.countries)) {
        const formattedCountries = countryData.countries.map(country => {
          const countryInfo = getCountryInfo(country.countryName);
          return {
            code: country.countryName, // Use countryName as the API expects it
            name: country.name, // Display name
            flag: countryInfo.flag
          };
        });

        setAvailableCountries(formattedCountries.sort((a, b) => a.name.localeCompare(b.name)));
        console.log('Countries loaded successfully:', formattedCountries);
      } else {
        throw new Error('Invalid countries API response format');
      }
    } catch (error: any) {
      console.error('Error fetching countries from API:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Fallback to default countries based on known API structure
      setAvailableCountries([
        { code: 'USA', name: 'United States', flag: '🇺🇸' },
        { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'GERMANY', name: 'Germany', flag: '🇩🇪' },
        { code: 'IRL', name: 'Ireland', flag: '🇮🇪' }
      ]);
    }
  };
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      setInitialLoad(false);
      return;
    }
  }, [navigate]);

  // Fixed fetchCourses function with proper API handling
  const fetchCourses = async (pageIndex: number = 0, searchFilters: SearchFilters = filters) => {
    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      setInitialLoad(false);
      // Redirect to login if no token
      navigate('/login', { state: { message: 'Please log in to access this page.' } });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare request body according to API specification
      const requestBody = {
        countryName: currentCountry,
        ...(searchFilters.university && { university: searchFilters.university }),
        ...(searchFilters.degree && { degree: searchFilters.degree }),
        ...(searchFilters.duration && { duration: searchFilters.duration }),
        ...(searchFilters.courseName && { courseName: searchFilters.courseName })
      };

      // Convert 0-based pageIndex to 1-based for API (Swagger shows default pageIndex = 1)
      const apiPageIndex = pageIndex + 1;

      console.log('Making API request:', {
        url: `https://meta.oxyloans.com/api/student-service/student/getCountryBasedData?pageIndex=${apiPageIndex}&pageSize=${pageSize}`,
        method: 'POST',
        headers: createAuthConfig().headers,
        body: requestBody
      });

      const response = await axios.post(
        `https://meta.oxyloans.com/api/student-service/student/getCountryBasedData?pageIndex=${apiPageIndex}&pageSize=${pageSize}`,
        requestBody,
        createAuthConfig()
      );

      console.log('API Response received:', {
        status: response.status,
        data: response.data,
        dataLength: response.data?.data?.length || 0,
        count: response.data?.count || 0
      });
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const apiResponse: CoursesApiResponse = response.data;
      const coursesData = apiResponse.data || [];
      
      if (!Array.isArray(coursesData)) {
        throw new Error('Invalid response format: courses data is not an array');
      }
      
      setCourses(coursesData);
      setTotalCount(apiResponse.count || 0);
      setCurrentPage(pageIndex); // Keep using 0-based indexing in component
      
      // Extract filter options from the fetched data
      if (coursesData.length > 0) {
        extractFilterOptions(coursesData);
      }

      console.log('State updated successfully:', {
        coursesCount: coursesData.length,
        totalCount: apiResponse.count,
        currentPage: pageIndex
      });

    } catch (err: any) {
      console.error('Error fetching courses:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      
      if (handleAuthError(err, navigate)) {
        return;
      }
      
      let errorMessage = 'Failed to fetch courses. ';
      
      if (err.response?.status === 400) {
        errorMessage = 'Invalid request parameters. Please check your filters and try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'No courses found for the selected criteria.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = 'Network connection error. Please check your internet connection.';
      } else if (err.message.includes('No authorization token')) {
        errorMessage = 'Authentication required. Please log in again.';
        navigate('/login', { state: { message: 'Please log in to continue.' } });
        return;
      } else {
        errorMessage += err.response?.data?.message || err.message || 'Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Debug function to test countries and API
  const testCountryAPI = async (countryName?: string) => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No token available for test');
        return;
      }

      if (countryName) {
        // Test specific country
        console.log(`Testing API with country: "${countryName}"`);
        
        try {
          const response = await axios.post(
            'https://meta.oxyloans.com/api/student-service/student/getCountryBasedData?pageIndex=1&pageSize=5',
            { countryName: countryName },
            createAuthConfig()
          );
          
          console.log(`✅ SUCCESS for ${countryName}:`, {
            dataCount: response.data?.data?.length || 0,
            totalCount: response.data?.count || 0,
            sampleData: response.data?.data?.slice(0, 2) || []
          });
        } catch (error: any) {
          console.error(`❌ FAILED for ${countryName}:`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
          });
        }
      } else {
        // Test countries API and then test each country
        console.log('=== TESTING COUNTRIES API ===');
        await fetchCountriesFromAPI();
        
        console.log('=== TESTING EACH COUNTRY ===');
        const testCountries = ['USA', 'CAN', 'AU', 'UK', 'GERMANY', 'IRL'];
        
        for (const country of testCountries) {
          await testCountryAPI(country);
        }
      }
    } catch (error: any) {
      console.error('Test failed:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    // Fetch courses on component mount
    fetchCourses(0, filters);
  }, [currentCountry]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    console.log('Filter changed:', { old: filters, new: updatedFilters });
    setFilters(updatedFilters);
    setCurrentPage(0);
    fetchCourses(0, updatedFilters);
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      handleFilterChange({ courseName: searchTerm.trim() });
    } else {
      const { courseName, ...restFilters } = filters;
      setFilters(restFilters);
      fetchCourses(0, restFilters);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchCourses(newPage, filters);
    }
  };

  // Show toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle course selection for comparison
  const handleCourseSelect = (course: Course) => {
    const courseKey = `${course.courseName}-${course.university}`;
    const newSelected = new Set(selectedCourses);
    
    if (newSelected.has(courseKey)) {
      newSelected.delete(courseKey);
      setSelectedCourses(newSelected);
      
      // Auto-close comparison if less than 2 courses
      if (newSelected.size < 2 && showComparison) {
        setShowComparison(false);
        showToastNotification('Comparison closed: Need at least 2 courses to compare');
      }
    } else {
      if (newSelected.size < 3) {
        newSelected.add(courseKey);
        setSelectedCourses(newSelected);
      } else {
        showToastNotification('You can compare up to 3 courses at a time. Please remove a course first.');
        return;
      }
    }
  };

  // Get selected course objects for comparison
  const getSelectedCourses = (): Course[] => {
    return courses.filter(course => 
      selectedCourses.has(`${course.courseName}-${course.university}`)
    );
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters = {};
    setFilters(newFilters);
    setSearchTerm('');
    setCurrentPage(0);
    fetchCourses(0, newFilters);
  };

  // Handle external link
  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Extract degree type from course name
  const getDegreeType = (courseName: string) => {
    const match = courseName.match(/^([^-]+)/);
    return match ? match[1].trim() : '';
  };

  // Extract field of study from course name
  const getFieldOfStudy = (courseName: string) => {
    const parts = courseName.split(' - ');
    return parts.length > 1 ? parts.slice(1).join(' - ') : courseName;
  };

  // Handle retry
  const handleRetry = () => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login', { state: { message: 'Please log in to continue.' } });
      return;
    }
    fetchCourses(currentPage, filters);
  };

  // Render intake badges
  const renderIntakeBadges = (course: Course) => {
    const intakes = [course.intake, course.intake2, course.intake3].filter(Boolean);
    
    return (
      <div className="flex flex-wrap gap-1">
        {intakes.map((intake, index) => (
          <span 
            key={index}
            className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${
              index === 0 
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' 
                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
            }`}
          >
            {intake}
          </span>
        ))}
      </div>
    );
  };

  // Comparison Modal Component
  const ComparisonModal = () => {
    const selectedCoursesData = getSelectedCourses();
    
    if (!showComparison) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <GitCompare className="mr-3 h-6 w-6 text-purple-600" />
                Course Comparison
              </h2>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {selectedCoursesData.length === 0 ? (
              <div className="text-center py-8">
                <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Courses Selected</h3>
                <p className="text-gray-500">Select 2-3 courses to compare them side by side.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700 border border-gray-300">Attribute</th>
                      {selectedCoursesData.map((course, index) => (
                        <th key={index} className="text-left p-4 font-semibold text-gray-700 border border-gray-300 min-w-64">
                          <div className="space-y-2">
                            <div className="font-bold text-purple-700 text-sm line-clamp-2">
                              {getFieldOfStudy(course.courseName)}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">
                              {course.university}
                            </div>
                            <div className="text-xs text-gray-500">
                              {course.universityCampusCity}, {course.address}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">University</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300">
                          <div className="space-y-1">
                            <div className="font-bold text-purple-800 text-sm">{course.university}</div>
                            <div className="text-xs text-gray-600">{course.universityCampusCity}</div>
                            <div className="text-xs text-gray-500">{course.address}</div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">Degree Type</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                            {course.degree}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">Duration</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300 font-semibold text-gray-800">
                          {course.duration}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">Application Fee</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300 font-semibold text-green-700">
                          {course.applicationFee}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">Tuition Fee (1st Year)</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300 font-semibold text-green-700">
                          {course.tutionFee1styr || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">All Intakes</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300">
                          {renderIntakeBadges(course)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border border-gray-300 bg-gray-50">Actions</td>
                      {selectedCoursesData.map((course, index) => (
                        <td key={index} className="p-4 border border-gray-300">
                          <div className="space-y-2">
                            <button
                              onClick={(e) => handleExternalLink(course.courseUrl, e)}
                              className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center text-xs font-bold"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              View Course
                            </button>
                            <button
                              onClick={() => {
                                const newSelected = new Set(selectedCourses);
                                const courseKey = `${course.courseName}-${course.university}`;
                                newSelected.delete(courseKey);
                                setSelectedCourses(newSelected);
                                
                                // Auto-close comparison if less than 2 courses
                                if (newSelected.size < 2) {
                                  setShowComparison(false);
                                  showToastNotification('Comparison closed: Need at least 2 courses to compare');
                                }
                              }}
                              className="w-full px-3 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-all duration-300 flex items-center justify-center text-xs font-bold"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced loading screen
  if (initialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-xl animate-pulse">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-bounce shadow-md">
                <Search className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Loading Study Programs
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Fetching the latest courses and universities<br />
              <span className="font-bold text-purple-700 block mt-1">
                for your study abroad journey
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

  // Error state
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
                onClick={handleRetry}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-medium flex items-center justify-center shadow-md text-sm"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm text-sm"
              >
                Go Back
              </button>
              <button 
                onClick={() => testCountryAPI()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-md text-sm"
              >
                Test APIs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get current country info for header
  const currentCountryInfo = getCountryInfo(currentCountry);

  // Main render
  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Updated Header with Dynamic Country */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center group mr-4"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-purple-200 group-hover:border-purple-400 group-hover:shadow-md transition-all duration-300">
                <ArrowLeft size={16} className="text-purple-600 group-hover:text-purple-800 transition-colors" />
              </div>
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                Study Abroad Programs in 
                <span className="bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent ml-2">
                  {currentCountryInfo.flag} {currentCountryInfo.name}
                </span>
              </h1>
              <div className="flex items-center mt-2 text-sm">
                <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-gray-600 font-medium">
                  {totalCount.toLocaleString()} programs available
                </span>
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-xs font-medium border border-purple-300">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters - Single Row Layout (Without Country Filter) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          {/* Search and Filters in Single Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-purple-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search courses, universities..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full pl-10 pr-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-sm placeholder-gray-400 font-medium"
              />
            </div>

            {/* Filters (Removed Country Filter) */}
            <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
              {/* Degree Filter */}
              <select 
                value={filters.degree || ''}
                onChange={(e) => handleFilterChange({ degree: e.target.value || undefined })}
                className="px-3 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-sm bg-white font-medium text-purple-800 min-w-[120px]"
              >
                <option value="">All Degrees</option>
                {availableDegrees.map(degree => (
                  <option key={degree} value={degree}>{degree}</option>
                ))}
              </select>

              {/* Duration Filter */}
              <select 
                value={filters.duration || ''}
                onChange={(e) => handleFilterChange({ duration: e.target.value || undefined })}
                className="px-3 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-sm bg-white font-medium text-purple-800 min-w-[120px]"
              >
                <option value="">All Duration</option>
                {availableDurations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>

              {/* University Filter */}
              <select 
                value={filters.university || ''}
                onChange={(e) => handleFilterChange({ university: e.target.value || undefined })}
                className="px-3 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-sm bg-white font-medium text-purple-800 min-w-[140px]"
              >
                <option value="">All Universities</option>
                {availableUniversities.slice(0, 50).map(university => (
                  <option key={university} value={university}>
                    {university.length > 25 ? `${university.substring(0, 25)}...` : university}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-sm font-bold flex items-center shadow-md flex-1 lg:flex-none justify-center"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </button>
              
              <button 
                onClick={clearFilters}
                className="px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border border-gray-300 text-sm font-bold flex items-center shadow-sm"
              >
                <FilterX className="mr-2 h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Results Summary & View Mode & Center Pagination */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pt-4 mt-4 border-t border-gray-200 gap-3">
            {/* Left: Results Summary */}
            <div>
              <p className="text-sm font-bold text-gray-800 flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                {courses.length} of {totalCount.toLocaleString()} universities
              </p>
              {selectedCourses.size > 0 && (
                <p className="text-xs text-purple-600 font-bold mt-1">
                  {selectedCourses.size} selected for comparison
                </p>
              )}
            </div>
            
            {/* Center: Enhanced Pagination (only show if more than 1 page) */}
            {!loading && courses.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-2 py-1 text-xs font-bold border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                
                {/* Enhanced Page Numbers - Show 5 pages */}
                <div className="flex gap-1">
                  {(() => {
                    const pages = [];
                    let start, end;
                    
                    if (totalPages <= 5) {
                      // If total pages <= 5, show all
                      start = 0;
                      end = totalPages - 1;
                    } else {
                      // Show 5 pages centered around current page
                      start = Math.max(0, currentPage - 2);
                      end = Math.min(totalPages - 1, start + 4);
                      
                      // Adjust start if we're near the end
                      if (end - start < 4) {
                        start = Math.max(0, end - 4);
                      }
                    }
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-2 py-1 text-xs font-bold rounded transition-all duration-300 min-w-[2rem] ${
                            i === currentPage
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>
                
                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-2 py-1 text-xs font-bold border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
                
                {/* Page Info */}
                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                  {currentPage + 1} of {totalPages}
                </span>
              </div>
            )}
            
            {/* Right: View Mode & Compare Button */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-purple-50 border border-purple-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-2 text-xs font-bold rounded-md transition-all duration-300 flex items-center ${
                    viewMode === 'card'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-xs font-bold rounded-md transition-all duration-300 flex items-center ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </button>
              </div>

              {/* Compare Button - Show only if 2 or more courses */}
              {selectedCourses.size >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 text-sm font-bold flex items-center shadow-md"
                >
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare ({selectedCourses.size})
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 h-80 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
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
        )}

        {/* Courses Grid/List */}
        {!loading && courses.length > 0 && (
          <div className={
            viewMode === 'card' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
              : "space-y-4"
          }>
            {courses.map((course, index) => {
              const isSelected = selectedCourses.has(`${course.courseName}-${course.university}`);
              // Get country from course address since we removed country filter
              const courseCountry = course.address ? course.address.split(',').pop()?.trim() : '';
              const selectedCountry = availableCountries.find(c => 
                c.name.toLowerCase() === courseCountry?.toLowerCase() || 
                c.code.toLowerCase() === courseCountry?.toLowerCase()
              ) || { flag: '🌍', name: courseCountry || 'Unknown' };
              
              if (viewMode === 'list') {
                return (
                  <div 
                    key={`${course.courseName}-${course.university}-${index}`}
                    className={`bg-white border rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg ring-2 ring-purple-200' 
                        : 'border-gray-300 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 mb-3 lg:mb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800 mr-3 line-clamp-2 mb-2">
                              {getFieldOfStudy(course.courseName)}
                            </h3>
                            <div className="mb-2">
                              <p className="text-sm text-purple-800 font-bold">{course.university}</p>
                              <p className="text-xs text-gray-600 font-medium">{course.universityCampusCity}</p>
                              <p className="text-xs text-gray-500">{course.address}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold rounded-full shadow-sm">
                                {selectedCountry?.flag} {selectedCountry?.name}
                              </span>
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-bold rounded-full shadow-sm">
                                {course.degree}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center ml-3 shadow-md">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                          <div className="flex items-center text-xs text-gray-700 font-medium">
                            <Clock className="h-3 w-3 text-purple-600 mr-2 flex-shrink-0" />
                            <span>Duration: {course.duration}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-700 font-medium">
                            <DollarSign className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                            <span>Fee: {course.applicationFee}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-700 font-medium">
                            <Calendar className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                            <span>Intakes: {[course.intake, course.intake2, course.intake3].filter(Boolean).length}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-700 font-medium">
                            <Crown className="h-3 w-3 text-yellow-600 mr-2 flex-shrink-0" />
                            <span>1st Year: {course.tutionFee1styr || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {/* Show all intakes */}
                        <div className="mt-3">
                          <p className="text-xs font-bold text-gray-700 mb-1">Available Intakes:</p>
                          {renderIntakeBadges(course)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 lg:flex-col lg:gap-2">
                        <button
                          onClick={(e) => handleExternalLink(course.courseUrl, e)}
                          className="px-3 py-2 bg-white text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 flex items-center text-xs font-bold shadow-sm"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View Course
                        </button>
                        <button
                          onClick={() => handleCourseSelect(course)}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 font-bold text-xs whitespace-nowrap shadow-md ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700'
                              : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700'
                          }`}
                        >
                          {isSelected ? 'Remove' : 'Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Card view
              return (
                <div 
                  key={`${course.courseName}-${course.university}-${index}`}
                  className={`bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col ${
                    isSelected 
                      ? 'border-purple-400 ring-2 ring-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-white' 
                      : 'border-gray-300 hover:border-purple-400 hover:shadow-lg'
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  {/* Card Header */}
                  <div className="p-3 pb-2">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                          {getFieldOfStudy(course.courseName)}
                        </h3>
                        <div className="mb-2">
                          <p className="text-xs text-purple-800 font-bold line-clamp-1">{course.university}</p>
                          <p className="text-xs text-gray-600 font-medium line-clamp-1">{course.universityCampusCity}</p>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{course.address}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold rounded-full shadow-sm">
                            {selectedCountry?.flag} {selectedCountry?.name}
                          </span>
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-bold rounded-full shadow-sm">
                            {course.degree}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 ml-2">
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
                      <div className="flex items-start p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 font-bold mb-0.5">DURATION</p>
                          <p className="font-bold text-gray-800 text-xs">{course.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-start p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                          <DollarSign className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-700 font-bold mb-0.5">APP FEE</p>
                          <p className="font-bold text-gray-800 text-xs">{course.applicationFee}</p>
                        </div>
                      </div>

                      <div className="flex items-start p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                          <Calendar className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-blue-700 font-bold mb-0.5">INTAKES</p>
                          <div className="mt-1">
                            {renderIntakeBadges(course)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 pt-2 mt-auto">
                    <div className="space-y-2">
                      <button 
                        onClick={(e) => handleExternalLink(course.courseUrl, e)}
                        className="w-full bg-white text-purple-700 border border-purple-300 py-2 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-sm"
                      >
                        <Globe className="mr-1 h-3 w-3" />
                        View Course
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </button>
                      
                      <button 
                        onClick={() => handleCourseSelect(course)}
                        className={`w-full py-2 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-md hover:shadow-lg ${
                          isSelected
                            ? 'bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700'
                            : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700'
                        }`}
                      >
                        <GitCompare className="mr-1 h-3 w-3" />
                        {isSelected ? 'Remove' : 'Compare'}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Programs Found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                No study programs match your current filters. Try adjusting your search criteria.
              </p>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-bold flex items-center justify-center shadow-md text-sm"
                  >
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear Filters
                  </button>
                  <button 
                    onClick={() => navigate(-1)}
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

        {/* Pagination - Bottom */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="text-sm text-gray-600">
              Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount.toLocaleString()} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              
              <div className="flex gap-1">
                {(() => {
                  const startPage = Math.max(0, currentPage - 2);
                  const endPage = Math.min(totalPages - 1, startPage + 4);
                  const adjustedStartPage = Math.max(0, endPage - 4);
                  
                  const pages = [];
                  for (let i = adjustedStartPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  
                  return pages.map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                        pageNum === currentPage
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ));
                })()}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Selection Summary */}
        {selectedCourses.size > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 px-4 w-full max-w-xs">
            <div className="bg-white border border-purple-300 rounded-xl shadow-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800 flex items-center">
                    <GitCompare className="h-3 w-3 text-purple-500 mr-1" />
                    {selectedCourses.size} Selected
                  </p>
                  <p className="text-xs text-purple-600 font-medium">
                    {selectedCourses.size >= 2 ? 'Ready to compare' : 'Select 1 more to compare'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourses(new Set());
                      if (showComparison) {
                        setShowComparison(false);
                        showToastNotification('Comparison cleared');
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-md hover:border-gray-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {selectedCourses.size >= 2 && (
                    <button 
                      onClick={() => setShowComparison(true)}
                      className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-xs font-bold shadow-md"
                    >
                      Compare
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      <ComparisonModal />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white border-l-4 border-orange-500 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {toastMessage}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowToast(false)}
                    className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityListPage;