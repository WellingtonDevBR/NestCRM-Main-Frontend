
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
    
    // Map plan IDs to Stripe product IDs and price IDs
    // These are example values - replace with your actual Stripe price IDs
    let priceId = "";
    let productId = "";
    
    switch (planId) {
      case "starter":
        // Free trial plan
        productId = "prod_S6teQSASB4q3me"; // Starter product ID
        return new Response(
          JSON.stringify({ url: null, free: true, productId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      case "growth":
        productId = "prod_S6tf3FcTLazhdW"; // Growth product ID
        priceId = "price_1PRAKYDhrZkw2ITzWw1OZshv"; // Updated with a real Stripe price ID
        break;
      case "pro":
        productId = "prod_S6tflZPV1ei1dL"; // Pro product ID
        priceId = "price_1PRAKkDhrZkw2ITzoRuMiAWF"; // Updated with a real Stripe price ID
        break;
      default:
        throw new Error("Invalid plan selected");
    }
    
    // Add extra logging for debugging
    console.log("Creating checkout session with:", { planId, priceId, productId });
    
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
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: metadata,
    });

    console.log("Checkout session created:", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ url: session.url, productId }),
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
