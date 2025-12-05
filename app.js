// --- 設定 --- //
const CSV_URL = "data/MULTI_TF_AI_SUMMARY.csv";

// 通貨ペア一覧（後から増やしても壊れない）
const symbols = [
  "EURUSD","USDJPY","GBPUSD","AUDUSD","USDCHF",
  "NZDUSD","USDCAD","EURJPY","GBPJPY","AUDJPY",
  "EURGBP","EURAUD","EURNZD","EURCAD","CADJPY",
  "CHFJPY","GBPCHF","AUDCHF","NZDJPY","AUDCAD"
];

// --- 初期化 --- //
document.addEventListener("DOMContentLoaded", () => {
  buildSymbolCards();
  loadCSV();
});

// --- カード生成 --- //
function buildSymbolCards() {
  const list = document.getElementById("symbolList");

  symbols.forEach(s => {
    const div = document.createElement("div");
    div.className = "symbol-card";
    div.dataset.symbol = s;
    div.innerHTML = `<strong>${s}</strong>`;
    div.onclick = () => setFocus(s);
    list.appendChild(div);
  });
}

// --- フォーカス切替 --- //
function setFocus(symbol) {
  document.querySelectorAll(".symbol-card").forEach(c => {
    c.classList.remove("active");
  });

  const card = [...document.querySelectorAll(".symbol-card")]
    .find(c => c.dataset.symbol === symbol);
  if (card) card.classList.add("active");

  document.getElementById("focusSymbol").textContent = symbol;

  // データが読み込まれていれば更新
  if (window.csvData) {
    updateFocus(symbol);
  }
}

// --- CSV 読み込み --- //
async function loadCSV() {
  try {
    const res = await fetch(CSV_URL + "?t=" + Date.now());
    const text = await res.text();

    window.csvData = parseCSV(text);

    document.getElementById("focusTime").textContent =
      "Updated: " + csvData[0].generated_time;

    const firstSymbol = csvData[0].symbol;
    setFocus(firstSymbol);
  } catch (e) {
    document.getElementById("focusTime").textContent =
      "CSV Read Error (Waiting...)";
  }
}

// --- CSV パース --- //
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const header = lines.shift().split(";");

  return lines.map(line => {
    const cols = line.split(";");
    let obj = {};
    header.forEach((h, i) => obj[h] = cols[i]);
    return obj;
  });
}

// --- フォーカス更新 --- //
function updateFocus(symbol) {
  const row = window.csvData.find(r => r.symbol === symbol);
  if (!row) return;

  const html = `
    <div><strong>D1:</strong> ${row.D1_bias}</div>
    <div><strong>H4:</strong> ${row.H4_bias}</div>
    <div><strong>H1:</strong> ${row.H1_bias}</div>
    <div><strong>M15:</strong> ${row.M15_bias}</div>
    <div style="margin-top:12px;">
      <strong>Score:</strong> ${row.confluence_score}
    </div>
  `;

  document.getElementById("focusContent").innerHTML = html;
}
