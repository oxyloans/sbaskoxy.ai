import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Image,
  GraduationCap,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Globe,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Info,
  Loader2
} from 'lucide-react';

// University Interface
interface UniversityDetails {
  name: string;
  campus: string;
  program: string;
  programCode: string;
  location: string;
  tags: string[];
  photos: string[];
  programSummary: string;
  programHighlights: string[];
  programDetails: {
    programLevel: string;
    programLength: string;
  };
  financialInfo: {
    costOfLiving: string;
    grossTuition: string;
    applicationFee: string;
    otherFees: string;
  };
  admissionRequirements: {
    minimumEducation: string;
    minimumGPA: string;
    languageTests: {
      [key: string]: string;
    };
  };
  programIntakes: string[];
  postGraduationWorkPermit: {
    eligible: boolean;
    details: string;
  };
  similarPrograms: {
    name: string;
    college: string;
    earliestIntake: string;
    deadline: string;
    grossTuition: string;
    applicationFee: string;
    commission: string;
  }[];
}

// API Configuration
const BASE_URL = 'https://meta.oxyloans.com/api';

// API Service
const apiService = {
  async getUniversityBasedCourses(university: string, accessToken: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/student/getUniversityBasedCourses/${encodeURIComponent(university)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching university courses:', error);
      throw error;
    }
  }
};

const UniversityDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'admission' | 'similar'>('overview');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [universityData, setUniversityData] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { university } = useParams<{ university: string }>();

  // Get access token from localStorage, sessionStorage, or context
  const getAccessToken = (): string | null => {
    // You can modify this based on where you store your access token
    return localStorage.getItem('accessToken') || 
           sessionStorage.getItem('accessToken') || 
           null;
  };

  // Fetch university data on component mount
  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!university) {
        setError('University parameter is required');
        setLoading(false);
        return;
      }

      const accessToken = getAccessToken();
      if (!accessToken) {
        setError('Access token not found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getUniversityBasedCourses(university, accessToken);
        
        // Transform API response to match your UniversityDetails interface
        // You'll need to adjust this mapping based on your actual API response structure
        const transformedData: UniversityDetails = transformApiResponse(response);
        
        setUniversityData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch university data');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [university]);

  // Transform API response to match your interface
  const transformApiResponse = (apiResponse: any): UniversityDetails => {
    // Adjust this transformation based on your actual API response structure
    return {
      name: apiResponse.universityName || 'St. Clair College',
      campus: apiResponse.campusName || 'Downtown Campus',
      program: apiResponse.programName || 'College Diploma - Hospitality - Hotel and Restaurant (B940)',
      programCode: apiResponse.programCode || 'B940',
      location: apiResponse.location || 'Windsor, Ontario, CA',
      tags: apiResponse.tags || ['Popular'],
      photos: apiResponse.photos || [
        'campus-exterior-1.jpg',
        'campus-exterior-2.jpg',
        'classroom.jpg',
        'college-sign.jpg'
      ],
      programSummary: apiResponse.programSummary || 'Program summary from API',
      programHighlights: apiResponse.programHighlights || [],
      programDetails: {
        programLevel: apiResponse.programLevel || '2-Year Undergraduate Diploma',
        programLength: apiResponse.programLength || '2 year college diploma including an internship'
      },
      financialInfo: {
        costOfLiving: apiResponse.costOfLiving || '$20,635.00 CAD / Year',
        grossTuition: apiResponse.grossTuition || '$20,726.00 CAD / First Year',
        applicationFee: apiResponse.applicationFee || '$125.00 CAD',
        otherFees: apiResponse.otherFees || '$2,098.00 CAD / Year'
      },
      admissionRequirements: {
        minimumEducation: apiResponse.minimumEducation || 'Grade 12 / High School',
        minimumGPA: apiResponse.minimumGPA || '50.0%',
        languageTests: apiResponse.languageTests || {
          IELTS: '6.0',
          TOEFL: '83.0',
          PTE: '60.0',
          Duolingo: '110'
        }
      },
      programIntakes: apiResponse.programIntakes || ['May 2026', 'Sep 2026', 'Jan 2027'],
      postGraduationWorkPermit: {
        eligible: apiResponse.workPermitEligible || false,
        details: apiResponse.workPermitDetails || 'Work permit information'
      },
      similarPrograms: apiResponse.similarPrograms || []
    };
  };

  const navigatePhoto = (direction: 'next' | 'prev') => {
    if (selectedPhoto === null || !universityData) return;
    
    if (direction === 'next') {
      setSelectedPhoto((selectedPhoto + 1) % universityData.photos.length);
    } else {
      setSelectedPhoto(selectedPhoto === 0 ? universityData.photos.length - 1 : selectedPhoto - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedPhoto === null) return;
    
    if (e.key === 'ArrowRight') {
      navigatePhoto('next');
    } else if (e.key === 'ArrowLeft') {
      navigatePhoto('prev');
    } else if (e.key === 'Escape') {
      setSelectedPhoto(null);
    }
  };

  const handleStartApplication = () => {
    navigate('/studentdetails');
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading university details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!universityData) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No university data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white min-h-screen">
      <div className="container px-4 lg:px-8 max-w-6xl mx-auto">
        {/* Back Button and Breadcrumb */}
        <div className="py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center group transition-all"
          >
            <div className="bg-purple-600 text-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft size={18} />
            </div>
          </button>
          <h3 className="text-xl mt-2 font-semibold text-gray-800">Universities List</h3>
        </div>

        {/* University Header */}
        <div className="py-4 md:py-6">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-6"></div>
            <div className="p-4 md:p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <div className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 flex items-center text-sm font-medium">
                      <MapPin className="mr-1" size={16} />
                      {universityData.location}
                    </div>
                    {universityData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <Star className="mr-1" size={16} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {universityData.program}
                  </h4>
                  <div className="flex items-center">
                    <div className="p-1 bg-purple-100 rounded-full mr-3">
                      <GraduationCap className="text-purple-600" size={20} />
                    </div>
                    <span className="text-lg text-gray-700">{universityData.name} - {universityData.campus}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={handleStartApplication}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group flex items-center justify-center space-x-2"
                  >
                    <FileText size={20} />
                    <span>Start Application</span>
                    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image and Gallery */}
        <div className="mb-8 md:mb-12">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 aspect-video rounded-xl overflow-hidden shadow-lg relative group">
              <img
                src={`/api/placeholder/800/450`}
                alt="Featured campus view"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-4 text-white">
                  <p className="font-semibold">Campus Main Building</p>
                  <p className="text-sm">{universityData.name}, {universityData.location}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Small Photo Gallery */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {universityData.photos.slice(0, 4).map((photo, index) => (
              <div
                key={index}
                className="aspect-video rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all relative group"
                onClick={() => setSelectedPhoto(index)}
              >
                <img
                  src={`/api/placeholder/200/112`}
                  alt={`Campus photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 overflow-hidden">
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Program Overview', icon: Globe },
              { id: 'admission', label: 'Admission Info', icon: GraduationCap },
              { id: 'similar', label: 'Similar Programs', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 px-6 py-5 font-semibold flex items-center justify-center space-x-2
                  ${activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:bg-gray-50'}
                  transition-all duration-300 relative
                `}
              >
                <tab.icon size={20} />
                <span className="hidden md:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-purple-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">Program Summary</h2>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {universityData.programSummary}
                  </p>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-purple-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-800">Program Highlights</h3>
                  </div>
                  <ul className="space-y-3">
                    {universityData.programHighlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-gray-700 hover:bg-purple-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="bg-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                          <Check className="text-purple-600" size={16} />
                        </div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl overflow-hidden">
                    <div className="bg-purple-600 py-2 px-4">
                      <h3 className="text-lg font-semibold text-white">Program Details</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <GraduationCap className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <span className="text-gray-600 block">Program Level</span>
                          <span className="font-semibold text-gray-800">
                            {universityData.programDetails.programLevel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          <Calendar className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <span className="text-gray-600 block">Program Length</span>
                          <span className="font-semibold text-gray-800">
                            {universityData.programDetails.programLength}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl overflow-hidden">
                    <div className="bg-green-600 py-2 px-4">
                      <h3 className="text-lg font-semibold text-white">Financial Overview</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        {
                          icon: DollarSign,
                          label: 'Cost of Living',
                          value: universityData.financialInfo.costOfLiving
                        },
                        {
                          icon: DollarSign,
                          label: 'Gross Tuition',
                          value: universityData.financialInfo.grossTuition
                        },
                        {
                          icon: DollarSign,
                          label: 'Application Fee',
                          value: universityData.financialInfo.applicationFee
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="bg-white p-3 rounded-full shadow-sm">
                            <item.icon className="text-green-600" size={24} />
                          </div>
                          <div>
                            <span className="text-gray-600 block">{item.label}</span>
                            <span className="font-semibold text-gray-800">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admission' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-6">
                    <div className="bg-gray-700 py-2 px-4">
                      <h2 className="text-lg font-semibold text-white">Academic Requirements</h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-gray-600 mb-2 block font-medium">
                          Minimum Education Level
                        </label>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500 flex items-center">
                          <GraduationCap className="text-purple-600 mr-3" size={20} />
                          {universityData.admissionRequirements.minimumEducation}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-600 mb-2 block font-medium">
                          Minimum GPA
                        </label>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500 flex items-center">
                          <Star className="text-purple-600 mr-3" size={20} />
                          {universityData.admissionRequirements.minimumGPA}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl overflow-hidden">
                    <div className="bg-purple-600 py-2 px-4">
                      <h2 className="text-lg font-semibold text-white">Language Test Requirements</h2>
                    </div>
                    <div className="p-6 space-y-3">
                      {Object.entries(universityData.admissionRequirements.languageTests).map(([test, score]) => (
                        <div
                          key={test}
                          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:bg-purple-50 transition-colors"
                        >
                          <span className="text-gray-700 font-medium flex items-center">
                            <Globe className="mr-2 text-purple-600" size={18} />
                            {test}
                          </span>
                          <span className="font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                            {score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl overflow-hidden mb-6">
                    <div className="bg-purple-600 py-2 px-4">
                      <h2 className="text-lg font-semibold text-white">Program Intakes</h2>
                    </div>
                    <div className="p-6 space-y-3">
                      {universityData.programIntakes.map((intake, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:bg-purple-50 transition-colors"
                        >
                          <span className="font-medium flex items-center">
                            <Calendar className="mr-2 text-purple-600" size={18} />
                            {intake}
                          </span>
                          <span className="text-purple-600 text-sm font-semibold bg-purple-100 px-3 py-1 rounded-full">
                            Likely Open
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`bg-gradient-to-r ${universityData.postGraduationWorkPermit.eligible ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} rounded-xl overflow-hidden`}>
                    <div className={`${universityData.postGraduationWorkPermit.eligible ? 'bg-green-600' : 'bg-red-600'} py-2 px-4`}>
                      <h2 className="text-lg font-semibold text-white">Post Graduation Work Permit</h2>
                    </div>
                    <div className="p-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-full ${universityData.postGraduationWorkPermit.eligible ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                            {universityData.postGraduationWorkPermit.eligible ? (
                              <Check className="text-green-600" size={20} />
                            ) : (
                              <X className="text-red-600" size={20} />
                            )}
                          </div>
                          <p className={`font-semibold text-lg ${universityData.postGraduationWorkPermit.eligible
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {universityData.postGraduationWorkPermit.eligible
                              ? 'Eligible'
                              : 'NOT Eligible'}
                          </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {universityData.postGraduationWorkPermit.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'similar' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Similar Programs</h2>
                </div>
                
                {universityData.similarPrograms.map((program, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {program.name}
                      </h3>
                      <p className="text-gray-600 mb-3 flex items-center">
                        <GraduationCap className="mr-2 text-purple-600" size={18} />
                        {program.college}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-purple-50 px-3 py-2 rounded-lg">
                          <span className="text-xs text-gray-500 block">
                            Earliest Intake
                          </span>
                          <p className="font-medium text-gray-700 flex items-center">
                            <Calendar className="mr-1 text-purple-600" size={16} />
                            {program.earliestIntake}
                          </p>
                        </div>
                        <div className="bg-green-50 px-3 py-2 rounded-lg">
                          <span className="text-xs text-gray-500 block">
                            Gross Tuition
                          </span>
                          <p className="font-medium text-gray-700 flex items-center">
                            <DollarSign className="mr-1 text-green-600" size={16} />
                            {program.grossTuition}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleStartApplication}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group flex items-center justify-center space-x-2"
                    >
                      <FileText size={20} />
                      <span>Apply Now</span>
                      <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Photo Modal (if a photo is selected) */}
        {selectedPhoto !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="max-w-5xl max-h-[90vh] relative">
              <img
                src={`/api/placeholder/1000/600`}
                alt={`Campus photo ${selectedPhoto + 1}`}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <button
                className="absolute top-4 right-4 bg-white bg-opacity-25 hover:bg-opacity-50 rounded-full p-2 text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
              >
                <X size={24} />
              </button>
              
              {/* Navigation arrows */}
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 hover:bg-opacity-50 rounded-full p-3 text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 hover:bg-opacity-50 rounded-full p-3 text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
              >
                <ChevronRight size={28} />
              </button>
              
              {/* Photo counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-4 py-2 text-white text-sm">
                {selectedPhoto + 1} / {universityData.photos.length}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UniversityDetailsPage;