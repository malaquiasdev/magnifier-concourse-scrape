import AWS from "aws-sdk";
import pino from "pino";

const s3 = new AWS.S3();
const logger = pino();

export async function createFileS3(
  object: AWS.S3.Types.PutObjectRequest
): Promise<boolean> {
  try {
    await s3.putObject(object).promise();
    return true;
  } catch (error) {
    logger.error(error, "Failed to create file in S3");
    return false;
  }
}
