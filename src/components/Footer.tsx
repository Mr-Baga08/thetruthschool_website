import React from 'react';
import { Linkedin, Instagram, Youtube } from 'lucide-react';
import { motion } from "framer-motion"

const Footer = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 py-10 flex flex-col bg-black text-white">
      {/* Logo */}
      <motion.div 
      className="text-3xl sm:text-4xl font-bold text-center mb-10 text-yellow-400"
      initial={{ opacity: 0,y:50 }}
      whileInView={{ opacity:1, y: 0}}
      transition={{ duration: 0.6 }}
      >
        TheTruth<span className="text-white">School</span>
      </motion.div>

      {/* Grid for About and Social */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start"
       initial={{ opacity: 0,y:50 }}
       whileInView={{ opacity:1, y: 0}}
       transition={{ duration: 0.6 }}
      >
        {/* About Section */}
        <div className="text-center sm:text-left sm:ml-20">
          <h2 className="text-2xl text-gray-400 mb-4 ">About Us</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            TheTruthSchool is on a mission to provide real, honest, and actionable advice to help you succeed in your career.
            We cut through the fluff and give you what actually works — practical strategies, proven tips, and no-nonsense guidance
            to land your dream job and grow professionally.
          </p>
        </div>

        {/* Social Section */}
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-4">Follow our journey</p>
          <div className="flex justify-center sm:justify-start gap-6 sm:relative md:left-60 sm:left-20">
            <a href="https://www.linkedin.com/company/thetruthschool/" className="text-yellow-500 hover:text-yellow-300 transition-colors duration-200">
              <Linkedin className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
            <a href="https://www.instagram.com/thetruthschool_motivation/" className="text-yellow-500 hover:text-yellow-300 transition-colors duration-200">
              <Instagram className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
            <a href="https://www.youtube.com/@TheTruthSchool" className="text-yellow-500 hover:text-yellow-300 transition-colors duration-200">
              <Youtube className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Copyright */}
      <motion.div className="text-center text-gray-500 text-xs mt-10"
       initial={{ opacity: 0,y:50 }}
       whileInView={{ opacity:1, y: 0}}
       transition={{ duration: 0.6 }}
      >
        © {new Date().getFullYear()} TheTruthSchool. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Footer;
