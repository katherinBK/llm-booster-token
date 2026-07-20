import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Admin client — service_role never leaves Supabase servers
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { action, params } = await req.json();

    // -------------------------------------------------------
    // PUBLIC ACTION: Validate a kairo_ API Key (called by Node backend)
    // No JWT needed — the backend is trusted via its own env
    // -------------------------------------------------------
    if (action === "validate_kairo_key") {
      const { kairo_key } = params ?? {};
      if (!kairo_key) return jsonResponse({ error: "Missing kairo_key" }, 400);

      const { data, error } = await adminClient
        .from("api_keys")
        .select("id, user_id, provider_id, model_id, request_count, rtokens_generated")
        .eq("encrypted_key", kairo_key)
        .single();

      if (error || !data) return jsonResponse({ error: "Invalid API Key" }, 401);
      return jsonResponse({ data });
    }

    // -------------------------------------------------------
    // PROTECTED ACTIONS: Require user JWT
    // -------------------------------------------------------
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Missing or invalid Authorization header" }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await userClient.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const userId = user.id;

    switch (action) {
      case "list_keys": {
        const { data, error } = await adminClient
          .from("api_keys")
          .select("id, name, provider_id, model_id, created_at, last_used_at, request_count, rtokens_generated, encrypted_key")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) return jsonResponse({ error: error.message }, 400);
        return jsonResponse({ data });
      }

      case "create_key": {
        const { name, provider_id, model_id, encrypted_key } = params ?? {};
        if (!name || !provider_id || !model_id || !encrypted_key) {
          return jsonResponse({ error: "Missing required fields" }, 400);
        }
        const { data, error } = await adminClient
          .from("api_keys")
          .insert({ user_id: userId, name, provider_id, model_id, encrypted_key })
          .select()
          .single();
        if (error) return jsonResponse({ error: error.message }, 400);
        return jsonResponse({ data });
      }

      case "delete_key": {
        const { key_id } = params ?? {};
        if (!key_id) return jsonResponse({ error: "Missing key_id" }, 400);
        const { error } = await adminClient
          .from("api_keys")
          .delete()
          .eq("id", key_id)
          .eq("user_id", userId);
        if (error) return jsonResponse({ error: error.message }, 400);
        return jsonResponse({ success: true });
      }

      case "usage_stats": {
        const { data, error } = await adminClient
          .from("usage_logs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(params?.limit ?? 100);
        if (error) return jsonResponse({ error: error.message }, 400);

        const totalCost = data.reduce((s: number, r: any) => s + Number(r.cost_usd), 0);
        const totalSavings = data.reduce((s: number, r: any) => s + Number(r.savings_usd), 0);
        const totalTokensIn = data.reduce((s: number, r: any) => s + r.tokens_input, 0);
        const totalTokensOut = data.reduce((s: number, r: any) => s + r.tokens_output, 0);
        const totalRtokens = data.reduce((s: number, r: any) => s + r.rtokens_generated, 0);

        return jsonResponse({
          data: {
            logs: data,
            summary: { totalCost, totalSavings, totalTokensIn, totalTokensOut, totalRtokens, count: data.length },
          },
        });
      }

      case "log_usage": {
        const logEntry = params ?? {};
        const { error } = await adminClient
          .from("usage_logs")
          .insert({ user_id: userId, ...logEntry });
        if (error) return jsonResponse({ error: error.message }, 400);
        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err: any) {
    return jsonResponse({ error: err.message ?? "Internal server error" }, 500);
  }
});
