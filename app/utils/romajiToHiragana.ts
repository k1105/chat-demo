// ローマ字からひらがなへの変換ルール
const romajiToHiraganaMap: {[key: string]: string} = {
  // 母音
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  // 子音 + 母音
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  sa: "さ",
  shi: "し",
  si: "し",
  su: "す",
  se: "せ",
  so: "そ",
  ta: "た",
  chi: "ち",
  ti: "ち",
  tsu: "つ",
  tu: "つ",
  te: "て",
  to: "と",
  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",
  ha: "は",
  hi: "ひ",
  fu: "ふ",
  hu: "ふ",
  he: "へ",
  ho: "ほ",
  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",
  ya: "や",
  yu: "ゆ",
  yo: "よ",
  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",
  wa: "わ",
  wo: "を",
  nn: "ん",
  // 小文字
  xa: "ぁ",
  xi: "ぃ",
  xu: "ぅ",
  xe: "ぇ",
  xo: "ぉ",
  xtsu: "っ",
  xtu: "っ",
  ltu: "っ",
  ltsu: "っ",
  // 濁音
  ga: "が",
  gi: "ぎ",
  gu: "ぐ",
  ge: "げ",
  go: "ご",
  za: "ざ",
  ji: "じ",
  zi: "じ",
  zu: "ず",
  ze: "ぜ",
  zo: "ぞ",
  da: "だ",
  di: "ぢ",
  du: "づ",
  de: "で",
  do: "ど",
  ba: "ば",
  bi: "び",
  bu: "ぶ",
  be: "べ",
  bo: "ぼ",
  // 半濁音
  pa: "ぱ",
  pi: "ぴ",
  pu: "ぷ",
  pe: "ぺ",
  po: "ぽ",
  // 拗音
  kya: "きゃ",
  kyu: "きゅ",
  kyo: "きょ",
  sha: "しゃ",
  sya: "しゃ",
  shu: "しゅ",
  syu: "しゅ",
  sho: "しょ",
  syo: "しょ",
  cha: "ちゃ",
  tya: "ちゃ",
  chu: "ちゅ",
  tyu: "ちゅ",
  cho: "ちょ",
  tyo: "ちょ",
  nya: "にゃ",
  nyu: "にゅ",
  nyo: "にょ",
  hya: "ひゃ",
  hyu: "ひゅ",
  hyo: "ひょ",
  mya: "みゃ",
  myu: "みゅ",
  myo: "みょ",
  rya: "りゃ",
  ryu: "りゅ",
  ryo: "りょ",
  gya: "ぎゃ",
  gyu: "ぎゅ",
  gyo: "ぎょ",
  ja: "じゃ",
  zya: "じゃ",
  ju: "じゅ",
  zyu: "じゅ",
  jo: "じょ",
  zyo: "じょ",
  bya: "びゃ",
  byu: "びゅ",
  byo: "びょ",
  pya: "ぴゃ",
  pyu: "ぴゅ",
  pyo: "ぴょ",
  // 記号
  "-": "ー",
  ".": "。",
  ",": "、",
  // 促音
  tte: "って",
  tta: "った",
  tto: "っと",
  tti: "っち",
  ttu: "っつ",
  kka: "っか",
  kki: "っき",
  kku: "っく",
  kke: "っけ",
  kko: "っこ",
  ssa: "っさ",
  sshi: "っし",
  ssu: "っす",
  sse: "っせ",
  sso: "っそ",
  ppa: "っぱ",
  ppi: "っぴ",
  ppu: "っぷ",
  ppe: "っぺ",
  ppo: "っぽ",
  gga: "っが",
  ggi: "っぎ",
  ggu: "っぐ",
  gge: "っげ",
  ggo: "っご",
  zza: "っざ",
  zzi: "っじ",
  zzu: "っず",
  zze: "っぜ",
  zzo: "っぞ",
  dda: "っだ",
  ddi: "っぢ",
  ddu: "っづ",
  dde: "っで",
  ddo: "っど",
  bba: "っば",
  bbi: "っび",
  bbu: "っぶ",
  bbe: "っべ",
  bbo: "っぼ",
};

// ローマ字のパターンを長い順にソート
const romajiPatterns = Object.keys(romajiToHiraganaMap).sort(
  (a, b) => b.length - a.length
);

export function convertRomajiToHiragana(text: string): string {
  let result = "";
  let i = 0;

  while (i < text.length) {
    let matched = false;

    // 長いパターンから順にマッチング
    for (const pattern of romajiPatterns) {
      if (text.startsWith(pattern, i)) {
        result += romajiToHiraganaMap[pattern];
        i += pattern.length;
        matched = true;
        break;
      }
    }

    // マッチしなかった場合はそのまま追加
    if (!matched) {
      // ひらがなの場合はそのまま追加
      if (/[\u3040-\u309F]/.test(text[i])) {
        result += text[i];
      } else {
        // アルファベットの場合は小文字に変換して追加
        result += text[i].toLowerCase();
      }
      i++;
    }
  }

  return result;
}
