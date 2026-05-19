// GoHighLevel client for the Slot 3 scorecard pipeline.
//
// Mirrors the steve-funnel-kit pattern (04-projects/steve-funnel-kit/src/lib/ghl.ts):
// PIT auth, GHL services.leadconnectorhq.com base, contacts/upsert + contacts/{id}/tags.
// The scorecard adds six new custom fields (Scorecard_Tier + four pillar scores +
// Scorecard_Weakest_Pillar) that the Phase 7b GHL Workflow uses to personalise
// email 2 ("the {weakestPillar} pattern…").

const GHL_API_URL = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

// Custom field IDs created via MCP on 2026-05-19, location XSTagpGfycjvto36M28p.
// These are stable across the lifetime of the GHL location. If you regenerate
// any field in GHL UI, update the ID here AND in the Workflow merge tokens.
export const GHL_FIELD_IDS = {
  scorecardTier: 'B1gu6IcYIVRRzGvdogPV',
  scorecardInclusion: 'x8ysO2xYtg9BzHNcxQwe',
  scorecardCounsel: 'U04jbScebdYJQ2Q5T4kn',
  scorecardMeasurement: '7qhZrBJPwFmL377IZjg9',
  scorecardArchitecture: 'TR1TxC4lCt0LoPueFa3V',
  scorecardWeakestPillar: 'rRhLM62mdi3LXvsF5hR9',
} as const;

function getHeaders(apiKey: string): Record<string, string> {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: GHL_API_VERSION,
  };
}

export type GHLCustomField = {
  id: string;
  field_value: string | number;
};

export type GHLContactPayload = {
  firstName?: string;
  lastName?: string;
  email: string;
  locationId: string;
  source?: string;
  customFields?: GHLCustomField[];
};

export type GHLUpsertResult =
  | { success: true; contactId: string; isDuplicate: boolean }
  | { success: false; error: string; statusCode?: number };

export async function upsertContact(
  payload: GHLContactPayload,
  apiKey: string,
): Promise<GHLUpsertResult> {
  try {
    const response = await fetch(`${GHL_API_URL}/contacts/upsert`, {
      method: 'POST',
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (response.ok) {
      const contact = data.contact as Record<string, unknown> | undefined;
      const contactId = contact?.id as string | undefined;
      if (!contactId) {
        return { success: false, error: 'GHL upsert returned no contactId' };
      }
      return { success: true, contactId, isDuplicate: false };
    }

    if (response.status === 400 || response.status === 409 || response.status === 422) {
      const meta = data.meta as Record<string, unknown> | undefined;
      const contactId = (meta?.contactId ?? meta?.id) as string | undefined;
      if (contactId) {
        return { success: true, contactId, isDuplicate: true };
      }
    }

    return {
      success: false,
      error: (data.message as string) || `GHL API error: ${response.status}`,
      statusCode: response.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Network error: ${message}` };
  }
}

export type GHLTagsResult =
  | { success: true }
  | { success: false; error: string; statusCode?: number };

export async function addContactTags(
  contactId: string,
  tags: string[],
  apiKey: string,
): Promise<GHLTagsResult> {
  try {
    const response = await fetch(`${GHL_API_URL}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: getHeaders(apiKey),
      body: JSON.stringify({ tags }),
    });
    if (response.ok) return { success: true };
    return {
      success: false,
      error: `Failed to add tags: ${response.status}`,
      statusCode: response.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Network error: ${message}` };
  }
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}
