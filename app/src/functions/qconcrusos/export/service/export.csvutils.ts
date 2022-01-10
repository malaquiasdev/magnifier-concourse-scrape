import ObjectsToCsv from "objects-to-csv";

export class CsvUtils {
  constructor() {}

  public async parseToCsv(flatArray: object[]): Promise<string> {
    const csv = new ObjectsToCsv(flatArray);
    return csv.toString();
  }

  public flatObject(obj: object): {} {
    const flatObject = {};
    const path = [];
    function digIn(obj) {
      if (obj !== Object(obj)) {
        return (flatObject[path.join(".")] = obj);
      }
      for (let key in obj) {
        path.push(key);
        digIn(obj[key]);
        path.pop();
      }
    }
    digIn(obj);
    return flatObject;
  }
}
