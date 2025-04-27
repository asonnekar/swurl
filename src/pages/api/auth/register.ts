
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (data?.user?.identities?.length === 0) {
    return new Response(JSON.stringify({ error: "This email is already registered. Please sign in." }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};