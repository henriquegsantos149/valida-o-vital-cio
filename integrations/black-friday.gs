// E-mail em B; vínculo com pós em E e extensão em F, na mesma linha.
// Vínculo confirmado quando a célula contém o nome do curso; vazio significa sem vínculo.
function doGet(e) {
  function responder(dados) {
    return ContentService.createTextOutput(JSON.stringify(Object.assign({ version: 'BF-2026-10-22-v3' }, dados)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.action === 'status') {
    return responder({ status: 'ok' });
  }
  const email = String(e && e.parameter ? e.parameter.email || '' : '')
    .trim().toLowerCase();
  if (!email) return responder({ error: 'invalid_email' });
  const tipo = String(e && e.parameter ? e.parameter.tipo || '' : '');
  if (tipo !== 'pos' && tipo !== 'extensao') return responder({ error: 'invalid_type' });
  try {
    const planilha = SpreadsheetApp.openById(
      '1hotexxzz-zhzHJhnY1dvQbJgZWUQnKnqSk_6ZfKMiQI'
    );
    const aba = planilha.getSheetByName('Dados Alunos - Atualizado em 21/10/26');
    if (!aba) return responder({ error: 'configuration' });
    const ultimaLinha = aba.getLastRow();
    if (ultimaLinha < 2) return responder({ found: false });
    const dados = aba.getRange(2, 2, ultimaLinha - 1, 5).getDisplayValues();
    const indiceVinculo = tipo === 'pos' ? 3 : 4;
    const encontrado = dados.some(function (linha) {
      const mesmoEmail = String(linha[0]).trim().toLowerCase() === email;
      const vinculo = String(linha[indiceVinculo]).trim().toLowerCase();
      return mesmoEmail && vinculo !== ''; 
    });
    return responder(encontrado ? {
      found: true,
      tipo: tipo
    } : { found: false });
  } catch (erro) {
    return responder({ error: 'service_unavailable' });
  }
}
