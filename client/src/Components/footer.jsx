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
    <footer className="footerElement navbar flex justify-between items-center py-[10px] px-[30px] bg-gradient-to-r from-pink-500 to-yellow-500 rounded-md mb-16">
      <div className="footerContent flex items-center cursor-pointer">
        <div className="footerLinks">
          <a href="/privacy-policy" className="footerLink">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="footerLink">
            Terms of Service
          </a>
          <a href="/cookie-policy" className="footerLink">
            Cookie Policy
          </a>
        </div>
        <div className="socialMedia">
          <a
            href="https://www.instagram.com/"
            className="socialLink"
            target="_blank"
            rel="noopener noreferrer">
            <RiInstagramFill className="socialIcon" size={30} />
          </a>
          <a
            href="https://github.com/"
            className="socialLink"
            target="_blank"
            rel="noopener noreferrer">
            <RiGithubFill className="socialIcon" size={30} />
          </a>
          <a
            href="https://twitter.com/"
            className="socialLink"
            target="_blank"
            rel="noopener noreferrer">
            <RiTwitterFill className="socialIcon" size={30} />
          </a>
          <a
            href="https://www.linkedin.com/"
            className="socialLink"
            target="_blank"
            rel="noopener noreferrer">
            <RiLinkedinFill className="socialIcon" size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;