
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
    const { planId, signupData } = await req.json();
    
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Add debug logging
    console.log("Received request with planId:", planId);
    console.log("Processing signup data for:", signupData.email);
    
    // Map plan IDs to Stripe product IDs and price IDs
    let priceId = "";
    let productId = "";
    let trialDays = 0;
    
    switch (planId) {
      case "starter":
        productId = "prod_S6teQSASB4q3me"; // Starter product ID
        // For the free plan, we'll still create a Stripe subscription with a $0 price
        // and a trial period
        
        // Find or create a $0 price for the starter plan
        const starterPrices = await stripe.prices.list({
          product: productId,
          active: true,
          unit_amount: 0, // $0
          limit: 1
        });
        
        if (starterPrices.data.length > 0) {
          priceId = starterPrices.data[0].id;
          console.log("Found existing free price for starter plan:", priceId);
        } else {
          // If no price exists, create a new $0 price
          console.log("No existing price found for starter plan, creating a new one");
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: 0, // $0.00
            currency: 'usd',
            recurring: { interval: 'month' }
          });
          priceId = newPrice.id;
          console.log("Created new price for starter plan:", priceId);
        }
        trialDays = 14;
        break;
      case "growth":
        productId = "prod_S6tf3FcTLazhdW"; // Growth product ID
        
        // Use Stripe's Price API to find an existing price for this product
        const growthPrices = await stripe.prices.list({
          product: productId,
          active: true,
          limit: 1
        });
        
        if (growthPrices.data.length > 0) {
          priceId = growthPrices.data[0].id;
          console.log("Found existing price for growth plan:", priceId);
        } else {
          // If no price exists, create a new test price
          console.log("No existing price found for growth plan, creating a new one");
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: 4900, // $49.00
            currency: 'usd',
            recurring: { interval: 'month' }
          });
          priceId = newPrice.id;
          console.log("Created new price for growth plan:", priceId);
        }
        trialDays = 14;
        break;
      case "pro":
        productId = "prod_S6tflZPV1ei1dL"; // Pro product ID
        
        // Use Stripe's Price API to find an existing price for this product
        const proPrices = await stripe.prices.list({
          product: productId,
          active: true,
          limit: 1
        });
        
        if (proPrices.data.length > 0) {
          priceId = proPrices.data[0].id;
          console.log("Found existing price for pro plan:", priceId);
        } else {
          // If no price exists, create a new test price
          console.log("No existing price found for pro plan, creating a new one");
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: 14900, // $149.00
            currency: 'usd',
            recurring: { interval: 'month' }
          });
          priceId = newPrice.id;
          console.log("Created new price for pro plan:", priceId);
        }
        trialDays = 14;
        break;
      default:
        throw new Error("Invalid plan selected");
    }
    
    // Add extra logging for debugging
    console.log("Creating checkout session with:", { planId, priceId, productId, trialDays });
    
    // Create metadata to identify the user after successful payment
    const metadata = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      companyName: signupData.companyName,
      subdomain: signupData.subdomain,
      planId: planId,
      productId: productId
    };
    
    // Create a checkout session with trial period
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: trialDays
      },
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: metadata,
    });

    console.log("Checkout session created:", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
