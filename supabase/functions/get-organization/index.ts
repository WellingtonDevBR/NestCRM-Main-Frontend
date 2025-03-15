
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetOrganizationRequest {
  subdomain?: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get subdomain from request
    const { subdomain } = await req.json() as GetOrganizationRequest;

    if (!subdomain) {
      return new Response(
        JSON.stringify({ error: "Subdomain is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Special case for "nestcrm" subdomain - this is actually the base domain
    if (subdomain === 'nestcrm') {
      return new Response(
        JSON.stringify({ error: "This is the root domain, not a tenant subdomain" }),
        { 
          status: 400, 
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
        JSON.stringify({ error: "Could not find organization" }),
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
      JSON.stringify({ organization }),
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
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
