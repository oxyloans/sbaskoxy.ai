import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowLeft, CheckCircle, ChevronDown, Globe, Search, X, Loader2, MapPin, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Country {
  countryName: string;
  // Add other properties if needed
}

const UserSelectionPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'student' | 'counselor' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch countries from API
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://65.0.147.157:9001/api/student-service/student/getAll-countries');
      // Extract countries from the nested response
      const countriesData = response.data.countries || [];
      // Sort countries alphabetically
      const sortedCountries = [...countriesData].sort((a: Country, b: Country) => 
        a.countryName.localeCompare(b.countryName)
      );
      setCountries(sortedCountries);
      setFilteredCountries(sortedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load countries when component mounts
  useEffect(() => {
    fetchCountries();
  }, []);
  
  // Filter countries based on search query
  useEffect(() => {
    const filtered = countries.filter(country => 
      country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  const handleContinue = () => {
    if (selectedCountry) {
      navigate('/course', { 
        state: { 
          userRole, 
          selectedCountry 
        } 
      });
    }
  };

  // Close dropdown when clicking outside
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-lg w-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 relative">
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl opacity-20 animate-gradient-x"></div>
        <div className="relative bg-white rounded-3xl m-0.5">
          
          <div className="px-8 pt-10 pb-8">
            {/* Header with enhanced animation */}
            <div className="text-center mb-8 ">
              <div className="relative inline-block mb-6">
                <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mx-auto relative">
                  <Globe className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20"></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                Study Abroad
              </h1>
              <p className="text-gray-600 text-lg font-medium">Your journey begins here ✨</p>
            </div>
            
            {!userRole ? (
              <div className="space-y-5 animate-slideUp">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">I am a...</h2>
                
                <button
                  onClick={() => setUserRole('student')}
                  className="w-full group bg-gradient-to-r from-white to-gray-50 hover:from-purple-500 hover:to-blue-500 text-gray-800 hover:text-white rounded-2xl p-6 transition-all duration-500 flex items-center justify-between border-2 border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 group-hover:from-white group-hover:to-white p-4 rounded-2xl mr-5 transition-all duration-300">
                      <GraduationCap size={28} className="text-purple-600 group-hover:text-purple-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-xl block">Student</span>
                      <span className="text-sm text-gray-500 group-hover:text-purple-100">Explore study abroad opportunities</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-gray-200 group-hover:border-white group-hover:bg-white flex items-center justify-center transform group-hover:rotate-90 transition-all duration-300">
                    <ChevronDown size={20} className="text-gray-400 group-hover:text-purple-600 transform rotate-270" />
                  </div>
                </button>
                
                <button
                  onClick={() => setUserRole('counselor')}
                  className="w-full group bg-gradient-to-r from-white to-gray-50 hover:from-purple-500 hover:to-blue-500 text-gray-800 hover:text-white rounded-2xl p-6 transition-all duration-500 flex items-center justify-between border-2 border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 group-hover:from-white group-hover:to-white p-4 rounded-2xl mr-5 transition-all duration-300">
                      <Users size={28} className="text-purple-600 group-hover:text-purple-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-xl block">Counselor</span>
                      <span className="text-sm text-gray-500 group-hover:text-purple-100">Guide students to success</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-gray-200 group-hover:border-white group-hover:bg-white flex items-center justify-center transform group-hover:rotate-90 transition-all duration-300">
                    <ChevronDown size={20} className="text-gray-400 group-hover:text-purple-600 transform rotate-270" />
                  </div>
                </button>
              </div>
            ) : userRole === 'student' ? (
              <div className="animate-slideUp">
                <div className="flex items-center mb-10">
                  <button 
                    onClick={() => setUserRole(null)} 
                    className="flex items-center group"
                  >
                    <div className="h-10 w-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mr-4 transform group-hover:-translate-x-1 transition-all duration-300 group-hover:shadow-lg">
                      <ArrowLeft size={20} className="text-purple-600" />
                    </div>
                    <span className="text-gray-500 group-hover:text-purple-600 transition-colors">Back</span>
                  </button>
                </div>
                
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">What's your dream destination? 🌍</h2>
                  <p className="text-gray-600">Select the country where you want to study</p>
                </div>
                
                <div className="mb-8 relative" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className={`flex items-center justify-between px-6 py-4 border-2 ${
                      selectedCountry 
                        ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50' 
                        : 'border-gray-200 bg-white'
                    } rounded-2xl cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-4 transition-all duration-300 ${
                        selectedCountry 
                          ? 'bg-purple-100' 
                          : 'bg-gray-100 group-hover:bg-purple-50'
                      }`}>
                        <MapPin size={22} className={`${
                          selectedCountry ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'
                        }`} />
                      </div>
                      <span className={`text-lg ${
                        selectedCountry 
                          ? 'text-purple-700 font-semibold' 
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                        {selectedCountry || 'Select your country'}
                      </span>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-gray-400 group-hover:text-purple-500 transform transition-all duration-300 ${
                        isCountryDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 max-h-80 overflow-hidden animate-slideDown backdrop-blur-lg">
                      <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b border-gray-100">
                        <div className="relative">
                          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search countries..."
                            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-300"
                          />
                          {searchQuery && (
                            <button 
                              onClick={() => setSearchQuery('')}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                            >
                              <X size={16} className="text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="overflow-y-auto max-h-60">
                        {loading ? (
                          <div className="px-6 py-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500 mb-3" />
                            <p className="text-gray-500">Loading countries...</p>
                          </div>
                        ) : filteredCountries.length > 0 ? (
                          filteredCountries.map((country, index) => (
                            <div
                              key={country.countryName}
                              onClick={() => {
                                setSelectedCountry(country.countryName);
                                setIsCountryDropdownOpen(false);
                                setSearchQuery('');
                              }}
                              className={`px-6 py-4 flex items-center cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 ${
                                selectedCountry === country.countryName 
                                  ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700' 
                                  : ''
                              }`}
                              style={{ animationDelay: `${index * 0.02}s` }}
                            >
                              <div className="flex items-center flex-1">
                                <div className={`w-2 h-2 rounded-full mr-4 ${
                                  selectedCountry === country.countryName ? 'bg-purple-500' : 'bg-gray-300'
                                }`}></div>
                                <span className={`text-lg ${
                                  selectedCountry === country.countryName ? 'font-semibold' : 'font-medium'
                                }`}>
                                  {country.countryName}
                                </span>
                              </div>
                              {selectedCountry === country.countryName && (
                                <CheckCircle size={20} className="text-purple-600 animate-bounce" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-6 py-8 text-center">
                            <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg">No countries found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleContinue}
                  disabled={!selectedCountry}
                  className={`w-full rounded-2xl py-5 font-semibold text-lg transition-all duration-500 ${
                    selectedCountry 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedCountry ? 'Continue Your Journey →' : 'Select a Country First'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 animate-slideUp">
                <div className="relative">
                  <div className="h-24 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle size={48} className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You! 🎉</h2>
                <p className="text-gray-600 text-lg mb-10">We'll notify you when our counselor portal launches.</p>
                <button 
                  onClick={() => setUserRole(null)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 font-semibold"
                >
                  ← Return Home
                </button>
              </div>
            )}
          </div>
          
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center font-medium">
              © 2025 ASKOXY.AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionPage;