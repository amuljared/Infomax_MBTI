/**
 * Google Sheets persistence — saves each completed response to a Google Sheet
 * via a Google Apps Script Web App endpoint (no Supabase required).
 *
 * The Apps Script `doPost(e)` appends one row per submission. We POST with
 * `mode: "no-cors"` and `Content-Type: text/plain` so the browser sends a
 * "simple" request (no preflight) — Apps Script then parses the JSON body
 * itself. The row is written server-side regardless of CORS; `no-cors` keeps
 * the client from throwing on the (opaque) response.
 */

export interface ResponseRow {
  answers: { id: number; dimension: string; choice: string }[];
  result: string;
  nickname: string;
  description: string;
  tallies: Record<string, number>;
  name: string;
  groupColor: string;
}

const SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

/**
 * Append a completed response to the Google Sheet.
 * Returns { ok, error }. With `no-cors` we cannot read the server's response,
 * so a successful send reports ok=true (fire-and-forget).
 */
export async function saveResponse(
  row: ResponseRow
): Promise<{ ok: boolean; error: string | null }> {
  if (!SHEETS_URL) {
    return { ok: false, error: "Google Sheets is not configured." };
  }

  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(row),
    });
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
