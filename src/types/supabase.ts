
export type Organization = {
  id: string;
  name: string;
  subdomain: string;
  created_at: string;
  updated_at: string;
  settings: Record<string, any>;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  organization_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string | null;
  risk_score: number | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerInteraction = {
  id: string;
  organization_id: string;
  customer_id: string;
  type: string;
  description: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};
