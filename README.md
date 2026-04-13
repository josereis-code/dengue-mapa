# Dengue Focus Mapping - README

## Visão Geral

O **Dengue Focus Mapping** é um sistema web para mapeamento e registro de focos de dengue. A aplicação permite que usuários visualizem focos existentes em um mapa interativo e cadastrem novos focos com informações detalhadas.

## Funcionalidades

### Principais Recursos
- 🗺️ **Mapa Interativo**: Visualização de focos de dengue no Google Maps
- 📍 **Geocoding**: Conversão automática de endereços em coordenadas
- ➕ **Cadastro de Focos**: Formulário completo para registrar novos focos
- 📊 **Estatísticas**: Painel com contadores de focos (total, ativos, resolvidos, hoje)
- 🔍 **Filtros**: Filtragem por status (ativos/resolvidos)
- ℹ️ **InfoWindows**: Detalhes completos ao clicar nos marcadores
- 📱 **Design Responsivo**: Funciona em desktop e dispositivos móveis
- ♿ **Acessibilidade**: Suporte a navegação por teclado e leitores de tela

### Melhorias Implementadas

#### Segurança e Configuração
- ✅ Chave da API do Google Maps configurável via variável de ambiente
- ✅ URL do Apps Script configurável
- ✅ Validação de dados no frontend e backend

#### Arquitetura e Código
- ✅ Lógica consolidada em módulo JavaScript (`script.js`)
- ✅ CSS organizado com variáveis e design system
- ✅ Tratamento de erros abrangente
- ✅ Uso de `async/await` para operações assíncronas
- ✅ Evitação de variáveis globais (padrão module)

#### Funcionalidades
- ✅ Formulário completo para cadastro de focos
- ✅ InfoWindows com detalhes dos marcadores
- ✅ Feedback visual (loading, sucesso, erro)
- ✅ Geocoding integrado
- ✅ Filtro por status
- ✅ Estatísticas em tempo real

#### UX/UI
- ✅ Cabeçalho e rodapé profissionais
- ✅ Layout responsivo (mobile-first)
- ✅ Modal moderno para formulários
- ✅ Animações suaves
- ✅ Cores semânticas para status

#### Backend (Apps Script)
- ✅ Validação de dados de entrada
- ✅ Tratamento de CORS adequado
- ✅ Padronização de respostas JSON
- ✅ Função `formatDate()` para consistência
- ✅ Logging de erros

## Estrutura do Projeto

```
/workspace
├── index.html          # Página principal
├── style.css           # Estilos completos
├── script.js           # Lógica da aplicação
├── apps-script.gs      # Backend Google Apps Script
├── CONFIG.md           # Guia de configuração
├── SETUP_GOOGLE_SHEETS.md  # Setup da planilha
└── README.md           # Este arquivo
```

## Configuração

### Pré-requisitos
1. Conta Google
2. API Key do Google Maps
3. Planilha Google Sheets
4. Google Apps Script

### Passo a Passo

#### 1. Obter API Key do Google Maps
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a "Maps JavaScript API" e "Geocoding API"
4. Gere uma API Key em "Credentials"

