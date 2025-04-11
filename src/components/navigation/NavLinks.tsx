
import { Link } from "react-router-dom";

interface NavLinksProps {
  isMobile?: boolean;
  onClick?: () => void;
}

const NavLinks = ({ isMobile = false, onClick = () => {} }: NavLinksProps) => {
  const baseClasses = "text-foreground/80 hover:text-purple-600 transition-colors";
  const mobileClasses = isMobile ? "py-2" : "";
  
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClick();
  };
  
  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -80; // Header height offset
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    onClick();
  };
  
  return (
    <>
      <a
        href="#"
        className={`${baseClasses} ${mobileClasses}`}
        onClick={handleHomeClick}
      >
        Home
      </a>
      <a
        href="#features"
        className={`${baseClasses} ${mobileClasses}`}
        onClick={(e) => handleSectionClick(e, 'features')}
      >
        Features
      </a>
      <a
        href="#pricing"
        className={`${baseClasses} ${mobileClasses}`}
        onClick={(e) => handleSectionClick(e, 'pricing')}
      >
        Pricing
      </a>
    </>
  );
};

export default NavLinks;
