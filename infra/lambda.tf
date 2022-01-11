data "archive_file" "layers_artefact" {
  output_path = "files/layers.zip"
  type        = "zip"
  source_dir  = "${local.layers_path}/dependencies"
}

data "archive_file" "functions_artefact" {
  output_path = "files/functions.zip"
  type        = "zip"
  source_dir  = local.lambdas_path
}

resource "aws_lambda_layer_version" "dependencies" {
  layer_name          = "${var.lambda_qconcursos_prefix_name}-layer"
  description         = "All functions libs installed here"
  s3_bucket           = aws_s3_bucket.root.id
  s3_key              = aws_s3_bucket_object.lambda_layer.key
  source_code_hash    = data.archive_file.layers_artefact.output_base64sha256
  compatible_runtimes = ["nodejs14.x"]
}

resource "aws_lambda_function" "qconcursos_entrypoint" {
  function_name    = "${var.lambda_qconcursos_prefix_name}-entrypoint"
  handler          = "./domains/qconcrusos/entrypoint/entrypoint.handler"
  description      = "Validate the scrappe schedule and start the process calling questions function"
  runtime          = "nodejs14.x"
  timeout          = 30
  memory_size      = 1024
  role             = aws_iam_role.qconcursos_entrypoint.arn
  s3_bucket        = aws_s3_bucket.root.id
  s3_key           = aws_s3_bucket_object.lambda_functions.key
  source_code_hash = data.archive_file.functions_artefact.output_base64sha256
  layers           = [aws_lambda_layer_version.dependencies.arn]
  environment {
    variables = {
      AUDITY_TABLE_NAME = aws_dynamodb_table.qconcursos_audity.name
    }
  }
}
