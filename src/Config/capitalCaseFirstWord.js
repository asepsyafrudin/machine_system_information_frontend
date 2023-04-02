export function CapitalCaseFirstWord(word) {
  if (word) {
    let newWord = word
      .split(" ")
      .map((arr) => arr.charAt(0).toUpperCase() + arr.slice(1))
      .join(" ");

    return newWord;
  } else {
    return "";
  }
}
