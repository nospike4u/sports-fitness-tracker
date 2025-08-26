import React from "react";
import "/src/Components/footer.css";
import {
  RiLinkedinFill,
  RiInstagramFill,
  RiGithubFill,
  RiTwitterFill,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* Social Media Icons - Horizontally centered */}
        <div className="flex justify-center space-x-8 mb-6">
          <a
            href="https://www.instagram.com/"
            className="text-gray-300 hover:text-pink-400 transition-all duration-300 hover:scale-110 social-icon-hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram">
            <RiInstagramFill size={32} />
          </a>
          <a
            href="https://github.com/"
            className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:scale-110 social-icon-hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub">
            <RiGithubFill size={32} />
          </a>
          <a
            href="https://twitter.com/"
            className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-110 social-icon-hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter">
            <RiTwitterFill size={32} />
          </a>
          <a
            href="https://www.linkedin.com/"
            className="text-gray-300 hover:text-blue-500 transition-all duration-300 hover:scale-110 social-icon-hover"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn">
            <RiLinkedinFill size={32} />
          </a>
        </div>

        {/* Footer Links - Horizontally centered */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 text-sm">
          <a 
            href="/privacy-policy" 
            className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Privacy Policy
          </a>
          <a 
            href="/terms-of-service" 
            className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Terms of Service
          </a>
          <a 
            href="/cookie-policy" 
            className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
            Cookie Policy
          </a>
        </div>

        {/* Copyright - Centered */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-4">
          <p>© 2025 FitPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;