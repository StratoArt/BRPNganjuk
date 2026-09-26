const SPREADSHEET_ID = '1TUQ6J6f-QNlq69D6oX27m_h-he7mCiDmPXauX9fxvW4';
const SHEET_NAME = 'RESPONSES';

function doGet(e) {
  try {
    const action = e?.parameter?.action || 'dashboard';
    if (action === 'dashboard') return jsonOutput(getDashboardData());
    if (action === 'health') return jsonOutput({
      ok:true,
      message:'Bayer Rewards Plus API is running',
      spreadsheet:SPREADSHEET_ID,
      sheet:SHEET_NAME,
      timestamp:new Date()
    });
    return jsonOutput({ok:false,message:'Unknown action'});
  } catch (error) {
    return jsonOutput({ok:false,error:error.toString()});
  }
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const action = p.action || 'submit';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Sheet RESPONSES tidak ditemukan');

    if (action === 'update') {
      return jsonOutput(updateResponse(sheet, p));
    }

    if (action === 'submit') {
      const responseId = 'RSP-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 999);
      sheet.appendRow(buildRowFromParams(sheet, p, responseId, new Date()));
      SpreadsheetApp.flush();
      return jsonOutput({ok:true,response_id:responseId,message:'Response berhasil disimpan'});
    }

    return jsonOutput({ok:false,error:'Unknown POST action'});
  } catch(error) {
    return jsonOutput({ok:false,error:error.toString()});
  }
}

function updateResponse(sheet, p) {
  const responseId = String(p.response_id || '').trim();
  if (!responseId) throw new Error('response_id wajib diisi');

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) throw new Error('Belum ada data response');
  const headers = values[0].map(String);
  const idx = {};
  headers.forEach((h,i) => idx[h.trim()] = i);
  if (idx['Response_ID'] === undefined) throw new Error('Kolom Response_ID tidak ditemukan');

  let rowNumber = -1;
  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idx['Response_ID']] ?? '').trim() === responseId) {
      rowNumber = r + 1;
      break;
    }
  }
  if (rowNumber < 0) throw new Error('Response_ID tidak ditemukan: ' + responseId);

  const existing = values[rowNumber - 1];
  const updated = existing.slice();
  const map = {
    'Nama Kios / Toko':'kios',
    'Lokasi':'lokasi',
    'Lama Beroperasi':'operatingAge',
    'Kategori Kios':'kategori',
    'Komoditas Utama':'komoditas',
    'Komoditas Lainnya':'otherCommodity',
    'Status Rewards Plus':'status',
    'Q1':'Q1','Q2':'Q2','Q3':'Q3','Q4':'Q4','Q5':'Q5','Q6':'Q6','Q7':'Q7','Q8':'Q8','Q9':'Q9','Q10':'Q10',
    'Ikut Loyalty Kompetitor':'competitor',
    'Kompetitor':'competitorName',
    'Perbandingan':'competitorCompare',
    'Alasan Perbandingan':'competitorReason',
    'Kendala Utama':'obstacle',
    'Ekspektasi Hadiah':'desiredReward',
    'Saran':'suggestion'
  };
  Object.keys(map).forEach(header => {
    const key = map[header];
    if (idx[header] !== undefined && p[key] !== undefined) updated[idx[header]] = p[key];
  });
  // Keep original Response_ID and Timestamp stable.
  updated[idx['Response_ID']] = existing[idx['Response_ID']];
  if (idx['Timestamp'] !== undefined) updated[idx['Timestamp']] = existing[idx['Timestamp']];
  sheet.getRange(rowNumber, 1, 1, updated.length).setValues([updated]);
  SpreadsheetApp.flush();
  return {ok:true,response_id:responseId,message:'Response berhasil diperbarui'};
}

function buildRowFromParams(sheet, p, responseId, timestamp) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const data = {
    'Response_ID':responseId,
    'Timestamp':timestamp,
    'Nama Kios / Toko':p.kios || '',
    'Lokasi':p.lokasi || '',
    'Lama Beroperasi':p.operatingAge || '',
    'Kategori Kios':p.kategori || '',
    'Komoditas Utama':p.komoditas || '',
    'Komoditas Lainnya':p.otherCommodity || '',
    'Status Rewards Plus':p.status || '',
    'Q1':p.Q1 || '','Q2':p.Q2 || '','Q3':p.Q3 || '','Q4':p.Q4 || '','Q5':p.Q5 || '',
    'Q6':p.Q6 || '','Q7':p.Q7 || '','Q8':p.Q8 || '','Q9':p.Q9 || '','Q10':p.Q10 || '',
    'Ikut Loyalty Kompetitor':p.competitor || '',
    'Kompetitor':p.competitorName || '',
    'Perbandingan':p.competitorCompare || '',
    'Alasan Perbandingan':p.competitorReason || '',
    'Kendala Utama':p.obstacle || '',
    'Ekspektasi Hadiah':p.desiredReward || '',
    'Saran':p.suggestion || ''
  };
  return headers.map(h => data[h] !== undefined ? data[h] : '');
}

function getDashboardData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet RESPONSES tidak ditemukan');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return {ok:true,updatedAt:new Date(),total:0,responses:[]};

  const headers = values[0].map(String);
  const idx = {};
  headers.forEach((h,i)=>idx[h.trim()]=i);
  const value = (row,name) => idx[name]!==undefined ? row[idx[name]] : '';
  const numberValue = v => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const responses = values.slice(1)
    .filter(row => row.some(v => String(v ?? '').trim() !== ''))
    .map(row => ({
      id:value(row,'Response_ID'),
      timestamp:value(row,'Timestamp'),
      kios:value(row,'Nama Kios / Toko'),
      lokasi:value(row,'Lokasi'),
      operatingAge:value(row,'Lama Beroperasi'),
      kategori:value(row,'Kategori Kios'),
      komoditas:value(row,'Komoditas Utama'),
      otherCommodity:value(row,'Komoditas Lainnya'),
      status:value(row,'Status Rewards Plus'),
      q:['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10'].map(k=>numberValue(value(row,k))),
      competitor:value(row,'Ikut Loyalty Kompetitor'),
      competitorName:value(row,'Kompetitor'),
      competitorCompare:value(row,'Perbandingan'),
      competitorReason:value(row,'Alasan Perbandingan'),
      obstacle:value(row,'Kendala Utama'),
      desiredReward:value(row,'Ekspektasi Hadiah'),
      suggestion:value(row,'Saran')
    }));
  return {ok:true,updatedAt:new Date(),total:responses.length,responses:responses};
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
