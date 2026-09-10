const SPREADSHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'RESPONSES';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'dashboard';
  if (action === 'dashboard') {
    return ContentService
      .createTextOutput(JSON.stringify(buildDashboardData()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const p = e.parameter || {};
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.appendRow([
        'Response_ID','Timestamp','Nama Kios','Lokasi','Lama Beroperasi','Kategori','Komoditas','Status',
        'Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10',
        'Competitor Follow','Competitor Name','Competitor Compare','Competitor Reason',
        'Biggest Obstacle','Desired Reward','Suggestion'
      ]);
    }

    const id = 'RSP-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random()*1000);
    sh.appendRow([
      id,new Date(),p.kios_name||'',p.location||'',p.operating_age||'',p.category||'',p.commodity||'',p.membership_status||'',
      p.q1||'',p.q2||'',p.q3||'',p.q4||'',p.q5||'',p.q6||'',p.q7||'',p.q8||'',p.q9||'',p.q10||'',
      p.competitor_follow||'',p.competitor_name||'',p.competitor_compare||'',p.competitor_reason||'',
      p.biggest_obstacle||'',p.desired_reward||'',p.suggestion||''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true,id:id})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function buildDashboardData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return {responses:[]};

  const values = sh.getDataRange().getValues();
  const h = values[0];
  const idx = {};
  h.forEach((x,i)=>idx[String(x).trim()]=i);

  const responses = values.slice(1).filter(r => r[idx['Nama Kios']] || r[idx['Response_ID']]).map(r => ({
    kios: r[idx['Nama Kios']] || '',
    lokasi: r[idx['Lokasi']] || '',
    kategori: r[idx['Kategori']] || '',
    komoditas: r[idx['Komoditas']] || '',
    status: r[idx['Status']] || '',
    q: ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10'].map(k => Number(r[idx[k]]) || 0),
    competitor: String(r[idx['Competitor Follow']] || '')
  }));
  return {updatedAt:new Date().toISOString(),responses:responses};
}