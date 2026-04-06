function doGet(e) {
  return HtmlService.createHtmlOutput("API para Mapeamento de Dengue");
}

function adicionarFoco(endereco, descricao, data, latitude, longitude, foto_url) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var novaLinha = lastRow + 1;
  
  sheet.getRange(novaLinha, 1).setValue(novaLinha - 1); // ID
  sheet.getRange(novaLinha, 2).setValue(endereco);
  sheet.getRange(novaLinha, 3).setValue(descricao);
  sheet.getRange(novaLinha, 4).setValue(data);
  sheet.getRange(novaLinha, 5).setValue(latitude);
  sheet.getRange(novaLinha, 6).setValue(longitude);
  sheet.getRange(novaLinha, 7).setValue(foto_url);
  sheet.getRange(novaLinha, 8).setValue(new Date());
  
  return {sucesso: true, mensagem: "Foco adicionado com sucesso!", id: novaLinha - 1};
}

function obterFocos() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var dados = sheet.getDataRange().getValues();
  var focos = [];
  
  for (var i = 1; i < dados.length; i++) {
    focos.push({
      id: dados[i][0],
      endereco: dados[i][1],
      descricao: dados[i][2],
      data: dados[i][3],
      latitude: dados[i][4],
      longitude: dados[i][5],
      foto: dados[i][6],
      dataCadastro: dados[i][7]
    });
  }
  
  return focos;
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var acao = params.acao;
    
    if (acao === 'adicionar') {
      return ContentService.createTextOutput(JSON.stringify(
        adicionarFoco(params.endereco, params.descricao, params.data, params.latitude, params.longitude, params.foto)
      )).setMimeType(ContentService.MimeType.JSON);
    } else if (acao === 'listar') {
      return ContentService.createTextOutput(JSON.stringify({focos: obterFocos()})).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(erro) {
    return ContentService.createTextOutput(JSON.stringify({sucesso: false, erro: erro.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}