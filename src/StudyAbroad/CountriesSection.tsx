import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, BookOpen, Globe, Award, GraduationCap, X } from "lucide-react";

// Type definitions
interface CountryDetails {
  visaInfo: string;
  langRequirements: string;
  avgTuition: string;
  popularPrograms: string[];
  scholarships: string[];
}

interface Country {
  name: string;
  description: string;
  details: CountryDetails;
}

const CountriesSection = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [arrowPosition, setArrowPosition] = useState({ left: 0, top: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  
  const countryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const countries: Country[] = [
    {
      name: "USA",
      description: "Home to Ivy League schools and cutting-edge research institutions",
      details: {
        visaInfo: "F-1 Student Visa required",
        langRequirements: "TOEFL 80+ or IELTS 6.5+",
        avgTuition: "$20,000 - $60,000 per year",
        popularPrograms: ["Business", "Computer Science", "Engineering"],
        scholarships: ["Fulbright Program", "Merit Scholarships"]
      }
    },
    {
      name: "UK",
      description: "Centuries of academic excellence and diverse opportunities",
      details: {
        visaInfo: "Student Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "£12,000 - £35,000 per year",
        popularPrograms: ["Business", "Law", "Arts"],
        scholarships: ["Chevening Scholarships", "Commonwealth Scholarships"]
      }
    },
    {
      name: "Germany",
      description: "Renowned for engineering, tuition-free public universities",
      details: {
        visaInfo: "German Student Visa required",
        langRequirements: "German proficiency or English for international programs",
        avgTuition: "€0 - €3,000 per year (most public universities free)",
        popularPrograms: ["Engineering", "Physics", "Medicine"],
        scholarships: ["DAAD Scholarships", "Erasmus+"]
      }
    },
    {
      name: "Canada",
      description: "Quality education with welcoming immigration policies",
      details: {
        visaInfo: "Study Permit required",
        langRequirements: "IELTS 6.0+ or TOEFL equivalent",
        avgTuition: "CAD $15,000 - $40,000 per year",
        popularPrograms: ["Business", "Healthcare", "Technology"],
        scholarships: ["Vanier Canada Graduate Scholarships"]
      }
    },
    {
      name: "Australia",
      description: "Top-ranked universities with excellent post-study work options",
      details: {
        visaInfo: "Student Visa (subclass 500) required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "AUD $20,000 - $50,000 per year",
        popularPrograms: ["Engineering", "Business", "Medicine"],
        scholarships: ["Australia Awards", "Endeavour Scholarships"]
      }
    },
    {
      name: "France",
      description: "World-class education in arts, sciences, and culinary studies",
      details: {
        visaInfo: "VLS-TS Student Visa required",
        langRequirements: "French or English depending on program",
        avgTuition: "€3,000 - €10,000 per year",
        popularPrograms: ["Business", "Arts", "Culinary"],
        scholarships: ["Eiffel Excellence Scholarship"]
      }
    },
    {
      name: "New Zealand",
      description: "Quality education with breathtaking natural landscapes",
      details: {
        visaInfo: "Student Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "NZ$22,000 - $35,000 per year",
        popularPrograms: ["Agriculture", "Environmental Sciences", "Tourism"],
        scholarships: ["New Zealand Excellence Awards"]
      }
    }
  ];

  const countryFlags: Record<string, JSX.Element> = {
    USA: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">  
          <rect width="100" height="100" fill="#fff" />
          {/* Red stripes */}
          <g>
            <rect width="100" height="7.7" fill="#b22234" />
            <rect y="15.4" width="100" height="7.7" fill="#b22234" />
            <rect y="30.8" width="100" height="7.7" fill="#b22234" />
            <rect y="46.2" width="100" height="7.7" fill="#b22234" />
            <rect y="61.6" width="100" height="7.7" fill="#b22234" />
            <rect y="77" width="100" height="7.7" fill="#b22234" />
            <rect y="92.4" width="100" height="7.7" fill="#b22234" />
          </g>
          <rect width="40" height="53.9" fill="#3c3b6e" />
        </g>
      </svg>
    ),
    UK: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">
          <rect width="100" height="100" fill="#012169" />
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="20" />
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="#c8102e" strokeWidth="10" />
          <path d="M50,0 L50,100 M0,50 L100,50" stroke="#fff" strokeWidth="20" />
          <path d="M50,0 L50,100 M0,50 L100,50" stroke="#c8102e" strokeWidth="10" />
        </g>
      </svg>
    ),
    Germany: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">
          <rect width="100" height="33.3" fill="black" />
          <rect y="33.3" width="100" height="33.3" fill="#FF0000" />
          <rect y="66.6" width="100" height="33.3" fill="#FFCC00" />
        </g>
      </svg>
    ),
    Canada: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">
          <rect width="100" height="100" fill="#FF0000" />
          <rect width="33.3" height="100" fill="#FF0000" />
          <rect x="66.6" width="33.3" height="100" fill="#FF0000" />
          <polygon points="50,20 55,35 70,35 57,45 62,60 50,50 38,60 43,45 30,35 45,35" fill="#FF0000" />
        </g>
      </svg>
    ),
    Australia: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">
          <rect width="100" height="100" fill="#012169" />
          <path d="M0,0 L50,25 L0,50" fill="#012169" />
          <path d="M0,0 L50,25 L0,50" stroke="#fff" strokeWidth="10" />
          <path d="M0,0 L50,25 L0,50" stroke="#CC142B" strokeWidth="5" />
          <g transform="translate(70, 60)">
            <polygon points="0,0 5,15 -13,6 13,6 -5,15" fill="#fff" />
          </g>
          <g transform="translate(85, 30)">
            <polygon points="0,0 3,9 -8,4 8,4 -3,9" fill="#fff" />
          </g>
          <g transform="translate(70, 15)">
            <polygon points="0,0 5,15 -13,6 13,6 -5,15" fill="#fff" />
          </g>
          <g transform="translate(50, 35)">
            <polygon points="0,0 5,15 -13,6 13,6 -5,15" fill="#fff" />
          </g>
        </g>
      </svg>
    ),
    France: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">
          <rect width="33.3" height="100" fill="#002654" />
          <rect x="33.3" width="33.3" height="100" fill="#fff" />
          <rect x="66.6" width="33.3" height="100" fill="#ED2939" />
        </g>
      </svg>
    ),
    "New Zealand": (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
        <g transform="scale(0.8) translate(12, 12)">
          <rect width="100" height="100" fill="#00247D" />
          <path d="M0,0 L50,25 L0,50" fill="#00247D" />
          <path d="M0,0 L50,25 L0,50" stroke="#fff" strokeWidth="10" />
          <path d="M0,0 L50,25 L0,50" stroke="#CC142B" strokeWidth="5" />
          <g transform="translate(70, 60)">
            <polygon points="0,0 5,15 -13,6 13,6 -5,15" fill="#CC142B" />
          </g>
          <g transform="translate(85, 30)">
            <polygon points="0,0 3,9 -8,4 8,4 -3,9" fill="#CC142B" />
          </g>
          <g transform="translate(70, 15)">
            <polygon points="0,0 5,15 -13,6 13,6 -5,15" fill="#CC142B" />
          </g>
          <g transform="translate(50, 35)">
            <polygon points="0,0 5,15 -13,6 13,6 -5,15" fill="#CC142B" />
          </g>
        </g>
      </svg>
    ),
  };

  const handleCountrySelect = (country: Country) => {
    if (activeCountry?.name === country.name && showDetails) {
      setShowDetails(false);
      return;
    }
    
    setActiveCountry(country);
    setSelectedCountry(country.name);
    
    // Calculate arrow position
    const ref = countryRefs.current[country.name];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      const containerRect = ref.parentElement?.getBoundingClientRect();
      if (containerRect) {
        setArrowPosition({
          left: rect.left - containerRect.left + rect.width / 2,
          top: rect.bottom - containerRect.top + 10
        });
      }
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowDetails(true);
    }, 300);
  };

  return (
    <section className="py-4 mb-4">
     <div className="px-4 sm:px-6">
        <div className="border-2 border-yellow-500 rounded-lg p-6 relative bg-white shadow-lg">
          {/* Top Countries Header */}
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            <div className="bg-white px-8 rounded-full border-2 border-yellow-500 shadow-md">
              <h2 className="text-2xl font-bold mb-1.5 mt-1 text-center text-purple-900">Top Countries</h2>
            </div>
          </div>
          
          {/* Country flags row with dynamic arrow */}
          <div className="flex flex-wrap justify-center gap-8 mt-6 mb-16 relative">
            {/* Dynamic arrow that follows the selected country */}
            {selectedCountry && (
              <div 
                className="absolute w-0 h-0 transition-all duration-300 ease-in-out"
                style={{
                  left: `${arrowPosition.left}px`,
                  top: `${arrowPosition.top}px`,
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderBottom: '12px solid #f59e0b',
                  transform: 'translateX(-12px)',
                  zIndex: 20
                }}
              ></div>
            )}
            
            {countries.map((country) => (
              <div 
                key={country.name} 
                ref={el => countryRefs.current[country.name] = el}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedCountry === country.name ? 'scale-110' : 'hover:scale-105'}`} 
                onClick={() => handleCountrySelect(country)}
              >
                <div className={`relative w-24 h-24 rounded-full overflow-hidden shadow-md 
                               ${selectedCountry === country.name 
                                  ? 'border-3 border-yellow-500 shadow-yellow-300 ring-4 ring-yellow-200' 
                                  : 'border-2 border-gray-200 hover:border-purple-200'}`}>
                  {countryFlags[country.name as keyof typeof countryFlags]}
                </div>
                <span className={`mt-3 font-medium ${selectedCountry === country.name ? 'text-purple-700 font-bold' : ''}`}>
                  {country.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Country Details Section with smooth animation */}
          {(showDetails || isAnimating) && activeCountry && (
            <div id="country-details" className={`relative w-full mb-12 transition-all duration-300 ${showDetails ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
              <div className="border-3 border-yellow-500 rounded-lg p-6 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-4 rounded-full overflow-hidden border-2 border-purple-200">
                      {countryFlags[activeCountry.name as keyof typeof countryFlags]}
                    </div>
                    <h3 className="text-2xl font-bold text-purple-900">{activeCountry.name} Study Information</h3>
                  </div>
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="mb-6 text-gray-600 italic border-l-4 border-yellow-500 pl-3">
                  {activeCountry.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Visa Requirements
                    </h4>
                    <p>{activeCountry.details.visaInfo}</p>
                    
                    <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                      <Globe className="w-5 h-5 mr-2" />
                      Language Requirements
                    </h4>
                    <p>{activeCountry.details.langRequirements}</p>
                    
                    <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                      <Award className="w-5 h-5 mr-2" />
                      Average Tuition
                    </h4>
                    <p>{activeCountry.details.avgTuition}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Popular Programs
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {activeCountry.details.popularPrograms.map((program, index) => (
                        <li key={index}>{program}</li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                      <Award className="w-5 h-5 mr-2" />
                      Scholarships
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {activeCountry.details.scholarships.map((scholarship, index) => (
                        <li key={index}>{scholarship}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-2 px-6 rounded-full shadow-md transition duration-300">
                    Explore {activeCountry.name} Universities
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Universities Section with divider */}
          <div className="w-full border-t-2 border-yellow-500 pt-8 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-purple-900">75+ Universities</h3>
                <p className="text-xl flex items-center">
                  <span className="inline-block w-8 h-1 bg-yellow-500 mr-2"></span>
                  600+ Courses Available
                </p>
              </div>
              <button className="bg-white border-2 border-yellow-500 text-purple-800 hover:bg-yellow-50 px-6 py-2 rounded-full shadow-md transition duration-300 font-semibold flex items-center">
                View all universities
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
            
            {/* University Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Card */}
              {[
                {
                  name: "Harvard University",
                  location: "Cambridge, Massachusetts",
                  country: "USA",
                  flagUrl: "/flags/us.png",
                  imageUrl: "/api/placeholder/400/250",
                },
                {
                  name: "University of California, Berkeley",
                  location: "Berkeley, California",
                  country: "USA",
                  flagUrl: "/flags/us.png",
                  imageUrl: "/api/placeholder/400/250",
                },
                {
                  name: "University of Southern California",
                  location: "Los Angeles, California",
                  country: "USA",
                  flagUrl: "/flags/us.png",
                  imageUrl: "/api/placeholder/400/250",
                },
              ].map((uni, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-md group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={uni.imageUrl}
                      alt={uni.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Circular Flag Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden">
                        {countryFlags[uni.country as keyof typeof countryFlags]}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 opacity-70"></div>
                  </div>
                  <div className="p-4 text-center bg-white">
                    <h4 className="font-semibold text-lg text-purple-900">{uni.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{uni.location}</p>
                    <div className="mt-3 flex justify-center">
                      <button className="text-purple-700 hover:text-purple-900 text-sm font-medium inline-flex items-center">
                        View Programs
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View more universities link */}
            <div className="mt-10 text-center">
              <a href="#" className="inline-flex items-center text-purple-700 hover:text-purple-900 font-medium">
                View all available universities
                <ChevronRight className="h-5 w-5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;