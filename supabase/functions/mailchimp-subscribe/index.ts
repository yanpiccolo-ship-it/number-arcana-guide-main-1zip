import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  name: string;
  numerologyResult: number;
  archetypeResult: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, numerologyResult, archetypeResult }: SubscribeRequest = await req.json();

    // Create Supabase client to get settings
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch Mailchimp settings
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("setting_key, setting_value")
      .in("setting_key", [
        "mailchimp_api_key",
        "mailchimp_list_id",
        "mailchimp_server",
        "mailchimp_merge_fname",
        "mailchimp_merge_lpath",
        "mailchimp_merge_tarch",
      ]);

    if (settingsError || !settings) {
      console.error("Failed to fetch settings:", settingsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Mailchimp settings" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse settings into object
    const config: Record<string, string> = {};
    settings.forEach((s) => {
      config[s.setting_key] = s.setting_value;
    });

    const apiKey = config.mailchimp_api_key;
    const listId = config.mailchimp_list_id;
    const server = config.mailchimp_server;
    const mergeFname = config.mailchimp_merge_fname || "FNAME";
    const mergeLpath = config.mailchimp_merge_lpath || "LPATH";
    const mergeTarch = config.mailchimp_merge_tarch || "T_ARCH";

    // Check if Mailchimp is configured
    if (!apiKey || !listId || !server) {
      console.log("Mailchimp not configured, skipping subscription");
      return new Response(
        JSON.stringify({ message: "Mailchimp not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare merge fields
    const mergeFields: Record<string, string> = {
      [mergeFname]: name,
      [mergeLpath]: String(numerologyResult),
      [mergeTarch]: archetypeResult,
    };

    // Subscribe to Mailchimp
    const mailchimpUrl = `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`;
    const mailchimpResponse = await fetch(mailchimpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: mergeFields,
      }),
    });

    const mailchimpData = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      // Handle "already subscribed" case gracefully
      if (mailchimpData.title === "Member Exists") {
        console.log("Email already subscribed:", email);
        return new Response(
          JSON.stringify({ message: "Already subscribed" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Mailchimp error:", mailchimpData);
      throw new Error(mailchimpData.detail || "Mailchimp subscription failed");
    }

    console.log("Successfully subscribed:", email);
    return new Response(
      JSON.stringify({ success: true, message: "Subscribed successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in mailchimp-subscribe function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
