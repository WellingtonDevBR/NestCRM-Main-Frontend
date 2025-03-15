
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetOrganizationRequest {
  subdomain?: string;
  hostname?: string; // Added hostname for better context
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
    // Get subdomain and hostname from request
    const { subdomain, hostname } = await req.json() as GetOrganizationRequest;
    
    console.log(`Edge function received: subdomain: "${subdomain}", hostname: "${hostname}"`);

    // Empty subdomain or direct access to the main domain is always treated as main domain
    if (!subdomain || subdomain === '' || hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
      console.log(`Empty subdomain or direct main domain access: ${hostname}`);
      return new Response(
        JSON.stringify({ 
          isMainDomain: true,
          message: "This is the main domain" 
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

    // Check if this is a main domain identifier
    if (MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
      console.log(`Main domain identifier detected: ${subdomain}`);
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
      .maybeSingle();

    if (error || !organization) {
      console.error("Error or no organization found:", error?.message || "No matching organization");
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
        isMainDomain: true  // Fallback to main domain on errors
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
});
