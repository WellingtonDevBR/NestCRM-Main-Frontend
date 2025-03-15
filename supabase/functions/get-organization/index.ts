
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetOrganizationRequest {
  subdomain?: string;
  hostname?: string;
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

    // CRITICAL FIX: Improved development environment detection
    const isDevelopmentEnvironment = hostname?.includes('localhost') || 
        hostname?.includes('127.0.0.1') || 
        hostname?.includes('lovableproject.com') ||
        hostname?.includes('netlify.app') || 
        hostname?.includes('vercel.app');
        
    if (isDevelopmentEnvironment) {
      console.log(`Development/preview URL detected: ${hostname}`);
      
      // If on development environment but with a valid subdomain parameter
      if (subdomain && subdomain !== '' && !MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
        console.log(`Valid subdomain parameter in development: ${subdomain}`);
        
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
          console.error("No organization found for subdomain in development:", subdomain);
          return new Response(
            JSON.stringify({ 
              error: "Could not find organization",
              isMainDomain: true // Default to main domain if no organization found
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
        
        console.log(`Found organization in development: ${organization.name}`);
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
      } else {
        // Development environment with no subdomain - treat as main domain
        console.log('Development environment without valid subdomain - treating as main domain');
        return new Response(
          JSON.stringify({ 
            isMainDomain: true,
            message: "This is the main domain (development environment)" 
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
    }

    // Always treat nestcrm.com.au as the main domain, regardless of subdomain
    if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
      console.log(`Direct access to main domain detected: ${hostname}`);
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

    // Empty subdomain or main domain identifiers are always treated as main domain
    if (!subdomain || subdomain === '' || MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
      console.log(`Empty subdomain or main domain identifier: ${subdomain}`);
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
          isMainDomain: true // Default to main domain if no organization found
        }),
        { 
          status: 200, // Using 200 instead of 404 to prevent navigation errors
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
    // Always default to main domain on errors for graceful fallback
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        isMainDomain: true
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
