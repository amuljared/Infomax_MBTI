// Google Apps Script — Google Sheets persistence backend.
//
// Setup:
//   1. Create a Google Sheet.
//   2. Extensions → Apps Script → paste this file's contents (delete the default code).
//   3. Save, then Deploy → New deployment → Web app:
//        - Execute as: Me
//        - Who has access: Anyone
//   4. Copy the "Web app URL" (ends in /exec) → set it as NEXT_PUBLIC_GOOGLE_SHEETS_URL.
//
// This binds to the spreadsheet it is created from (getActiveSpreadsheet).
// Each POST appends one row; a header row is auto-created on first submit.

const SHEET_NAME = "Responses";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Name", "Group Color", "Result", "Nickname", "Description", "Answers", "Tallies"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e8eaed");
      sheet.setFrozenRows(1);
    }
    const answers = (data.answers || []).map((a) => "Q" + a.id + ":" + a.choice).join(", ");
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.groupColor || "",
      data.result || "",
      data.nickname || "",
      data.description || "",
      answers,
      JSON.stringify(data.tallies || {}),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
