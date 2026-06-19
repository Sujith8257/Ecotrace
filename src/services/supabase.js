const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const footprintsFunctionUrl =
  import.meta.env.VITE_FOOTPRINTS_FUNCTION_URL ||
  (supabaseUrl ? `${supabaseUrl}/functions/v1/footprints` : '');

export const isSupabaseConfigured = Boolean(footprintsFunctionUrl);

const callFootprintsApi = async ({ firebaseUser, action, payload = {} }) => {
  if (!firebaseUser) {
    throw new Error('Sign in with Google before accessing saved footprints.');
  }

  if (!footprintsFunctionUrl) {
    throw new Error('Supabase storage API is not configured.');
  }

  const idToken = await firebaseUser.getIdToken();
  const response = await fetch(footprintsFunctionUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Supabase storage request failed.');
  }

  return data;
};

export const saveFootprintEstimate = async ({ firebaseUser, answers, result, selectedActions }) => {
  const { estimate } = await callFootprintsApi({
    firebaseUser,
    action: 'saveEstimate',
    payload: {
      answers,
      result,
      selectedActions,
    },
  });

  return estimate;
};

export const getFootprintHistory = async (firebaseUser) => {
  const { estimates } = await callFootprintsApi({
    firebaseUser,
    action: 'listEstimates',
  });

  return estimates || [];
};
