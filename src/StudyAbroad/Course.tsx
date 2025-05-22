import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ArrowLeft, Star, Globe, Briefcase, Clock, DollarSign, GraduationCap, Loader2, AlertCircle, Filter, X, Calendar, Award, BookOpen, MapPin, University, Crown, SlidersHorizontal } from 'lucide-react';
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

// University Interface based on API response
interface UniversityData {
  university: string;
  location: string;
  worldRanking: string;
  countryRanking: string;
  description: string;
}

interface UniversityApiResponse {
  universities: UniversityData[];
  count: number;
}

interface ApiResponse {
  data: Course[];
  count: number;
}

interface LocationState {
  selectedCountry?: string;
  userRole?: string;
}

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'duration'>('name');

  // Extract unique degree types and durations
  const degreeTypes = ['All', ...Array.from(new Set(courses.map(course => {
    const match = course.courseName.match(/\[(.*?)\]/);
    return match ? match[1] : 'Other';
  })))];

  const durations = ['All', ...Array.from(new Set(courses.map(course => course.duration)))];

  // Fetch courses based on selected country
  const fetchCourses = async () => {
    if (!state?.selectedCountry) {
      setError('No country selected');
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://65.0.147.157:9001/api/student-service/student/getCountryBasedData',
        { countryName: state.selectedCountry }
      );

      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      const apiResponse: ApiResponse = response.data;
      setCourses(apiResponse.data || []);
      setFilteredCourses(apiResponse.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // New function to fetch universities based on selected course
  const fetchUniversities = async (course: Course) => {
    if (!course?.courseName) {
      console.error('No course selected');
      return;
    }
    console.log("course", course.courseName);

    try {
      const response = await axios.get(
        `http://65.0.147.157:9001/api/student-service/student/${encodeURIComponent(course.courseName)}/getCoursesBasedUniversities`,
        {} // Empty body since we're sending the course name as part of the URL
      );
      
      // Process the university data
      const universityResponse: UniversityApiResponse = response.data;
      
      // Navigate to university list page with the fetched universities
      navigate('/listofuniversities', { 
        state: { 
          course,
          selectedCountry: state?.selectedCountry,
          universities: universityResponse.universities || []
        } 
      });
      
    } catch (err) {
      console.error('Error fetching universities:', err);
      // Still navigate but without university data - the university page will handle the error
      navigate('/listofuniversities', { 
        state: { 
          course,
          selectedCountry: state?.selectedCountry,
          universityError: 'Failed to fetch universities. Please try again.'
        } 
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [state?.selectedCountry]);

  // Filter and sort courses
  useEffect(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.university.toLowerCase().includes(searchTerm.toLowerCase());
      
      const courseType = course.courseName.match(/\[(.*?)\]/) ? course.courseName.match(/\[(.*?)\]/)![1] : 'Other';
      const matchesDegree = selectedDegree === 'All' || courseType === selectedDegree;
      
      const matchesDuration = selectedDuration === 'All' || course.duration === selectedDuration;
      
      return matchesSearch && matchesDegree && matchesDuration;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.courseName.localeCompare(b.courseName);
        case 'cost':
          const costA = parseFloat(a.cost.replace(/[^\d.]/g, ''));
          const costB = parseFloat(b.cost.replace(/[^\d.]/g, ''));
          return costA - costB;
        case 'duration':
          const durationA = parseFloat(a.duration.replace(/[^\d.]/g, ''));
          const durationB = parseFloat(b.duration.replace(/[^\d.]/g, ''));
          return durationA - durationB;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, selectedDegree, selectedDuration, courses, sortBy]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCourseSelect = (course: Course) => {
    if (onCourseSelect) {
      onCourseSelect(course);
    } else {
      // Instead of directly navigating, fetch universities first
      fetchUniversities(course);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDegree('All');
    setSelectedDuration('All');
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

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-xl animate-pulse">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Loading Elite Programs
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Discovering premium educational opportunities in<br />
              <span className="font-bold text-purple-700 block mt-1">
                {state?.selectedCountry || 'your selected destination'}
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

  if (loading) {
    return (
      <div className=" bg-white">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Skeleton Header */}
          <div className="mb-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 mr-3"></div>
              <div className="space-y-2">
                <div className="h-6 bg-purple-100 rounded w-64"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Search and Filters */}
          <div className="bg-white border border-purple-100 rounded-xl shadow-md p-4 mb-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg mb-3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Skeleton Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 h-64 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="h-12 bg-gray-100 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-auto pt-3">
                    <div className="h-6 bg-purple-100 rounded-md"></div>
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
                onClick={fetchCourses}
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
  
  return (
    <div className=" bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
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
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                Elite Programs in <span className="bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">{state?.selectedCountry}</span>
              </h1>
              <div className="flex items-center mt-2 text-sm">
                <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-gray-600 font-medium">
                  {courses.length} premium programs from leading universities
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-purple-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search elite courses, universities, or programs..." 
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

          {/* Filter Toggle for Mobile */}
          <div className="md:hidden mb-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg flex items-center justify-center hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 border border-yellow-300 font-bold text-xs"
            >
              <SlidersHorizontal className="mr-1 h-3 w-3" />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'} 
            </button>
          </div>

          {/* Filters */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-3`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Degree Type</label>
                <select 
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs shadow-sm font-medium text-purple-800"
                >
                  {degreeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs shadow-sm font-medium text-purple-800"
                >
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'cost' | 'duration')}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-xs shadow-sm font-medium text-purple-800"
                >
                  <option value="name">Course Name</option>
                  <option value="cost">Cost (Low to High)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={clearFilters}
                  className="w-full px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center border border-gray-300 shadow-sm text-xs font-bold"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <p className="text-sm font-bold text-gray-800 flex items-center">
                <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                {filteredCourses.length} Premium Programs
              </p>
              {filteredCourses.length > 0 && (
                <p className="text-xs text-gray-500">
                  Sorted by: <span className="font-bold text-gray-700 capitalize">{sortBy}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
            {filteredCourses.map((course, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-300 rounded-xl p-4 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col hover:border-purple-400"
                onClick={() => handleCourseSelect(course)}
              >
                {/* Course Header */}
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 flex-1">
                      {getFieldOfStudy(course.courseName)}
                    </h3>
                    {getDegreeType(course.courseName) && (
                      <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold rounded-full shadow-sm">
                        {getDegreeType(course.courseName)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <University className="mr-1 h-3 w-3 text-purple-500" />
                    <span className="text-xs font-medium truncate">{course.university}</span>
                  </div>
                </div>

                {/* Course Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <Clock className="h-3 w-3 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-600 font-bold mb-0.5">DURATION</p>
                    <p className="font-bold text-gray-800 text-xs">{course.duration}</p>
                  </div>

                  <div className="text-center p-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <DollarSign className="h-3 w-3 text-yellow-600 mx-auto mb-1" />
                    <p className="text-xs text-yellow-600 font-bold mb-0.5">COST</p>
                    <p className="font-bold text-gray-800 text-xs">{course.cost}</p>
                  </div>

                  {course.intake && (
                    <div className="text-center p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 col-span-2">
                      <Calendar className="h-3 w-3 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600 font-bold mb-0.5">NEXT INTAKE</p>
                      <p className="font-bold text-gray-800 text-xs">{course.intake}</p>
                    </div>
                  )}
                </div>

                {/* Exam Requirements */}
                {course.typesOfExams && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Required Exams</h4>
                    <div className="flex flex-wrap gap-1">
                      {formatExamRequirements(course.typesOfExams).slice(0, 3).map((exam, examIndex) => (
                        <span 
                          key={examIndex}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200"
                        >
                          {exam.trim()}
                        </span>
                      ))}
                      {formatExamRequirements(course.typesOfExams).length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-200">
                          +{formatExamRequirements(course.typesOfExams).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button - Always at bottom */}
                <div className="mt-auto pt-3">
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-md">
                    <Crown className="mr-1 h-3 w-3" />
                    Explore Elite Universities
                    <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 border-2 border-purple-300 mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Programs Found</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                No programs match your search criteria. Try adjusting your filters to discover more opportunities.
              </p>
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-bold text-sm shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;