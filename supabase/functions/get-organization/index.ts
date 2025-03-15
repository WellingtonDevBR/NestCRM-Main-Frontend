
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetOrganizationRequest {
  subdomain?: string;
}

// Main domain constants
const MAIN_DOMAIN = 'nestcrm.com.au';
const MAIN_DOMAIN_IDENTIFIERS = ['nestcrm', 'www'];

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get subdomain from request
    const { subdomain } = await req.json() as GetOrganizationRequest;
    
    console.log(`Edge function received subdomain: ${subdomain}`);

    if (!subdomain) {
      console.log("No subdomain provided in request");
      return new Response(
        JSON.stringify({ 
          error: "Subdomain is required",
          isMainDomain: true  // Changed to true for empty subdomains
        }),
        { 
          status: 200,  // Changed to 200
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Check if this is a main domain request
    // Direct match with full domain or main domain identifiers
    if (subdomain === MAIN_DOMAIN || MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
      console.log(`Request identified as main domain: ${subdomain}`);
      return new Response(
        JSON.stringify({ 
          isMainDomain: true,
          message: "This is the main domain, not a tenant subdomain" 
        }),
        { 
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    console.log(`Looking up organization with subdomain: ${subdomain}`);

    // Create Supabase client with service role key for bypassing RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch organization by subdomain
    const { data: organization, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('subdomain', subdomain)
      .single();

    if (error) {
      console.error("Error fetching organization:", error.message);
      return new Response(
        JSON.stringify({ 
          error: "Could not find organization",
          isMainDomain: false 
        }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    console.log(`Found organization: ${organization.name}`);
    
    return new Response(
      JSON.stringify({ 
        organization,
        isMainDomain: false 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        isMainDomain: true  // Changed to true for errors too
      }),
      { 
        status: 200,  // Changed to 200
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
