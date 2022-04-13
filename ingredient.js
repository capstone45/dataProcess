const fs = require("fs");
const iconv = require("iconv-lite");

const rawFile = fs.readFileSync("레시피+재료정보_20220209.csv");
let utf8Str = iconv.decode(rawFile, "euc-kr");

let idx = 0;
let line = "";
let ingredients = new Set();

// 중복 제거 재료 확보
while (idx < utf8Str.length) {
  if (utf8Str[idx] !== "\n") {
    line += utf8Str[idx];
  } else {
    ingredients.add(line.split(",")[2]);
    line = "";
  }
  idx++;
}

// 원본 csv의 header 제거
ingredients.delete("재료명");

// csv 데이터 생성
let string = "";
let pk = 1;
ingredients.forEach((ingredient) => {
  string += `${pk},${ingredient}\n`;
  pk++;
});

// csv 파일 생성
fs.writeFile("ingredients.csv", string, "utf8", () => {
  console.log("done");
});
