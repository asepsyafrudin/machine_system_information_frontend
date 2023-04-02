export const convertFileType = (fileTypeName) => {
  switch (fileTypeName) {
    case "application/vnd.ms-excel":
      return "excel-file";

    case "application/vnd.ms-powerpoint":
      return "excel-file";

    case "application/vnd.ms-word":
      return " word-file";

    default:
      return fileTypeName;
  }
};

export const convertFileName = (filename) => {
  let convert = "";
  if (filename) {
    convert = filename.split(".").slice(0, -1).join(".");
  }
  return convert;
};

export const getExtFileName = (filename) => {
  let convert = "";
  if (filename) {
    convert = filename.split(".").pop();
  }

  return convert;
};
