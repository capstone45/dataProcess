const fs = require("fs");
const iconv = require("iconv-lite");

const rawFile = fs.readFileSync("레시피+기본정보_20220209.csv");
let utf8Str = iconv.decode(rawFile, "euc-kr");

let idx = 0;
let line = "";

let title = [];
let referenceUrl = "";
let description = [];
let thumbnailUrl = [];
let serving = [];
let userId = 1;

// 중복 제거 재료 확보
while (idx < utf8Str.length) {
  if (utf8Str[idx] !== "\n") {
    line += utf8Str[idx];
  } else {
    const splitted = line.split(",");
    title.push(splitted[1]);
    description.push(splitted[2]);
    thumbnailUrl.push(splitted[14]);
    serving.push(splitted[9]);
    line = "";
  }
  idx++;
}

// csv 데이터 생성
let string = "";
let pk = 1;
title.forEach((_) => {
  string += `${pk},${title[pk - 1]},${referenceUrl},${description[pk - 1]},${
    thumbnailUrl[pk - 1]
  },${serving[pk - 1]},${userId}\n`;
  pk++;
});

// csv 파일 생성
fs.writeFile("recipes.csv", string, "utf-8", () => {
  console.log("done");
});
