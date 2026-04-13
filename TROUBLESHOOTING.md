# Troubleshooting - Problemas Comuns e Soluções

## A página no GitHub Pages não funciona

### Problema: Tela branca ou erro de carregamento

**Causa**: O código estava usando `process.env` que não funciona em navegadores.

**Solução**: 
1. Certifique-se de estar na branch mais recente com as correções
2. Edite o arquivo `index.html` e substitua as variáveis de configuração:

```javascript
window.APP_CONFIG = {
    GOOGLE_MAPS_API_KEY: 'SUA_CHAVE_AQUI',
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/SEU_ID/exec'
};
```

3. Faça commit e push das alterações
4. Aguarde alguns minutos para o GitHub Pages atualizar

### Problema: Mapa não carrega

**Verificações**:
1. ✅ API Key do Google Maps está correta?
2. ✅ APIs "Maps JavaScript API" e "Geocoding API" estão habilitadas?
3. ✅ Não há restrições de domínio incorretas na API Key?
4. ✅ Console do navegador (F12) mostra algum erro?

**Solução**:
- Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Verifique se sua API Key está ativa
- Remova restrições de HTTP referrer temporariamente para testar
- Verifique o console do navegador para erros específicos

### Problema: Dados não carregam do Google Sheets

**Verificações**:
1. ✅ URL do Apps Script está correta?
2. ✅ Deploy foi feito como "Web app"?
3. ✅ Permissão definida como "Anyone"?
4. ✅ Planilha tem os cabeçalhos corretos?

**Solução**:
- No Apps Script, faça um novo deploy
- Verifique se a URL termina com `/exec` (não `/dev`)
- Confirme os cabeçalhos da planilha:
  ```
  ID | Endereço | Descrição | Data | Latitude | Longitude | Foto | Status | DataCadastro
  ```

### Problema: Erro de CORS

**Sintoma**: Mensagem de erro sobre CORS no console

**Solução**:
- Verifique se o Apps Script está retornando headers CORS corretos
- O código já inclui `Content-Type: application/json` e headers CORS
- Certifique-se de usar método POST nas requisições

### Problema: Geocoding não funciona

**Verificações**:
1. ✅ Geocoding API está habilitada no Google Cloud?
2. ✅ API Key tem permissão para Geocoding?
3. ✅ Endereço digitado é válido?

**Solução**:
- Habilite a "Geocoding API" no Google Cloud Console
- Verifique quotas e billing da API Key

### Problema: Formulário não envia dados

**Verificações**:
1. ✅ Todos os campos obrigatórios estão preenchidos?
2. ✅ Coordenadas foram obtidas (clique no mapa ou geocode)?
3. ✅ Apps Script está recebendo as requisições?

**Solução**:
- Abra o console do navegador (F12)
- Verifique a aba Network para ver a requisição
- Confira os logs no Apps Script (Executions)

## Como Debugar

### 1. Abrir Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+J` (Windows/Linux) / `Cmd+Option+J` (Mac)
- Vá para a aba "Console"
- Recarregue a página e observe os erros

### 2. Verificar Network
- No DevTools, vá para a aba "Network"
- Filtre por "XHR" ou "Fetch"
- Tente enviar um formulário ou carregar dados
- Clique na requisição para ver detalhes

### 3. Logs do Apps Script
- Acesse [script.google.com](https://script.google.com/)
- Abra seu projeto
- Vá em "Executions" para ver logs de execução
- Adicione `Logger.log()` no código para debug

## Configuração Rápida para Testes

Se quiser testar rapidamente sem configurar tudo:

1. **Use dados mockados**: O app já inclui dados de exemplo no `script.js`
2. **Comente a chamada da API**: Deixe apenas os dados mockados
3. **Teste localmente**: Abra `index.html` diretamente no navegador

## Links Úteis

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Apps Script Guide](https://developers.google.com/apps-script/guides/web)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [CORS Debugging](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Precisa de Ajuda?

Se nenhum desses passos resolver:
1. Capture uma screenshot do erro no console
2. Verifique se todas as configurações estão corretas
3. Teste localmente primeiro
4. Consulte a documentação oficial
