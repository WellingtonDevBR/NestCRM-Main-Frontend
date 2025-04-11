
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/f331213a-aeba-40ff-a2df-5d1da1bc386f.png" 
        alt="NestCRM Logo" 
        className="h-8 w-8 mr-2" 
      />
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">NESTCRM</span>
    </Link>
  );
};

export default Logo;
