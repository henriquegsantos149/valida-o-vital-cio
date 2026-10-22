# Validação Black Friday

O site tem duas validações, cada uma em sua pasta, atendidas pelo mesmo Apps Script:

- /black/ (black/index.html e black/script.js): confere se o e-mail é de aluno (só a coluna B) e segue para /black/pos/, a vitrine com o grupo da Black Friday.
- /black/matricula/ (black/matricula/index.html e black/matricula/script.js): pergunta se é aluno de pós ou de extensão e confere o vínculo; pós segue para /black/matricula/pos/, com os checkouts de 70%, e extensão mostra o cashback.

Ao mexer em uma delas, não altere os arquivos da outra.

## Base

Planilha: 1hotexxzz-zhzHJhnY1dvQbJgZWUQnKnqSk_6ZfKMiQI.
Aba: Dados Alunos - Atualizado em 21/10/26 (terceira aba, localizada pelo nome).
E-mails: coluna B. Vínculo de pós: coluna E. Vínculo de extensão: coluna F, na mesma linha. Primeira linha: cabeçalho. A célula de vínculo deve conter o nome do curso; vazia significa sem vínculo.
A consulta compara e-mails completos ignorando maiúsculas e espaços nas extremidades.

## Implantação

Substitua todo o Código.gs no projeto Apps Script da Black Friday pelo conteúdo de black-friday.gs. Salve e atualize a implantação existente: Implantar > Gerenciar implantações > Editar > Nova versão > Implantar. Execute como proprietário com acesso para qualquer pessoa. Publique o site atualizado junto com o script. Sem o parâmetro tipo, o script só verifica o e-mail na coluna B e devolve o groupUrl (página /black/). Com tipo=pos ou tipo=extensao, exige o vínculo e devolve o tipo validado (página /black/matricula/).

## Caminhos

Aluno (/black/): busca B e segue para /black/pos/.
Pós (/black/matricula/): busca B e verifica o vínculo em E e segue para /black/matricula/pos/, com os cinco checkouts de 70% copiados do projeto Prova da Bolsa.
Extensão (/black/matricula/): busca B e verifica o vínculo em F e mostra cashback. O botão abre o WhatsApp comercial 5521982639824 (mesmo contato da Prova da Bolsa) com o e-mail consultado na mensagem, sem envio automático.
O site não armazena o e-mail nem o coloca na URL da página de pós.
A consulta verifica presença na lista, sem autenticar a propriedade do e-mail.

## Verificação

Em /black/, teste um e-mail presente na coluna B (deve seguir para /black/pos/) e um ausente. Em /black/matricula/, teste um endereço exclusivo de E selecionando pós e depois extensão (deve ser encontrado só em pós); repita com endereço exclusivo de F; teste ausente e falha de configuração. Confira o e-mail na mensagem do WhatsApp e os cinco destinos de matrícula.
