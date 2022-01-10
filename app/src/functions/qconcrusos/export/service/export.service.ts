import { DynamoDB } from "aws-sdk";
import { convertRecordsToObject } from "../../../components/aws/dynamodb";
import { createFileS3 } from "../../../components/aws/s3";
import { CsvUtils } from "./export.csvutils";

export class ExportService {
  private dynamoDB: DynamoDB;

  constructor(dynamoDB: DynamoDB) {
    this.dynamoDB = dynamoDB;
  }

  public async parserDataToCsv(
    tableName: string,
    questionFilter: string
  ): Promise<string> {
    const data = [];
    let nextRun = null;
    const query = `SELECT * FROM "${tableName}" WHERE "filter" = '${questionFilter}'`;
    do {
      const { Items, NextToken } = await this.dynamoDB
        .executeStatement({ Statement: query, NextToken: nextRun })
        .promise();
      data.push(...Items);
      nextRun = NextToken;
    } while (nextRun);
    const questions = convertRecordsToObject(data);
    const csvUtils = new CsvUtils();
    const csv = await csvUtils.parseToCsv(
      questions.map((q) => csvUtils.flatObject(q))
    );
    await createFileS3({
      Bucket: "magnifier-concourse-scrape-jqrts/export/qconcursos",
      ACL: "public-read",
      Key: `questions.csv`,
      Body: csv,
      ContentType: "text/csv; charset=utf-8"
    });
    return "";
  }
}
