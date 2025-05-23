import React from "react";
import { ChevronRight, Globe, Star, Users, School, Building, CheckCircle, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Type definitions
interface University {
  name: string;
  country: string;
  location: string;
  image: string;
  description: string;
  ranking?: string;
  programs?: number;
  intake?: string[];
  tuitionFee?: string;
}

interface UniversitiesSectionProps {
  onViewAllClick?: () => void; // Add prop for navigation
}

const UniversitiesSection: React.FC<UniversitiesSectionProps> = ({ onViewAllClick }) => {
  const navigate = useNavigate();
  const universities: University[] = [
    {
      name: "Harvard University",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "/api/placeholder/400/250",
      description: "Prestigious Ivy League institution known for excellence in all fields",
      ranking: "#1 Global",
      programs: 180,
      intake: ["Fall", "Spring"],
      tuitionFee: "$54,000"
    },
    {
      name: "University of Oxford",
      country: "UK",
      location: "Oxford, England",
      image: "/api/placeholder/400/250",
      description: "One of the oldest and most prestigious universities in the world",
      ranking: "#2 Global",
      programs: 200,
      intake: ["Fall"],
      tuitionFee: "£9,250"
    },
    {
      name: "Technical University of Munich",
      country: "Germany",
      location: "Munich, Bavaria",
      image: "/api/placeholder/400/250",
      description: "Leading technical university with strong industry connections",
      ranking: "#1 Germany",
      programs: 145,
      intake: ["Fall", "Spring"],
      tuitionFee: "€1,500"
    },
    {
      name: "University of Toronto",
      country: "Canada",
      location: "Toronto, Ontario",
      image: "/api/placeholder/400/250",
      description: "Top Canadian university with diverse academic programs",
      ranking: "#1 Canada",
      programs: 215,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "CAD $58,000"
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      location: "Melbourne, Victoria",
      image: "/api/placeholder/400/250",
      description: "Australia's leading university with excellent research facilities",
      ranking: "#1 Australia",
      programs: 190,
      intake: ["Fall", "Spring"],
      tuitionFee: "AUD $45,000"
    },
    {
      name: "Sorbonne University",
      country: "France",
      location: "Paris, Île-de-France",
      image: "/api/placeholder/400/250",
      description: "Historic university in the heart of Paris, renowned for humanities",
      ranking: "#1 France",
      programs: 120,
      intake: ["Fall", "Spring"],
      tuitionFee: "€2,770"
    }
  ];

  const countryFlags: Record<string, string> = {
    USA: "🇺🇸",
    UK: "🇬🇧",
    Germany: "🇩🇪",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    France: "🇫🇷"
  };

  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick();
    }
    // If using React Router, you could also do:
    navigate('/all-universities');
  };

  const handleViewPrograms = (universityName: string) => {
    // Handle view programs click
    console.log(`View programs for ${universityName}`);
  };

  const handleApplyNow = (universityName: string) => {
    // Handle apply now click
    console.log(`Apply to ${universityName}`);
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-32 bg-gradient-to-r from-transparent to-purple-500"></div>
            <h2 className="mx-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-yellow-500">
              Top Universities
            </h2>
            <div className="h-px w-32 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover premier institutions offering world-class education and
            research opportunities
          </p>

          {/* Updated Statistics to match AllUniversities data */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-6 py-6 w-full px-4">
            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Users size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">5000+</div>
              <div className="text-gray-600 text-center text-sm">Students</div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Building size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">200+</div>
              <div className="text-gray-600 text-center text-sm">
                Recruiters
              </div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <School size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">100</div>
              <div className="text-gray-600 text-center text-sm">
                Universities
              </div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Globe size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">10</div>
              <div className="text-gray-600 text-center text-sm">Countries</div>
            </div>
          </div>
        </div>

        {/* Header with View All link */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Featured Universities</h3>
          <button
            onClick={handleViewAllClick}
            className="text-purple-600 hover:text-purple-800 font-semibold flex items-center group"
          >
            View All Universities
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.map((university, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={university.image}
                  alt={university.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Country flag and ranking badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                    <span>{countryFlags[university.country]}</span>
                    {university.country}
                  </span>
                  {university.ranking && (
                    <span className="bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                      {university.ranking}
                    </span>
                  )}
                </div>

                {/* Overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {university.name}
                </h3>
                <p className="text-purple-600 text-sm mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {university.location}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {university.description}
                </p>

                {/* Updated info section with intake and tuition */}
                <div className="space-y-2 mb-4">
                  {university.programs && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{university.programs}+ Programs</span>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {university.tuitionFee && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tuition:</span> {university.tuitionFee}
                    </div>
                  )}

                  {university.intake && (
                    <div className="flex flex-wrap gap-1">
                      {university.intake.map((intake) => (
                        <span
                          key={intake}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {intake}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleViewPrograms(university.name)}
                    className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center group"
                  >
                    View Programs
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleApplyNow(university.name)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Updated Call to action with better styling */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllClick}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <School className="w-5 h-5" />
            View All Universities
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Featured programs section */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Most Popular Study Programs
            </h3>
            <button
              onClick={handleViewAllClick}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center group"
            >
              View All Programs
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Business & Management", icon: "💼", count: "150+", universities: "45 Universities" },
              { name: "Computer Science", icon: "💻", count: "120+", universities: "38 Universities" },
              { name: "Engineering", icon: "⚙️", count: "200+", universities: "52 Universities" },
              { name: "Medicine & Health", icon: "🏥", count: "80+", universities: "28 Universities" },
              { name: "Arts & Design", icon: "🎨", count: "90+", universities: "32 Universities" },
              { name: "Law", icon: "⚖️", count: "60+", universities: "25 Universities" },
              { name: "Environmental Science", icon: "🌱", count: "70+", universities: "30 Universities" },
              { name: "Psychology", icon: "🧠", count: "85+", universities: "35 Universities" },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center group cursor-pointer"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {program.icon}
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                  {program.name}
                </h4>
                <p className="text-xs text-purple-600 font-medium">
                  {program.count} Courses
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {program.universities}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;