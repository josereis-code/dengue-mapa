function doGet(e) {
  // Handle CORS preflight requests
  if (e.parameter && e.parameter.method === 'OPTIONS') {
    return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
  }
  
  // Serve HTML for GET requests (optional - for testing directly from Apps Script)
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Dengue Focus Mapping')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Adiciona um novo foco de dengue
 * @param {string} endereco - Endereço do foco
 * @param {string} descricao - Descrição do foco
 * @param {string} data - Data do foco (YYYY-MM-DD)
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {string} foto_url - URL da foto (opcional)
 * @param {string} status - Status do foco ('active' ou 'resolved')
 * @returns {Object} Resultado da operação
 */
function adicionarFoco(endereco, descricao, data, latitude, longitude, foto_url, status) {
  try {
    // Validação dos dados de entrada
    if (!endereco || !descricao || !data) {
      throw new Error('Campos obrigatórios faltando: endereco, descricao, data');
    }
    
    if (!latitude || !longitude) {
      throw new Error('Coordenadas (latitude e longitude) são obrigatórias');
    }
    
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    var novaLinha = lastRow + 1;
    
    // Define o status padrão como 'active' se não fornecido
    var statusFinal = status || 'active';
    
    sheet.getRange(novaLinha, 1).setValue(novaLinha - 1); // ID
    sheet.getRange(novaLinha, 2).setValue(endereco);
    sheet.getRange(novaLinha, 3).setValue(descricao);
    sheet.getRange(novaLinha, 4).setValue(data);
    sheet.getRange(novaLinha, 5).setValue(latitude);
    sheet.getRange(novaLinha, 6).setValue(longitude);
    sheet.getRange(novaLinha, 7).setValue(foto_url || '');
    sheet.getRange(novaLinha, 8).setValue(statusFinal);
    sheet.getRange(novaLinha, 9).setValue(new Date()); // Data de cadastro
    
    return {
      sucesso: true, 
      mensagem: "Foco adicionado com sucesso!", 
      id: novaLinha - 1
    };
  } catch (error) {
    return {
      sucesso: false, 
      erro: error.toString()
    };
  }
}

/**
 * Obtém todos os focos cadastrados
 * @returns {Array} Lista de focos
 */
function obterFocos() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var dados = sheet.getDataRange().getValues();
    var focos = [];
    
    // Começa do índice 1 para pular o cabeçalho
    for (var i = 1; i < dados.length; i++) {
      // Pula linhas vazias
      if (!dados[i][0] && !dados[i][1]) continue;
      
      focos.push({
        id: dados[i][0],
        endereco: dados[i][1],
        descricao: dados[i][2],
        data: formatDate(dados[i][3]),
        latitude: dados[i][4],
        longitude: dados[i][5],
        foto: dados[i][6],
        status: dados[i][7] || 'active',
        dataCadastro: formatDate(dados[i][8])
      });
    }
    
    return focos;
  } catch (error) {
    Logger.log('Erro ao obter focos: ' + error.toString());
    return [];
  }
}

/**
 * Formata data para string YYYY-MM-DD
 * @param {Date|String} date - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatDate(date) {
  if (!date) return '';
  
  if (typeof date === 'string') {
    return date;
  }
  
  try {
    var d = new Date(date);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  } catch (e) {
    return date.toString();
  }
}

/**
 * Handler para requisições POST
 * @param {Object} e - Evento da requisição
 * @returns {ContentOutput} Resposta JSON
 */
function doPost(e) {
  try {
    // Configurar CORS
    var output = ContentService.createTextOutput();
    
    // Parse dos dados da requisição
    var params;
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter;
    }
    
    var acao = params.acao;
    
    if (acao === 'adicionar') {
      var resultado = adicionarFoco(
        params.endereco,
        params.descricao,
        params.data,
        params.latitude,
        params.longitude,
        params.foto || params.foto_url,
        params.status
      );
      
      return ContentService.createTextOutput(JSON.stringify(resultado))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (acao === 'listar') {
      var focos = obterFocos();
      
      return ContentService.createTextOutput(JSON.stringify({
        sucesso: true,
        focos: focos
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (acao === 'atualizar') {
      // Implementação futura para atualização de focos
      return ContentService.createTextOutput(JSON.stringify({
        sucesso: false,
        erro: 'Funcionalidade não implementada'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        sucesso: false,
        erro: 'Ação desconhecida: ' + acao
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (erro) {
    Logger.log('Erro no doPost: ' + erro.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      sucesso: false, 
      erro: erro.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handler para requisições OPTIONS (CORS preflight)
 * @param {Object} e - Evento da requisição
 * @returns {ContentOutput} Resposta vazia
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}