#### 2. Configurar Google Apps Script
1. Acesse [script.google.com](https://script.google.com/)
2. Crie um novo projeto
3. Copie o conteúdo de `apps-script.gs` para o editor
4. Salve o projeto

#### 3. Configurar Planilha Google Sheets
1. Crie uma nova planilha no Google Sheets
2. Na primeira linha, adicione os cabeçalhos:
   ```
   ID | Endereço | Descrição | Data | Latitude | Longitude | Foto | Status | DataCadastro
   ```
3. No Apps Script, associe a planilha criada

#### 4. Deploy do Apps Script
1. Clique em "Deploy" > "New deployment"
2. Selecione tipo "Web app"
3. Configure:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Clique em "Deploy"
5. Copie a URL gerada

#### 5. Configurar Aplicação Frontend
Edite `index.html` ou crie um arquivo `.env`:

```javascript
window.APP_CONFIG = {
    GOOGLE_MAPS_API_KEY: 'SUA_API_KEY_AQUI',
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec'
};
```

#### 6. Publicar no GitHub Pages
1. Faça push do código para um repositório GitHub
2. Vá em Settings > Pages
3. Selecione a branch `main` como source
4. Acesse o site publicado

## Uso da Aplicação

### Visualizar Focos
1. Abra a aplicação no navegador
2. O mapa carregará automaticamente com os focos existentes
3. Clique nos marcadores para ver detalhes

### Cadastrar Novo Foco
1. Clique em "Novo Foco"
2. Preencha o formulário:
   - **Endereço**: Digite o endereço completo
   - **Coordenadas**: Clique em "Obter Coordenadas" ou clique no mapa
   - **Descrição**: Descreva o foco encontrado
   - **Data**: Selecione a data do foco
   - **Foto** (opcional): URL da foto
   - **Status**: Ativo ou Resolvido
3. Clique em "Cadastrar Foco"

### Filtrar Resultados
- Use o seletor "Filtrar por status" para mostrar:
  - Todos os focos
  - Apenas ativos
  - Apenas resolvidos

### Atualizar Dados
- Clique em "Atualizar" para recarregar os dados do servidor

## Variáveis de Ambiente

Para usar variáveis de ambiente em produção:

```bash
# .env (não versionar este arquivo)
GOOGLE_MAPS_API_KEY=AIzaSy...
APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

No `index.html`, o código já está preparado para ler essas variáveis.

## Estrutura de Dados

### Foco (Objeto)
```json
{
  "id": 1,
  "endereco": "Rua Augusta, São Paulo",
  "descricao": "Água parada em pneus",
  "data": "2024-01-15",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "foto": "https://exemplo.com/foto.jpg",
  "status": "active",
  "dataCadastro": "2024-01-15T10:30:00Z"
}
```

### Status Possíveis
- `active`: Foco ativo, requer atenção
- `resolved`: Foco resolvido/tratado

## API Endpoints

### Listar Focos
```http
POST https://script.google.com/macros/s/SCRIPT_ID/exec
Content-Type: application/json

{
  "acao": "listar"
}
```

### Adicionar Foco
```http
POST https://script.google.com/macros/s/SCRIPT_ID/exec
Content-Type: application/json

{
  "acao": "adicionar",
  "endereco": "Rua Exemplo, 123",
  "descricao": "Descrição do foco",
  "data": "2024-01-15",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "foto": "https://...",
  "status": "active"
}
```

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapas**: Google Maps JavaScript API
- **Backend**: Google Apps Script
- **Armazenamento**: Google Sheets
- **Hospedagem**: GitHub Pages

## Boas Práticas Implementadas

1. **Código Modular**: Separação clara de responsabilidades
2. **Tratamento de Erros**: Try-catch em operações críticas
3. **Feedback ao Usuário**: Mensagens de loading, sucesso e erro
4. **Acessibilidade**: ARIA labels, navegação por teclado
5. **Responsividade**: Mobile-first approach
6. **Performance**: Carregamento assíncrono de scripts
7. **Segurança**: Validação de dados, sanitização básica
8. **Documentação**: JSDoc comments e README completo

## Melhorias Futuras Sugeridas

### Prioridade Alta
- [ ] Autenticação de usuários
- [ ] Upload direto de fotos (Google Drive)
- [ ] Edição de focos existentes
- [ ] Exclusão de focos

### Prioridade Média
- [ ] Clusterização de marcadores próximos
- [ ] Heatmap de densidade
- [ ] Exportação de dados (CSV, PDF)
- [ ] Notificações por email

### Prioridade Baixa
- [ ] Dashboard administrativo
- [ ] Relatórios e gráficos
- [ ] Integração com APIs públicas
- [ ] PWA (Progressive Web App)

## Solução de Problemas

### Mapa não carrega
- Verifique se a API Key está correta
- Confirme se a Maps JavaScript API está habilitada
- Verifique o console do navegador por erros

### Dados não aparecem
- Verifique a URL do Apps Script
- Confirme se a planilha está compartilhada corretamente
- Teste o endpoint manualmente

### Erro de CORS
- Verifique as configurações de deploy do Apps Script
- Confirme se "Who has access" está como "Anyone"

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto é destinado para fins educacionais.

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Nota**: Este é um projeto educacional para demonstrar integração entre Google Maps, Google Apps Script e GitHub Pages.
