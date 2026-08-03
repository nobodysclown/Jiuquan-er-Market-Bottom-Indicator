#!/usr/bin/env node
// 下载数据:
//   1. 沪深300全收益指数 H00300 —— 中证指数公司官网 (日线, 2005 至今)
//   2. 万得偏债混合型基金指数 885003.WI —— 万得指数官网 windindices.com
//      (日线近1年 + 月度2016-08至今, 免费渠道仅此范围)
// 输出: data/h00300.json, data/885003.json  (格式: [{date:"YYYY-MM-DD", close: number}])
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
mkdirSync(DATA_DIR, { recursive: true });

const WIND_CIPHER = "10eaa3d990c05cefb3c7a7d55803bc9e"; // 885003.WI 在万得官网的 cipher

async function getJSON(url, timeoutMs = 60000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// csindex 返回的日期是 YYYYMMDD 字符串; 部分节假日被重复推送, 去重
function fetchCsi300TotalReturn() {
  const today = new Date();
  const end = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;
  return getJSON(
    `https://www.csindex.com.cn/csindex-home/perf/index-perf?indexCode=H00300&startDate=20050101&endDate=${end}`
  ).then((r) => {
    if (r.code !== "200" || !Array.isArray(r.data)) throw new Error("csindex 返回异常");
    const seen = new Set();
    const out = [];
    for (const d of r.data) {
      if (!d.tradeDate || d.close == null) continue;
      if (seen.has(d.tradeDate)) continue;
      seen.add(d.tradeDate);
      const t = d.tradeDate;
      out.push({ date: `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}`, close: Number(d.close) });
    }
    out.sort((a, b) => a.date.localeCompare(b.date));
    return out;
  });
}

function tsToDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 万得: 日线(近1年) + 月度(近10年), 合并后日线优先
async function fetchWind885003() {
  const [dailyRes, monthlyRes] = await Promise.all([
    getJSON(`https://indexapi.wind.com.cn/indicesWebsite/api/Kline?indexId=${WIND_CIPHER}&period=1Y&lan=cn`),
    getJSON(`https://indexapi.wind.com.cn/indicesWebsite/api/indexreturn2?indexid=${WIND_CIPHER}&lan=cn`),
  ]);

  const map = new Map();
  if (dailyRes.Success && dailyRes.Result && dailyRes.Result.data) {
    for (const k of dailyRes.Result.data) {
      const d = k.tradeDate;
      map.set(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, Number(k.close));
    }
  }
  if (monthlyRes.Success && monthlyRes.Result && monthlyRes.Result[0]) {
    const m = monthlyRes.Result[0];
    for (let i = 0; i < m.date.length; i++) {
      const date = tsToDate(m.date[i]);
      if (!map.has(date)) map.set(date, Number(m.close[i]));
    }
  }
  const out = [...map.entries()]
    .map(([date, close]) => ({ date, close }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

const [h00300, w885003] = await Promise.all([fetchCsi300TotalReturn(), fetchWind885003()]);

writeFileSync(join(DATA_DIR, "h00300.json"), JSON.stringify(h00300));
writeFileSync(join(DATA_DIR, "885003.json"), JSON.stringify(w885003));

console.log(`H00300  沪深300全收益: ${h00300.length} 条  ${h00300[0].date} ~ ${h00300.at(-1).date}`);
console.log(`885003.WI 偏债混合: ${w885003.length} 条  ${w885003[0].date} ~ ${w885003.at(-1).date}`);
