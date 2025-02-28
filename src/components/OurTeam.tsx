import React from "react";
import { CiLinkedin } from "react-icons/ci";
import Radha from "../assets/img/radha sir.png";
import Rama from "../assets/img/rama mam.png";
import Sneha from "../assets/img/sneha.png";
import Subash from "../assets/img/subbu.png";
import Srinivas from "../assets/img/srinivas.png";
import Ramesh from "../assets/img/ramesh.png";
import Narendra from "../assets/img/narendra.png";
import Umamaheswara from "../assets/img/mahesh.png";

const teamMembers = [
  {
    name: "RadhaKrishna.T",
    role: "CEO & Co-Founder",
    img: Radha,
    linkedin: "https://www.linkedin.com/in/oxyradhakrishna/",
  },
  {
    name: "Ramadevi.T",
    role: "Co-Founder",
    img: Rama,
    linkedin: "https://www.linkedin.com/in/ramadevi-thatavarti-969828284/",
  },
  {
    name: "Subhash.S",
    role: "Co-Founder",
    img: Subash,
    linkedin: "https://www.linkedin.com/in/ssure/",
  },
  {
    name: "Snehalatha Reddy",
    role: "Co-Founder",
    img: Sneha,
    linkedin: "https://www.linkedin.com/in/sneha-soma-18681a19b/",
  },
  {
    name: "Yadavalli Srinivas",
    role: "Co-Founder",
    img: Srinivas,
    linkedin: "https://www.linkedin.com/in/yadavallisrinivas/",
  },
  {
    name: "Ramesh.R",
    role: "Co-Founder",
    img: Ramesh,
    linkedin: "https://www.linkedin.com/in/k-ramesh-reddy-a2150b15/",
  },
  {
    name: "Narendra Kumar",
    role: "Co-Founder",
    img: Narendra,
    linkedin:
      "https://www.linkedin.com/in/narendra-kumar-balijepalli-bb4a96129/",
  },
  {
    name: "Umamaheswara Rao",
    role: "Co-Founder",
    img: Umamaheswara,
    linkedin: "https://www.linkedin.com/in/umamaheswara",
  },
];

const OurPeople: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-purple-50 to-purple-100 py-16">
      {/* Header Section */}
      <div className="text-center px-6 md:px-12">
        <h2 className="text-4xl font-bold text-purple-800">Executive Team</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mt-2 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto font-medium text-lg">
          Meet the talented individuals behind our success.
        </p>
      </div>

      {/* Team Members Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 px-6 md:px-12 mt-10">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 text-center transform hover:scale-105 transition duration-300 hover:shadow-xl"
          >
            {/* Profile Image */}
            <img
              src={member.img}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500 shadow-lg"
            />

            {/* Name & Role */}
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {member.name}
            </h3>
            <p className="text-purple-600 font-medium">{member.role}</p>
            <p className="text-sm text-gray-500 italic mt-2">
              Inspiring innovation and leadership.
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center mt-4">
              <a
                href={member.linkedin}
                className="text-gray-500 hover:text-purple-600 text-2xl transition duration-300"
                aria-label={`${member.name} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiLinkedin />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPeople;
