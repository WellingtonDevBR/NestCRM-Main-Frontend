
import { Link } from "react-router-dom";

interface NavLinksProps {
  isMobile?: boolean;
  onClick?: () => void;
}

const NavLinks = ({ isMobile = false, onClick = () => {} }: NavLinksProps) => {
  const baseClasses = "text-foreground/80 hover:text-purple-600 transition-colors";
  const mobileClasses = isMobile ? "py-2" : "";
  
  const scrollToTop = (e: React.MouseEvent) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClick();
  };
  
  return (
    <>
      <Link
        to="/"
        className={`${baseClasses} ${mobileClasses}`}
        onClick={scrollToTop}
      >
        Home
      </Link>
      <a
        href="#features"
        className={`${baseClasses} ${mobileClasses}`}
        onClick={onClick}
      >
        Features
      </a>
      <a
        href="/#pricing"
        className={`${baseClasses} ${mobileClasses}`}
        onClick={onClick}
      >
        Pricing
      </a>
    </>
  );
};

export default NavLinks;
