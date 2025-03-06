import React, { useState } from "react";
import { motion } from "framer-motion";
import { CiLinkedin } from "react-icons/ci";
import { FaQuoteLeft } from "react-icons/fa";

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
    quote: "Driving innovation through collaborative leadership.",
  },
  {
    name: "Ramadevi.T",
    role: "Co-Founder",
    img: Rama,
    linkedin: "https://www.linkedin.com/in/ramadevi-thatavarti-969828284/",
    quote: "Building sustainable solutions for tomorrow's challenges.",
  },
  {
    name: "Subhash.S",
    role: "Co-Founder",
    img: Subash,
    linkedin: "https://www.linkedin.com/in/ssure/",
    quote: "Transforming ideas into market-leading products.",
  },
  {
    name: "Snehalatha Reddy",
    role: "Co-Founder",
    img: Sneha,
    linkedin: "https://www.linkedin.com/in/sneha-soma-18681a19b/",
    quote: "Creating value through strategic vision and execution.",
  },
  {
    name: "Yadavalli Srinivas",
    role: "Co-Founder",
    img: Srinivas,
    linkedin: "https://www.linkedin.com/in/yadavallisrinivas/",
    quote: "Empowering teams to achieve exceptional results.",
  },
  {
    name: "Ramesh.R",
    role: "Co-Founder",
    img: Ramesh,
    linkedin: "https://www.linkedin.com/in/k-ramesh-reddy-a2150b15/",
    quote: "Bringing technical excellence to every project.",
  },
  {
    name: "Narendra Kumar",
    role: "Co-Founder",
    img: Narendra,
    linkedin: "https://www.linkedin.com/in/narendra-kumar-balijepalli-bb4a96129/",
    quote: "Pioneering solutions that shape industry standards.",
  },
  {
    name: "Umamaheswara Rao",
    role: "Co-Founder",
    img: Umamaheswara,
    linkedin: "https://www.linkedin.com/in/umamaheswara",
    quote: "Leveraging expertise to drive meaningful innovation.",
  },
];

const OurPeople: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for team cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Animation for the header underline
  const underlineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "80px",
      transition: { duration: 0.8, delay: 0.3 }
    },
  };

  return (
    <section className="bg-white py-20 px-4 md:px-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-3xl font-extrabold text-purple-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Executive Team
        </motion.h2>
        <motion.div 
          className="h-1 bg-gray-800 mx-auto rounded-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={underlineVariants}
        ></motion.div>
        <motion.p
          className="text-gray-700 mt-4 max-w-3xl mx-auto text-sm md:text-lg font-normal"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Meet the visionary leaders who combine decades of expertise to drive innovation and excellence in everything we do.
        </motion.p>
      </div>

      {/* Team Members Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden relative group"
            variants={cardVariants}
            whileHover={{
              y: -8,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 }
            }}
            onMouseEnter={() => setActiveCard(index)}
            onMouseLeave={() => setActiveCard(null)}
          >
            {/* Profile Image with Hover Effect */}
            <div className="relative overflow-hidden h-64">
              <motion.img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 0.5 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Quote that appears on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center px-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div>
                  <FaQuoteLeft className="text-white text-2xl mb-3 mx-auto" />
                  <p className="text-white font-medium italic">"{member.quote}"</p>
                </div>
              </motion.div>
            </div>

            {/* Info Card */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-gray-800 font-medium text-sm mb-4">
                {member.role}
              </p>
              
              {/* Divider */}
              <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
              
              {/* LinkedIn Link */}
              <a
                href={member.linkedin}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:text-white hover:bg-blue-800 transition-all duration-300"
                aria-label={`${member.name} on LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CiLinkedin className="text-xl" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
     
    </section>
  );
};

export default OurPeople;