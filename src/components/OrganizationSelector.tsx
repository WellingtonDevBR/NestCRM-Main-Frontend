
import { useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';

export function OrganizationSelector() {
  const { isAuthenticated } = useAuth();
  const { 
    organizations, 
    currentOrganization, 
    switchOrganization, 
    createOrganization,
    isValidSubdomain
  } = useOrganization();
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubdomainChange = async (value: string) => {
    setSubdomain(value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    
    if (value.length >= 3) {
      const valid = await isValidSubdomain(value);
      setSubdomainAvailable(valid);
    } else {
      setSubdomainAvailable(null);
    }
  };

  const handleCreateOrganization = async () => {
    if (!name || !subdomain) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (subdomain.length < 3) {
      toast.error('Subdomain must be at least 3 characters');
      return;
    }
    
    if (!subdomainAvailable) {
      toast.error('This subdomain is not available');
      return;
    }
    
    setIsCreating(true);
    try {
      const org = await createOrganization(name, subdomain);
      if (org) {
        setOpen(false);
        setName('');
        setSubdomain('');
        setSubdomainAvailable(null);
        
        // In a production app, we'd redirect to the new subdomain here
        // For demo purposes, we'll just show a success message
        toast.success('Organization created!', {
          description: `Visit ${subdomain}.nestcrm.com.au to access it`,
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentOrganization?.id}
        onValueChange={(value) => switchOrganization(value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Each organization gets its own subdomain and isolated data environment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subdomain">
                Subdomain
                {subdomainAvailable === true && (
                  <span className="ml-2 text-sm text-green-600">✓ Available</span>
                )}
                {subdomainAvailable === false && (
                  <span className="ml-2 text-sm text-red-600">Not available</span>
                )}
              </Label>
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  placeholder="acmeinc"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="rounded-r-none"
                />
                <span className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-muted-foreground">
                  .nestcrm.com.au
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrganization} 
              disabled={isCreating || !subdomainAvailable}
            >
              {isCreating ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
