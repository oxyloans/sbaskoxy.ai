import React from "react";
import { ChevronRight, Globe, Star ,Users, School, Building, CheckCircle, GraduationCap } from "lucide-react";

// Type definitions
interface University {
  name: string;
  country: string;
  location: string;
  image: string;
  description: string;
  ranking?: string;
  programs?: number;
}

const UniversitiesSection = () => {
  const universities: University[] = [
    {
      name: "Harvard University",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "/api/placeholder/400/250",
      description: "Prestigious Ivy League institution known for excellence in all fields",
      ranking: "#1 Global",
      programs: 180
    },
    {
      name: "University of Oxford",
      country: "UK",
      location: "Oxford, England",
      image: "/api/placeholder/400/250",
      description: "One of the oldest and most prestigious universities in the world",
      ranking: "#2 Global",
      programs: 200
    },
    {
      name: "Technical University of Munich",
      country: "Germany",
      location: "Munich, Bavaria",
      image: "/api/placeholder/400/250",
      description: "Leading technical university with strong industry connections",
      ranking: "#1 Germany",
      programs: 145
    },
    {
      name: "University of Toronto",
      country: "Canada",
      location: "Toronto, Ontario",
      image: "/api/placeholder/400/250",
      description: "Top Canadian university with diverse academic programs",
      ranking: "#1 Canada",
      programs: 215
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      location: "Melbourne, Victoria",
      image: "/api/placeholder/400/250",
      description: "Australia's leading university with excellent research facilities",
      ranking: "#1 Australia",
      programs: 190
    },
    {
      name: "Sorbonne University",
      country: "France",
      location: "Paris, Île-de-France",
      image: "/api/placeholder/400/250",
      description: "Historic university in the heart of Paris, renowned for humanities",
      ranking: "#1 France",
      programs: 120
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

          {/* Statistics */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-6 py-6 w-full px-4">
            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Users size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">3000+</div>
              <div className="text-gray-600 text-center text-sm">Students</div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Building size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">150+</div>
              <div className="text-gray-600 text-center text-sm">
                Recruiters
              </div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <School size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">100+</div>
              <div className="text-gray-600 text-center text-sm">
                Universities
              </div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Globe size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">7</div>
              <div className="text-gray-600 text-center text-sm">Countries</div>
            </div>
          </div>
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

                {/* Programs count */}
                {university.programs && (
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{university.programs}+ Programs</span>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center group">
                    View Programs
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            View All Universities
          </button>
        </div>

        {/* Featured programs section */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Most Popular Study Programs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Business & Management", icon: "💼", count: "150+" },
              { name: "Computer Science", icon: "💻", count: "120+" },
              { name: "Engineering", icon: "⚙️", count: "200+" },
              { name: "Medicine & Health", icon: "🏥", count: "80+" },
              { name: "Arts & Design", icon: "🎨", count: "90+" },
              { name: "Law", icon: "⚖️", count: "60+" },
              { name: "Environmental Science", icon: "🌱", count: "70+" },
              { name: "Psychology", icon: "🧠", count: "85+" },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl mb-2">{program.icon}</div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                  {program.name}
                </h4>
                <p className="text-xs text-purple-600">
                  {program.count} Courses
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