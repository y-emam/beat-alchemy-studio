
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const requestData: ContactRequest = await req.json();
    const { name, email, message } = requestData;

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Store the submission in the database
    const { data, error: insertError } = await supabaseClient
      .from('contact_submissions')
      .insert([{ name, email, message }]);

    if (insertError) {
      throw new Error(`Failed to store submission: ${insertError.message}`);
    }

    // Simple email sending using fetch to a webhook or email service
    // For a real implementation, you would use a service like SendGrid or Resend
    // Here we'll just log the email that would be sent
    console.log(`
      Would send email:
      To: wewibe8704@anlocc.com
      From: ${email}
      Subject: New Contact Form Submission from ${name}
      Body: 
      ${message}
    `);

    return new Response(
      JSON.stringify({ success: true, message: 'Contact submission received' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process contact submission' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
