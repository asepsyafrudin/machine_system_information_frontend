import { convertFileName } from "./fileType";

export const fileName = (name) => {
  if (name !== "") {
    const fileNameWithoutExtention = convertFileName(name);
    const nameLength = fileNameWithoutExtention.length;
    const indexStartRemove = nameLength - 14;

    let newName = "";
    for (let index = 0; index < fileNameWithoutExtention.length; index++) {
      if (index < indexStartRemove) {
        newName += fileNameWithoutExtention.charAt(index);
      }
    }

    return newName;
  }
};
