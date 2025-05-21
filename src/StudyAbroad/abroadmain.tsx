import React, { useState, useEffect, useRef } from 'react';

// Define type for country details
interface CountryDetails {
  visaInfo: string;
  langRequirements: string;
  avgTuition: string;
  popularPrograms: string[];
  scholarships: string[];
}

// Define type for country
interface Country {
  name: string;
  flag: string;
  description: string;
  details: CountryDetails;
}

// Define type for university
interface University {
  name: string;
  country: string;
  image: string;
  description: string;
}


export default function StudyAbroadCountries() {
  // State for selected country filter and country details modal
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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
  Scotland: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
      <g transform="scale(0.8) translate(12, 12)">
        <rect width="100" height="100" fill="#0065BF" />
        <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="20" />
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
  Ireland: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="white" stroke="#d1d1d1" strokeWidth="1" />
      <g transform="scale(0.8) translate(12, 12)">
        <rect width="33.3" height="100" fill="#169B62" />
        <rect x="33.3" width="33.3" height="100" fill="#fff" />
        <rect x="66.6" width="33.3" height="100" fill="#FF883E" />
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

  // Countries data
  const countries: Country[] = [
    { 
      name: "USA", 
      flag: "🇺🇸", 
      description: "Home to Ivy League schools and cutting-edge research institutions",
      details: {
        visaInfo: "F-1 Student Visa required",
        langRequirements: "TOEFL score of 80+ or IELTS 6.5+",
        avgTuition: "$20,000 - $60,000 per year",
        popularPrograms: ["Business", "Computer Science", "Engineering"],
        scholarships: ["Fulbright Program", "Diversity Visa", "Merit Scholarships"]
      }
    },
    { 
      name: "UK", 
      flag: "🇬🇧", 
      description: "Centuries of academic excellence and diverse educational opportunities",
      details: {
        visaInfo: "Tier 4 Student Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "£12,000 - £35,000 per year",
        popularPrograms: ["Business", "Law", "Arts"],
        scholarships: ["Chevening Scholarships", "Commonwealth Scholarships"]
      }
    },
    { 
      name: "Germany", 
      flag: "🇩🇪", 
      description: "Renowned for engineering, tuition-free public universities",
      details: {
        visaInfo: "German Student Visa required",
        langRequirements: "German proficiency (TestDaF/DSH) for German programs, English for international programs",
        avgTuition: "€0 - €3,000 per year (most public universities are tuition-free)",
        popularPrograms: ["Engineering", "Physics", "Medicine"],
        scholarships: ["DAAD Scholarships", "Erasmus+"]
      }
    },
    { 
      name: "Scotland", 
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 
      description: "Historic universities with strong research capabilities",
      details: {
        visaInfo: "Tier 4 Student Visa required (same as UK)",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "Free for Scottish/EU students, £15,000 - £25,000 for international students",
        popularPrograms: ["Medicine", "Engineering", "Arts"],
        scholarships: ["Scotland Saltire Scholarships", "Commonwealth Scholarships"]
      }
    },
    { 
      name: "France", 
      flag: "🇫🇷", 
      description: "World-class education in arts, sciences, and culinary studies",
      details: {
        visaInfo: "VLS-TS Student Visa required",
        langRequirements: "French proficiency (DELF/DALF) for French programs, English for international programs",
        avgTuition: "€3,000 - €10,000 per year",
        popularPrograms: ["Business", "Arts", "Culinary"],
        scholarships: ["Eiffel Excellence Scholarship", "French Government Scholarships"]
      }  
    },
    { 
      name: "Ireland", 
      flag: "🇮🇪", 
      description: "English-speaking country with strong tech and business programs",
      details: {
        visaInfo: "Irish Study Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "€10,000 - €25,000 per year",
        popularPrograms: ["Technology", "Business", "Medicine"],
        scholarships: ["Government of Ireland Scholarships", "Walsh Fellowships"]
      }
    },
    { 
      name: "New Zealand", 
      flag: "🇳🇿", 
      description: "Quality education with breathtaking natural landscapes",
      details: {
        visaInfo: "Student Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "NZ$22,000 - NZ$35,000 per year",
        popularPrograms: ["Agriculture", "Environmental Sciences", "Tourism"],
        scholarships: ["New Zealand Excellence Awards", "Commonwealth Scholarships"]
      }
    }
  ];

  // Track arrow position
  const [arrowPosition, setArrowPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  
  // Reference for country flag elements
  const countryRefs = {
    USA: React.useRef<HTMLDivElement>(null),
    UK: React.useRef<HTMLDivElement>(null),
    Germany: React.useRef<HTMLDivElement>(null),
    Scotland: React.useRef<HTMLDivElement>(null),
    France: React.useRef<HTMLDivElement>(null),
    Ireland: React.useRef<HTMLDivElement>(null),
    "New Zealand": React.useRef<HTMLDivElement>(null),
  };

  // Handle country selection with animation and dynamic arrow positioning
  const handleCountrySelect = (country: Country) => {
    // Get the DOM element for the selected country
    const countryElement = countryRefs[country.name as keyof typeof countryRefs].current;
    
    if (countryElement) {
      // Calculate the position for the arrow (centered below the country)
      const rect = countryElement.getBoundingClientRect();
      const containerRect = countryElement.parentElement?.getBoundingClientRect() || rect;
      
      // Position relative to the container
      const left = rect.left - containerRect.left + rect.width / 2;
      const top = rect.bottom - containerRect.top + 10; // Position it 10px below
      
      // Update arrow position
      setArrowPosition({ left, top });
    }
    
    // If clicking the same country that's already active, just toggle details
    if (activeCountry?.name === country.name && showDetails) {
      setShowDetails(false);
      return;
    }

    // If changing countries while details are shown
    if (showDetails && activeCountry?.name !== country.name) {
      setIsAnimating(true);
      // First hide current details
      setShowDetails(false);
      // Then after a short delay, show new country details
      setTimeout(() => {
        setActiveCountry(country);
        setShowDetails(true);
        setIsAnimating(false);
      }, 300);
    } else {
      // Simple case: just show details for the selected country
      setActiveCountry(country);
      setShowDetails(true);
    }
    
    // Set the selected country for highlighting purposes
    setSelectedCountry(country.name);
  };

  // Handle window resizing and update arrow position
  useEffect(() => {
    const handleResize = () => {
      if (selectedCountry && showDetails) {
        const countryElement = countryRefs[selectedCountry as keyof typeof countryRefs].current;
        if (countryElement) {
          const rect = countryElement.getBoundingClientRect();
          const containerRect = countryElement.parentElement?.getBoundingClientRect() || rect;
          const left = rect.left - containerRect.left + rect.width / 2;
          const top = rect.bottom - containerRect.top + 10;
          setArrowPosition({ left, top });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedCountry, showDetails]);

  // Scroll details into view when they appear
  useEffect(() => {
    if (showDetails && activeCountry) {
      const detailsElement = document.getElementById('country-details');
      if (detailsElement) {
        setTimeout(() => {
          detailsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
      
      // Also update arrow position in case of layout shifts
      const countryElement = countryRefs[activeCountry.name as keyof typeof countryRefs].current;
      if (countryElement) {
        const rect = countryElement.getBoundingClientRect();
        const containerRect = countryElement.parentElement?.getBoundingClientRect() || rect;
        const left = rect.left - containerRect.left + rect.width / 2;
        const top = rect.bottom - containerRect.top + 10;
        setArrowPosition({ left, top });
      }
    }
  }, [showDetails, activeCountry]);

  return (
    <div className="bg-purple-50 font-sans min-h-screen">
      {/* Enhanced Hero Section with parallax effect */}
      <section className="py-12 relative overflow-hidden bg-purple-50">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900"></div>
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-yellow-400 opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-600 opacity-20"></div>
          <div className="absolute top-40 right-1/4 w-16 h-16 rounded-full bg-indigo-500 opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-yellow-500 rounded mr-3"></div>
              <span className="text-purple-700 text-lg font-semibold tracking-wider uppercase">Explore Education Abroad</span>
              <div className="h-1 w-16 bg-yellow-500 rounded ml-3"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-purple-700">Your Global Education</span><br />
              <span className="text-purple-900">Journey Starts</span> <span className="text-purple-700 relative">
                Here
              </span>
            </h1>
            
            <p className="text-lg text-gray-700 max-w-2xl mb-8">
              Discover prestigious universities across seven countries offering diverse programs, 
              scholarships, and life-changing opportunities for international students
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                Start Your Journey
              </button>
              <button className="border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300">
                Explore Programs
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute -bottom-20 -left-16 w-40 h-40 rounded-full bg-yellow-500 opacity-10 blur-md"></div>
        <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-purple-700 opacity-10 blur-sm"></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-yellow-400 opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-purple-500 opacity-30"></div>
      </section>

      {/* Countries Section */}
      <section className="py-4 mb-20">
        <div className="container mx-auto">
          <div className="border-2 border-yellow-500 rounded-lg p-6 relative bg-white shadow-lg">
            {/* Top Countries Header */}
            <div className="absolute -top-6 left-0 right-0 flex justify-center">
              <div className="bg-white px-8 rounded-full border-2 border-yellow-500 shadow-md">
                <h2 className="text-2xl font-bold mb-2 text-center text-purple-900">Top Countries</h2>
              </div>
            </div>
            
            {/* Country flags row with dynamic arrow */}
            <div className="flex flex-wrap justify-center gap-8 mt-6 mb-16 relative">
              {/* Dynamic arrow that follows the selected country */}
              {selectedCountry && (
                <div 
                  className="absolute w-0 h-0 transition-all duration-300 ease-in-out "
                  style={{
                    left: `${arrowPosition.left}px`,
                    top: `${arrowPosition.top}px`,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderBottom: '12px solid #f59e0b', // Yellow-500
                    transform: 'translateX(-12px)',
                    zIndex: 20
                  }}
                ></div>
              )}
              
              {countries.map((country) => (
                <div key={country.name} 
                     ref={countryRefs[country.name as keyof typeof countryRefs]}
                     className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedCountry === country.name ? 'scale-110' : 'hover:scale-105'}`} 
                     onClick={() => handleCountrySelect(country)}>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="mb-6 text-gray-600 italic border-l-4 border-yellow-500 pl-3">
                    {activeCountry.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Visa Requirements
                      </h4>
                      <p>{activeCountry.details.visaInfo}</p>
                      
                      <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        Language Requirements
                      </h4>
                      <p>{activeCountry.details.langRequirements}</p>
                      
                      <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Average Tuition
                      </h4>
                      <p>{activeCountry.details.avgTuition}</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Popular Programs
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {activeCountry.details.popularPrograms.map((program, index) => (
                          <li key={index}>{program}</li>
                        ))}
                      </ul>
                      
                      <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
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
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-purple-900">75+ Universities</h3>
                  <p className="text-xl flex items-center">
                    <span className="inline-block w-8 h-1 bg-yellow-500 mr-2"></span>
                    600+ Courses Available
                  </p>
                </div>
                <button className="bg-white border-2 border-yellow-500 text-purple-800 hover:bg-yellow-50 px-6 py-2 rounded-full shadow-md transition duration-300 font-semibold flex items-center">
                  View all universities
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
      flagUrl: "/flags/us.png", // Replace with your flag asset path
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
          <img
            src={uni.flagUrl}
            alt={uni.country}
            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 opacity-70"></div>
      </div>
      <div className="p-4 text-center bg-white">
        <h4 className="font-semibold text-lg text-purple-900">{uni.name}</h4>
        <p className="text-sm text-gray-600 mt-1">{uni.location}</p>
        <div className="mt-3 flex justify-center">
          <button className="text-purple-700 hover:text-purple-900 text-sm font-medium inline-flex items-center">
            View Programs
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-purple-900">What Our Students Say</h2>
            <div className="flex justify-center items-center mt-2">
              <div className="h-1 w-16 bg-yellow-500 rounded"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Harvard University, USA</p>
                </div>
              </div>
              <p className="italic text-gray-700">"The guidance I received made my application process so much smoother. From visa assistance to scholarship recommendations, everything was handled professionally."</p>
              <div className="flex mt-4 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-sm text-gray-600">University of Edinburgh, Scotland</p>
                </div>
              </div>
              <p className="italic text-gray-700">"Studying in Scotland has been life-changing. The educational quality and cultural experience exceeded all my expectations. The application support was exceptional."</p>
              <div className="flex mt-4 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Aisha Patel</h4>
                  <p className="text-sm text-gray-600">Technical University of Munich, Germany</p>
                </div>
              </div>
              <p className="italic text-gray-700">"The free tuition in Germany is amazing, but navigating the system can be challenging. Thanks to the expert guidance, I secured my spot at TUM and even got a scholarship!"</p>
              <div className="flex mt-4 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
                <p className="text-purple-100 mb-6">Let our experts guide you through the application process and help you find the perfect university abroad.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                    Get Started Now
                  </button>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold py-3 px-8 rounded-full transition duration-300">
                    Schedule a Consultation
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -top-5 -left-5 w-20 h-20 bg-yellow-500 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-purple-300 rounded-full opacity-20"></div>
                  <div className="bg-white p-5 rounded-lg shadow-md transform rotate-3">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <h3 className="font-bold text-xl text-purple-900 mt-4">Global Education</h3>
                      <p className="text-gray-600 mt-2">Join 5000+ students who have successfully started their international education journey with us.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}