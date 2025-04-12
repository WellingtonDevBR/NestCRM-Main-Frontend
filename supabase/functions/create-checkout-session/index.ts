
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
    let currency = signupData.currency || "AUD"; // Default to AUD if not specified
    
    switch (planId) {
      case "starter":
        productId = "prod_S6teQSASB4q3me"; // Starter product ID
        
        // For the starter plan, we'll create a subscription with the post-trial price
        // and add a trial period
        const starterPrices = await stripe.prices.list({
          product: productId,
          active: true,
          unit_amount: 1990, // $19.90
          currency: currency.toLowerCase(),
          limit: 1
        });
        
        if (starterPrices.data.length > 0) {
          priceId = starterPrices.data[0].id;
          console.log("Found existing $19.90 price for starter plan:", priceId);
        } else {
          // If no price exists, create a new $19.90 price
          console.log("No existing price found for starter plan, creating a new one");
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: 1990, // $19.90
            currency: currency.toLowerCase(),
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
          currency: currency.toLowerCase(),
          limit: 1
        });
        
        if (growthPrices.data.length > 0) {
          priceId = growthPrices.data[0].id;
          console.log("Found existing price for growth plan:", priceId);
        } else {
          // If no price exists, create a new price
          console.log("No existing price found for growth plan, creating a new one");
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: 4900, // $49.00
            currency: currency.toLowerCase(),
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
          currency: currency.toLowerCase(),
          limit: 1
        });
        
        if (proPrices.data.length > 0) {
          priceId = proPrices.data[0].id;
          console.log("Found existing price for pro plan:", priceId);
        } else {
          // If no price exists, create a new price
          console.log("No existing price found for pro plan, creating a new one");
          const newPrice = await stripe.prices.create({
            product: productId,
            unit_amount: 14900, // $149.00
            currency: currency.toLowerCase(),
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
    console.log("Creating checkout session with:", { planId, priceId, productId, trialDays, currency });
    
    // Create metadata to identify the user after successful payment
    const metadata = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      companyName: signupData.companyName,
      subdomain: signupData.subdomain,
      planId: planId,
      productId: productId,
      currency: currency
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
        trial_period_days: trialDays,
        // Add metadata that can be used for email notifications
        metadata: {
          trial_end_notification_sent: "false"
        }
      },
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: metadata,
      currency: currency.toLowerCase(),
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
