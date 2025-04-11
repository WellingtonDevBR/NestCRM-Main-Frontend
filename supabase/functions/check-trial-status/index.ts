
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, trialStartDate } = await req.json();
    
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Calculate if trial has expired (14 days)
    const trialStart = new Date(trialStartDate);
    const now = new Date();
    const daysSinceTrial = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    const trialExpired = daysSinceTrial >= 14;
    
    // Check if user already has a subscription
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      
      if (customers.data.length > 0) {
        const customerId = customers.data[0].id;
        
        // Check for active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1,
        });
        
        if (subscriptions.data.length > 0) {
          // User has an active subscription
          return new Response(
            JSON.stringify({ 
              trialExpired: false, 
              hasSubscription: true,
              subscriptionData: {
                id: subscriptions.data[0].id,
                status: subscriptions.data[0].status,
                currentPeriodEnd: new Date(subscriptions.data[0].current_period_end * 1000).toISOString()
              }
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }
    
    // Return trial status
    return new Response(
      JSON.stringify({ 
        trialExpired,
        trialDaysRemaining: Math.max(0, 14 - daysSinceTrial),
        hasSubscription: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error checking trial status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
