
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
    let subscription;
    let plan;
    let price;
    
    console.log(`Checking status with session_id: ${session_id || 'not provided'}, customer_email: ${customer_email || 'not provided'}`);
    
    // If we have a session ID, get the subscription from it
    if (session_id) {
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        console.log('Retrieved session:', {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription
        });
        
        if (!session.subscription) {
          return new Response(
            JSON.stringify({ 
              active: false,
              message: "No subscription found for this session" 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        
        customerId = subscription.customer;
        
        // Get price and product details
        if (subscription.items.data.length > 0) {
          const priceId = subscription.items.data[0].price.id;
          price = await stripe.prices.retrieve(priceId);
          
          if (price.product) {
            plan = await stripe.products.retrieve(price.product as string);
          }
        }
        
        console.log('Subscription details:', {
          id: subscription.id,
          status: subscription.status,
          customer: customerId,
          price_id: subscription.items.data[0]?.price.id,
          product_id: plan?.id
        });
        
        return new Response(
          JSON.stringify({
            active: subscription.status === 'active' || subscription.status === 'trialing',
            status: subscription.status,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            planId: plan?.metadata?.plan_id || '',
            subscription_id: subscription.id,
            customer_id: subscription.customer,
            price_id: subscription.items.data[0]?.price.id,
            product_id: plan?.id || '',
            amount: price?.unit_amount || 0,
            currency: price?.currency || 'aud',
            interval: price?.recurring?.interval || 'month'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error('Error retrieving session or subscription:', error);
        // If session retrieval fails, we'll continue to check by email if available
        if (!customer_email) {
          throw error;
        }
      }
    }
    
    // If we have an email, find the customer and all subscriptions
    if (customer_email) {
      console.log(`Searching for customer with email: ${customer_email}`);
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
      
      // Get the most recent subscription
      subscription = subscriptions.data[0];
      
      // Get price and product details
      if (subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price.id;
        price = await stripe.prices.retrieve(priceId);
        
        if (price.product) {
          plan = await stripe.products.retrieve(price.product as string);
        }
      }
      
      return new Response(
        JSON.stringify({
          active: subscription.status === 'active' || subscription.status === 'trialing',
          status: subscription.status,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          planId: plan?.metadata?.plan_id || '',
          subscription_id: subscription.id,
          customer_id: subscription.customer,
          price_id: subscription.items.data[0]?.price.id,
          product_id: plan?.id || '',
          amount: price?.unit_amount || 0,
          currency: price?.currency || 'aud',
          interval: price?.recurring?.interval || 'month'
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
