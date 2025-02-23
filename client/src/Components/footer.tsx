import React from "react";
import "./Footer.css";
import {
  RiLinkedinFill,
  RiInstagramFill,
  RiGithubFill,
  RiTwitterFill,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="footerElement">
      <div className="footerContent">
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