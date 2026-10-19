/** Configure em Configurações do projeto > Propriedades do script:
 * SPREADSHEET_ID: ID da planilha nativa do Google Planilhas
 * Aba usada: Alunos
 * EMAIL_COLUMN: coluna de e-mails (A = 1, padrão)
 * FIRST_DATA_ROW: primeira linha com alunos (normalmente 2)
 * GROUP_URL: link do grupo, quando disponível
 */
function doGet(e) {
  function json(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var email = String(e && e.parameter && e.parameter.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ error: 'invalid_email' });
  }
  try {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('SPREADSHEET_ID');
    var name = 'Alunos';
    var column = Number(props.getProperty('EMAIL_COLUMN') || 1);
    var firstRow = Number(props.getProperty('FIRST_DATA_ROW') || 2);
    if (!name || !Number.isInteger(column) || column < 1 ||
        !Number.isInteger(firstRow) || firstRow < 1) {
      return json({ error: 'configuration' });
    }
    var spreadsheet = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) return json({ error: 'configuration' });
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet || column > sheet.getMaxColumns()) return json({ error: 'configuration' });
    var count = sheet.getLastRow() - firstRow + 1;
    var found = count > 0 && sheet.getRange(firstRow, column, count, 1)
      .getDisplayValues().some(function(row) {
        return String(row[0]).trim().toLowerCase() === email;
      });
    if (!found) return json({ found: false });
    var groupUrl = String(props.getProperty('GROUP_URL') || '').trim();
    if (groupUrl && !/^https:\/\/[^\s]+$/i.test(groupUrl)) return json({ error: 'configuration' });
    return json({ found: true, groupUrl: groupUrl || null });
  } catch (error) {
    return json({ error: 'service_unavailable' });
  }
}
