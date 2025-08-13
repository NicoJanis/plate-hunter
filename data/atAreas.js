// data/atAreas.js
export const STATES = [
  { id: "W",  name: "Wien",               codes: ["W"] },
  { id: "NÖ", name: "Niederösterreich",   codes: ["AM","BL","BN","GD","GF","HL","HO","KG","KO","KR","KS","LF","MD","ME","MI","NK","P","PL","SB","SW","TU","WN","WB","WT","WY","ZT"] },
  { id: "OÖ", name: "Oberösterreich",     codes: ["BR","EF","FR","GM","GR","KI","L","LL","PE","RI","RO","SD","SE","SR","UU","VB","WE", "WL"] },
  { id: "SBG",name: "Salzburg",            codes: ["S","SL","HA","TA","ZE", "JO"] },
  { id: "ST", name: "Steiermark",          codes: ["BA","BM","DL","G","GB", "GU","HB","HF","LB","LE","LI", "LN","MU","MT","SO","VO","WZ"] },
  { id: "T",  name: "Tirol",               codes: ["I", "IL","IM","KB","KU","LA","LZ","RE", "SZ"] },
  { id: "K",  name: "Kärnten",             codes: ["FE","HE","K","SP","SV","VK","VI","WO", "VL"] },
  { id: "V",  name: "Vorarlberg",          codes: ["B","BZ","DO","FK"] },
  { id: "B",  name: "Burgenland",          codes: ["E", "EU","GS","JE","MA","ND","OP","OW"] }
];

export const ALL_CODES = Array.from(new Set(STATES.flatMap(s => s.codes)));

export const STATE_SEALS = {
  "W":  require("../assets/seals/W.png"),
  "NÖ": require("../assets/seals/NOE.png"),
  "OÖ": require("../assets/seals/OOE.png"),
  "SBG":require("../assets/seals/SBG.png"),
  "ST": require("../assets/seals/ST.png"),
  "T":  require("../assets/seals/T.png"),
  "K":  require("../assets/seals/K.png"),
  "V":  require("../assets/seals/V.png"),
  "B":  require("../assets/seals/B.png"),
};
