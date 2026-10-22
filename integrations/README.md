# Validação Black Friday

## Base

Planilha: 1hotexxzz-zhzHJhnY1dvQbJgZWUQnKnqSk_6ZfKMiQI.
Aba: Dados Alunos - Atualizado em 21/10/26 (terceira aba, localizada pelo nome).
E-mails: coluna B. Vínculo de pós: coluna E. Vínculo de extensão: coluna F, na mesma linha. Primeira linha: cabeçalho. A célula de vínculo deve conter o nome do curso; vazia significa sem vínculo.
A consulta compara e-mails completos ignorando maiúsculas e espaços nas extremidades.

## Implantação

Substitua todo o Código.gs no projeto Apps Script da Black Friday pelo conteúdo de black-friday.gs. Salve e atualize a implantação existente: Implantar > Gerenciar implantações > Editar > Nova versão > Implantar. Execute como proprietário com acesso para qualquer pessoa. Publique o site atualizado junto com o script: o contrato agora exige tipo=pos ou tipo=extensao e retorna o tipo validado.

## Caminhos

Pós: busca B e verifica o vínculo em E e segue para /black/pos/, com os cinco checkouts de 70% copiados do projeto Prova da Bolsa.
Extensão: busca B e verifica o vínculo em F e mostra cashback. O botão abre o WhatsApp comercial 5521982639824 (mesmo contato da Prova da Bolsa) com o e-mail consultado na mensagem, sem envio automático.
O site não armazena o e-mail nem o coloca na URL da página de pós.
A consulta verifica presença na lista, sem autenticar a propriedade do e-mail.

## Verificação

Teste um endereço exclusivo de E selecionando pós e depois extensão (deve ser encontrado só em pós); repita com endereço exclusivo de F; teste ausente e falha de configuração. Confira o e-mail na mensagem do WhatsApp e os cinco destinos de matrícula.
