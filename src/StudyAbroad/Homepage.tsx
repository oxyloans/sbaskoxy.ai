import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowLeft, CheckCircle, ChevronDown, Globe, Search, X, Loader2, MapPin, Flag } from 'lucide-react';
import axios from 'axios';
import Student1 from "../assets/img/page1.png"; // Character illustration
import mapbw from "../assets/img/mapbw.png"; // Map background

interface Country {
  countryName: string;
  countryCode?: string;
  // Add other properties if needed
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

const UserSelectionPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'student' | 'counselor' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCountrySelection, setShowCountrySelection] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setAuthRequired(true);
      // Optionally redirect to login immediately
      // navigate('/login');
    }
  }, [navigate]);

  // Fetch countries from API with authentication
  const fetchCountries = async () => {
    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      setAuthRequired(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        'https://meta.oxyloans.com/api/student-service/student/getAll-countries',
        createAuthConfig()
      );
      
      const countriesData = response.data.countries || [];
      const sortedCountries = [...countriesData].sort((a: Country, b: Country) => 
        a.countryName.localeCompare(b.countryName)
      );
      setCountries(sortedCountries);
      setFilteredCountries(sortedCountries);
      setAuthRequired(false);
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      
      // Handle authentication errors
      if (handleAuthError(error, navigate)) {
        return;
      }
      
      // Handle other errors
      if (error.response?.status === 404) {
        setError('Countries data not found.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load countries. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = countries.filter(country => 
      country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  const handleStudentClick = () => {
    const token = getAccessToken();
    if (!token) {
      setError('Please log in to continue as a student.');
      setAuthRequired(true);
      // Optionally redirect to login
      // navigate('/login');
      return;
    }

    setUserRole('student');
    fetchCountries();
    // Delay showing country selection for smooth transition
    setTimeout(() => {
      setShowCountrySelection(true);
    }, 300);
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setSearchQuery('');
    setIsCountryDropdownOpen(false);
  };

  const handleContinue = () => {
    if (selectedCountry) {
      const token = getAccessToken();
      if (!token) {
        setError('Authentication expired. Please log in again.');
        setAuthRequired(true);
        return;
      }

      navigate('/course', { 
        state: { 
          userRole, 
          selectedCountry 
        } 
      });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRetry = () => {
    const token = getAccessToken();
    if (!token) {
      setError('Please log in to continue.');
      setAuthRequired(true);
      return;
    }
    fetchCountries();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show authentication required message
  if (authRequired) {
    return (
      <div className="min-h-screen bg-white p-6 font-sans">
        <div className="w-full max-w-6xl mx-auto h-screen max-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 rounded-3xl relative overflow-hidden shadow-2xl">
          <div 
            className="absolute inset-0 opacity-15 bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage: `url(${mapbw})`,
            }}
          />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 border-2 border-yellow-300 mb-4">
                  <GraduationCap className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Authentication Required</h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Please log in to access study abroad opportunities and explore premium programs.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={handleLogin}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-medium shadow-md"
                  >
                    Log In to Continue
                  </button>
                  <button 
                    onClick={() => setAuthRequired(false)}
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm text-sm"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Main rounded container with white border effect */}
      <div className="w-full max-w-6xl mx-auto h-screen max-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 rounded-3xl relative overflow-hidden shadow-2xl">
        
        {/* Background world map overlay */}
        <div 
          className="absolute inset-0 opacity-15 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${mapbw})`,
          }}
        />

        {/* Main content container */}
        <div className="relative z-10 h-full flex items-center">
          
          {/* Left side - Character illustration - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/2 h-full relative">
            <div className="absolute bottom-0 left-8 xl:left-16 w-80 xl:w-96 h-full flex items-end">
              <img 
                src={Student1}
                alt="Student Character" 
                className="w-full h-auto max-h-full object-contain object-bottom"
                style={{ maxHeight: '85%' }}
              />
            </div>
          </div>

          {/* Right side - Modal content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-8 xl:px-16">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Modal content */}
              <div className="p-8">
                
                {!userRole ? (
                  <div className="space-y-6">
                    {/* Purple header with yellow accent */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full shadow-lg mb-6">
                        <span className="text-base font-medium">
                          Welcome to <span className="text-yellow-300 font-semibold">Study Abroad</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <h2 className="text-xl font-medium text-gray-700">You are...</h2>
                    </div>
                    
                    {/* Student Option */}
                    <div className="space-y-4">
                      <button
                        onClick={handleStudentClick}
                        className="w-full bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-2xl p-4 transition-all duration-300 flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-3 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                            <GraduationCap size={20} className="text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-800 text-base">Student</div>
                            <div className="text-sm text-gray-500">Explore study abroad opportunities</div>
                          </div>
                        </div>
                        <ChevronDown size={16} className="text-gray-400 transform rotate-270 group-hover:text-purple-500 transition-colors" />
                      </button>
                      
                      {/* Counselor Option */}
                      <button
                        onClick={() => setUserRole('counselor')}
                        className="w-full bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-2xl p-4 transition-all duration-300 flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-3 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                            <Users size={20} className="text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-800 text-base">Counselor</div>
                            <div className="text-sm text-gray-500">Guide students to success</div>
                          </div>
                        </div>
                        <ChevronDown size={16} className="text-gray-400 transform rotate-270 group-hover:text-purple-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                ) : userRole === 'student' && showCountrySelection ? (
                  <div>
                    {/* Back Button */}
                    <div className="flex items-center mb-6">
                      <button 
                        onClick={() => {
                          setUserRole(null);
                          setShowCountrySelection(false);
                          setSelectedCountry('');
                          setSearchQuery('');
                          setError(null);
                        }} 
                        className="flex items-center group text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <div className="h-8 w-8 bg-gray-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mr-3 transition-all duration-300">
                          <ArrowLeft size={14} className="text-gray-600 group-hover:text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">Back</span>
                      </button>
                    </div>
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">What's your dream destination? 🌍</h2>
                      <p className="text-gray-600 text-sm">Select the country where you want to study</p>
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                        <button 
                          onClick={handleRetry}
                          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                    
                    {/* Selected Country Display */}
                    {selectedCountry && (
                      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center">
                          <Flag size={16} className="text-purple-600 mr-2" />
                          <span className="text-purple-700 font-medium">{selectedCountry}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Loading State */}
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500 mb-4" />
                        <p className="text-gray-500 text-sm">Loading countries...</p>
                      </div>
                    ) : (
                      <>
                        {/* Search All Countries */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <Search size={14} className="mr-2" />
                            All Countries
                          </h3>
                          
                          {/* Search Input */}
                          <div className="relative mb-3">
                            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search for a country..."
                              className="w-full pl-9 pr-9 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            {searchQuery && (
                              <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1"
                              >
                                <X size={12} className="text-gray-400" />
                              </button>
                            )}
                          </div>
                          
                          {/* Countries List */}
                          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <div
                                  key={country.countryName}
                                  onClick={() => handleCountrySelect(country.countryName)}
                                  onMouseEnter={() => setHoveredCountry(country.countryName)}
                                  onMouseLeave={() => setHoveredCountry('')}
                                  className={`px-4 py-3 flex items-center cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0 ${
                                    selectedCountry === country.countryName 
                                      ? 'bg-purple-100 text-purple-700' 
                                      : hoveredCountry === country.countryName
                                        ? 'bg-purple-50'
                                        : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center flex-1">
                                    <div className={`w-2 h-2 rounded-full mr-3 ${
                                      selectedCountry === country.countryName ? 'bg-purple-500' : 'bg-gray-300'
                                    }`}></div>
                                    <span className="text-sm">
                                      {country.countryName}
                                    </span>
                                  </div>
                                  {selectedCountry === country.countryName && (
                                    <CheckCircle size={14} className="text-purple-600" />
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-center">
                                <Globe className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-xs">
                                  {countries.length === 0 ? 'No countries available' : 'No countries found'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Continue Button */}
                    <button 
                      onClick={handleContinue}
                      disabled={!selectedCountry || loading}
                      className={`w-full rounded-xl py-3 font-medium text-sm transition-all duration-300 ${
                        selectedCountry && !loading
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </div>
                      ) : selectedCountry ? (
                        'Continue Your Journey →'
                      ) : (
                        'Select a Country First'
                      )}
                    </button>
                  </div>
                ) : userRole === 'student' && !showCountrySelection ? (
                  // Loading transition for student
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                        <Globe className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" size={24} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">Preparing your destination selection...</p>
                  </div>
                ) : (
                  // Counselor Thank You Page
                  <div className="text-center py-6">
                    <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Thank You! 🎉</h2>
                    <p className="text-gray-600 text-sm mb-6">We'll notify you when our counselor portal launches.</p>
                    <button 
                      onClick={() => setUserRole(null)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm"
                    >
                      ← Return Home
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionPage;