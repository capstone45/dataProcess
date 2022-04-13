const fs = require("fs");
const iconv = require("iconv-lite");

function makeDictionary(file, type) {
  const first = type ? 0 : 1;
  const second = type ? 1 : 0;
  let idx = 0;
  let line = "";
  let dictionary = {};
  while (idx < file.length) {
    if (file[idx] !== "\n") {
      line += file[idx];
    } else {
      const splitted = line.split(",").map((chunk) => chunk.trim('"'));
      dictionary[splitted[first]] = splitted[second];
      line = "";
    }
    idx++;
  }
  return dictionary;
}

// 1. recipePk_old_new.csv를 불러온다
const file1 = fs.readFileSync("recipePk_old_new.csv");
const ufile1 = iconv.decode(file1, "euc-kr");
// 2. 옛날 id : 현재 id 사전을 만든다
const recipeDict = makeDictionary(ufile1, true);

// 6. 설명 id, 옛날 레시피 코드, 설명, 이미지url, 순서
const file2 = fs.readFileSync("레시피+과정정보_20220209.csv");
const ufile2 = iconv.decode(file2, "euc-kr");
let index = 0;
let line = "";
let string = "";
let pk = 1;
while (index < ufile2.length) {
  if (ufile2[index] !== "\n") {
    line += ufile2[index];
  } else {
    const splitted = line
      .match(/(?<data>[①②③④⑤⑥⑦⑧⑨⑩\[\]℃~!@#$%^&*\w:가-힇힌히힉\s\d()\/,%.]+)/g)
      .filter((chunk) => !(chunk === "," || chunk === ", "));

    const oldId = splitted[0];
    const order = splitted[1];
    if (recipeDict[oldId] !== undefined) {
      string += `${pk},${recipeDict[oldId]},${splitted[2]},${splitted[3]},${order}\n`;
      pk++;
    }
    line = "";
  }
  index++;
}

// csv 파일 생성
fs.writeFile("recipeDescription.csv", string, "utf-8", () => {
  console.log("done");
});
