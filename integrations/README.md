# Validação Black Friday

A página black usa somente e-mail. A base de alunos fica privada no Google Planilhas, nunca nos arquivos publicados do site.

## Configuração

1. Se o arquivo estiver no formato .xlsx, abra no Google Planilhas e use Arquivo > Salvar como Google Planilhas.
2. Na planilha nativa, abra Extensões > Apps Script e cole o conteúdo de black-friday.gs.
3. Em Configurações do projeto > Propriedades do script, cadastre:
   - SPREADSHEET_ID: ID da planilha nativa (trecho entre /d/ e /edit na URL). Pode ser omitido se o projeto foi aberto por Extensões > Apps Script na própria planilha.
   - A aba já está definida no código: Alunos.
   - EMAIL_COLUMN: 1, correspondente à coluna A (também é o padrão do código).
   - FIRST_DATA_ROW: 2 se a primeira linha for o cabeçalho, 1 se não houver cabeçalho.
   - GROUP_URL: deixe ausente até receber o link HTTPS do grupo.
4. Use Implantar > Nova implantação > Aplicativo da Web. Execute como o proprietário e permita acesso a qualquer pessoa, se sua conta permitir. Autorize o acesso à planilha. Não é necessário publicar a planilha.
5. Copie a URL terminada em /exec para APPS_SCRIPT_URL em black/script.js.
6. Publique novamente o site. Ao alterar o código do Apps Script, atualize a implantação para uma nova versão. Alterações nos alunos e nas propriedades não exigem uma nova versão do código.

## Comportamento

- Compara o endereço completo, ignorando maiúsculas e espaços nas extremidades.
- E-mail ausente mostra a tela de cadastro não encontrado.
- Falha no serviço mostra erro de consulta, sem afirmar que o aluno não existe.
- E-mail encontrado sem GROUP_URL confirma o cadastro e informa que o grupo estará disponível em breve.
- E-mail encontrado com GROUP_URL libera o botão Entrar no grupo.
- A formação não é solicitada e nenhum nome ou lista de e-mails é devolvido ao navegador.
- É uma consulta à lista de alunos, sem confirmação de propriedade do e-mail. O convite do grupo pode ser compartilhado por quem o recebe.

## Verificação após implantar

Teste um e-mail presente na base, um ausente, o presente com maiúsculas e espaços, e a ausência de GROUP_URL. Confirme que o convite aparece apenas após resposta positiva e que problemas de configuração não são exibidos como cadastro inexistente.

A implantação ainda depende de acesso ao Apps Script da conta proprietária. O ID fornecido com o anexo não foi presumido como ID de uma planilha nativa. Confirme também a aba e a coluna antes de configurar.

## Link do grupo da campanha

O destino configurado em GROUP_URL de black/script.js é https://sndflw.com/i/QqsIe4Lyew4On6qkVv5o. Ele tem prioridade sobre o destino retornado pelo Apps Script e só é liberado na interface após found: true. Não é necessário alterar a implantação para configurar esse destino no site.
