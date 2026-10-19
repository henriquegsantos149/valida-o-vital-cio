// Segunda aba da esquerda para a direita; coluna B; linha 1 como cabeçalho.
function doGet(e) {
  function responder(dados) {
    return ContentService.createTextOutput(JSON.stringify(dados))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const email = String(e && e.parameter ? e.parameter.email || '' : '')
    .trim().toLowerCase();
  if (!email) return responder({ error: 'invalid_email' });
  try {
    const planilha = SpreadsheetApp.openById(
      '1hotexxzz-zhzHJhnY1dvQbJgZWUQnKnqSk_6ZfKMiQI'
    );
    const aba = planilha.getSheets()[1];
    if (!aba) return responder({ error: 'configuration' });
    const ultimaLinha = aba.getLastRow();
    if (ultimaLinha < 2) return responder({ found: false });
    const emails = aba.getRange(2, 2, ultimaLinha - 1, 1).getDisplayValues();
    const encontrado = emails.some(function (linha) {
      return String(linha[0]).trim().toLowerCase() === email;
    });
    return responder(encontrado ? {
      found: true,
      groupUrl: 'https://sndflw.com/i/QqsIe4Lyew4On6qkVv5o'
    } : { found: false });
  } catch (erro) {
    return responder({ error: 'service_unavailable' });
  }
}
