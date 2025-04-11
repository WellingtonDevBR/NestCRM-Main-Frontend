
import { NavLinks } from "@/components/navigation";
import AuthButtons from "@/components/navigation/AuthButtons";
import { TenantInfo } from "@/domain/auth/types";

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  tenant: TenantInfo | null;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, isAuthenticated, tenant, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
      <div className="container-custom py-4 flex flex-col space-y-4">
        <NavLinks isMobile onClick={onClose} />
        <div className={`flex flex-col space-y-2 pt-2 ${isAuthenticated ? "" : "space-y-2"}`}>
          <AuthButtons 
            isAuthenticated={isAuthenticated} 
            tenant={tenant} 
            isMobile
            onButtonClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
