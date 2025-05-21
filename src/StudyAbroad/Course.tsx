import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ArrowLeft, Star, Globe, Briefcase, Clock, DollarSign, GraduationCap, Loader2, AlertCircle, Filter, X, Calendar, Award, BookOpen, MapPin, University } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { log } from 'console';

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
  // Add other university properties as needed
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
        'https://meta.oxyloans.com/api/student-service/student/getCountryBasedData',
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
      `https://meta.oxyloans.com/api/student-service/student/${encodeURIComponent(course.courseName)}/getCoursesBasedUniversities`,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-full w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className="mt-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton Header */}
          <div className="mb-6 animate-pulse">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Skeleton Course Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col space-y-4">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-8 bg-gray-200 rounded-lg mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={fetchCourses}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={handleBackClick}
              className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center mb-2">
            <button 
              onClick={handleBackClick}
              className="flex items-center group mr-4"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 group-hover:bg-gray-50 transition-colors shadow-sm">
                <ArrowLeft size={20} className="text-gray-600 group-hover:text-purple-600 transition-colors" />
              </div>
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Study Programs in <span className="text-purple-600">{state?.selectedCountry}</span>
              </h1>
              <p className="text-gray-600 mt-2">
                {courses.length} programs from leading universities
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-2">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search courses, universities, or programs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="md:hidden mb-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full py-2.5 bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Filter className="mr-2 h-4 w-4" />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'} 
            </button>
          </div>

          {/* Filters */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-4`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree Type</label>
                <select 
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
                >
                  {degreeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
                >
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'cost' | 'duration')}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
                >
                  <option value="name">Course Name</option>
                  <option value="cost">Cost (Low to High)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={clearFilters}
                  className="w-full p-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200 shadow-sm text-sm font-medium"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCourses.length}</span> of <span className="font-semibold">{courses.length}</span> programs
              </p>
              {filteredCourses.length > 0 && (
                <p className="text-sm text-gray-500">
                  Sorted by: <span className="font-medium text-gray-700 capitalize">{sortBy}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 group cursor-pointer h-full flex flex-col"
                onClick={() => handleCourseSelect(course)}
              >
                {/* Course Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 flex-1">
                      {getFieldOfStudy(course.courseName)}
                    </h3>
                    {getDegreeType(course.courseName) && (
                      <span className="ml-3 px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                        {getDegreeType(course.courseName)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <University className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">{course.university}</span>
                  </div>
                </div>

                {/* Course Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Clock className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">{course.duration}</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <DollarSign className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">Annual Cost</p>
                    <p className="font-semibold text-gray-800 text-sm">{course.cost}</p>
                  </div>

                  {course.intake && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100 col-span-2">
                      <Calendar className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 mb-1">Next Intake</p>
                      <p className="font-semibold text-gray-800 text-sm">{course.intake}</p>
                    </div>
                  )}
                </div>

                {/* Exam Requirements */}
                {course.typesOfExams && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Required Exams</h4>
                    <div className="flex flex-wrap gap-2">
                      {formatExamRequirements(course.typesOfExams).slice(0, 4).map((exam, examIndex) => (
                        <span 
                          key={examIndex}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100"
                        >
                          {exam.trim()}
                        </span>
                      ))}
                      {formatExamRequirements(course.typesOfExams).length > 4 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded border border-gray-200">
                          +{formatExamRequirements(course.typesOfExams).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button - Always at bottom */}
                <div className="mt-auto pt-4">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium text-sm shadow-sm">
                    Explore Universities
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No Programs Found</h3>
              <p className="text-gray-600 mb-6 text-sm">
                We couldn't find any programs matching your search criteria. Try adjusting your filters.
              </p>
              <button 
                onClick={clearFilters}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm shadow-sm"
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