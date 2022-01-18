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
      AUDITY_TABLE_NAME  = aws_dynamodb_table.qconcursos_audity.name
      NEXT_LAMBDA_INVOKE = aws_lambda_function.qconcursos_question.function_name
    }
  }
}

resource "aws_lambda_function" "qconcursos_question" {
  function_name    = "${var.lambda_qconcursos_prefix_name}-question"
  handler          = "./domains/qconcrusos/question/question.handler"
  description      = ""
  runtime          = "nodejs14.x"
  timeout          = 200
  memory_size      = 1024
  role             = aws_iam_role.qconcursos_question.arn
  s3_bucket        = aws_s3_bucket.root.id
  s3_key           = aws_s3_bucket_object.lambda_functions.key
  source_code_hash = data.archive_file.functions_artefact.output_base64sha256
  layers           = [aws_lambda_layer_version.dependencies.arn]
  environment {
    variables = {
      AWS_QUEUE_URL       = aws_sqs_queue.qconcursos_questions.id
      AUDITY_TABLE_NAME   = aws_dynamodb_table.qconcursos_audity.name
      QUESTION_TABLE_NAME = aws_dynamodb_table.qconcursos_questions.name
    }
  }
}

resource "aws_lambda_event_source_mapping" "qconcursos_questions_sqs_queue" {
  event_source_arn = aws_sqs_queue.qconcursos_questions.arn
  function_name    = aws_lambda_function.qconcursos_question.function_name
  enabled          = true
  depends_on = [
    aws_iam_role.qconcursos_question
  ]
}
