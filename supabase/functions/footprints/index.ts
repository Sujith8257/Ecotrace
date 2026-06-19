import { createClient } from 'npm:@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.10.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const firebaseProjectId = Deno.env.get('FIREBASE_PROJECT_ID') || 'ecotrace-e319e';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const jwks = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const getFirebaseUser = async (request: Request) => {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    throw new Error('Missing Firebase ID token.');
  }

  const { payload } = await jwtVerify(token, jwks, {
    issuer: `https://securetoken.google.com/${firebaseProjectId}`,
    audience: firebaseProjectId,
  });

  if (!payload.sub) {
    throw new Error('Firebase token is missing a user id.');
  }

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : null,
    displayName: typeof payload.name === 'string' ? payload.name : null,
    photoUrl: typeof payload.picture === 'string' ? payload.picture : null,
  };
};

const upsertProfile = async (firebaseUser: Awaited<ReturnType<typeof getFirebaseUser>>) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName,
        photo_url: firebaseUser.photoUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'firebase_uid' },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return json({ error: 'Supabase service role environment is not configured.' }, 500);
  }

  try {
    const firebaseUser = await getFirebaseUser(request);
    const body = await request.json();
    const action = body?.action;
    const payload = body?.payload || {};

    if (action === 'saveEstimate') {
      await upsertProfile(firebaseUser);

      const result = payload.result;
      const { data, error } = await supabase
        .from('footprint_estimates')
        .insert({
          firebase_uid: firebaseUser.uid,
          answers: payload.answers,
          result,
          selected_actions: payload.selectedActions || [],
          total_kg_co2e_month: Number.parseFloat(result?.total || '0'),
        })
        .select()
        .single();

      if (error) throw error;
      return json({ estimate: data });
    }

    if (action === 'listEstimates') {
      await upsertProfile(firebaseUser);

      const { data, error } = await supabase
        .from('footprint_estimates')
        .select('id, result, selected_actions, total_kg_co2e_month, created_at')
        .eq('firebase_uid', firebaseUser.uid)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return json({ estimates: data || [] });
    }

    return json({ error: 'Unknown footprint storage action.' }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Request failed.' }, 401);
  }
});
