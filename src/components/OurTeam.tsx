import React from "react";
import { motion } from "framer-motion";
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
  // Animation variants for team cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-20 px-4 md:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-purple-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Executive Team
        </motion.h2>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mt-3 mx-auto rounded-full"></div>
        <motion.p
          className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg md:text-xl font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Meet the visionary leaders driving our success with passion and
          innovation.
        </motion.p>
      </div>

      {/* Team Members Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center overflow-hidden relative group"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Image */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full rounded-full object-cover border-4 border-purple-400 group-hover:border-purple-500 transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-purple-200 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
            </div>

            {/* Name & Role */}
            <h3 className="text-xl font-semibold text-gray-900">
              {member.name}
            </h3>
            <p className="text-purple-700 font-medium text-sm mt-1">
              {member.role}
            </p>
            <p className="text-gray-500 text-xs mt-2 italic">
              Shaping the future with expertise.
            </p>

            {/* Social Media Icons */}
            <div className="mt-4 flex justify-center">
              <a
                href={member.linkedin}
                className="text-gray-600 hover:text-purple-700 text-2xl transition-colors duration-300"
                aria-label={`${member.name} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiLinkedin />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurPeople;
