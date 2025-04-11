
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    const { session_id, customer_email } = await req.json();
    
    if (!session_id && !customer_email) {
      throw new Error("Either session_id or customer_email is required");
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    let subscriptions;
    let customerId;
    
    // If we have a session ID, get the subscription from it
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (!session.subscription) {
        return new Response(
          JSON.stringify({ 
            active: false,
            message: "No subscription found for this session" 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      
      return new Response(
        JSON.stringify({
          active: subscription.status === 'active' || subscription.status === 'trialing',
          status: subscription.status,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          plan: subscription.items.data[0].price.product
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we have an email, find the customer and all subscriptions
    if (customer_email) {
      const customers = await stripe.customers.list({
        email: customer_email,
        limit: 1
      });
      
      if (customers.data.length === 0) {
        return new Response(
          JSON.stringify({ 
            active: false,
            message: "No customer found with this email" 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      customerId = customers.data[0].id;
      subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 5
      });
      
      if (subscriptions.data.length === 0) {
        return new Response(
          JSON.stringify({ 
            active: false,
            message: "No subscriptions found for this customer" 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Return the most recent subscription
      const latestSubscription = subscriptions.data[0];
      
      return new Response(
        JSON.stringify({
          active: latestSubscription.status === 'active' || latestSubscription.status === 'trialing',
          status: latestSubscription.status,
          trial_end: latestSubscription.trial_end ? new Date(latestSubscription.trial_end * 1000).toISOString() : null,
          trial_start: latestSubscription.trial_start ? new Date(latestSubscription.trial_start * 1000).toISOString() : null,
          current_period_end: new Date(latestSubscription.current_period_end * 1000).toISOString(),
          plan: latestSubscription.items.data[0].price.product
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid request parameters" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    console.error("Error checking trial status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
