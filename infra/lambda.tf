resource "null_resource" "lambda_build_run" {
  triggers = {
    functions_folder = ".././app/src/functions"
  }
  provisioner "local-exec" {
    working_dir = ".././app/src/functions"
    command     = "rm -rf node_modules && yarn install --production && npx typescript"
  }
}

resource "aws_lambda_function" "lambda_magnifier_scrape_qconcursos_questions_page" {
  function_name    = "${var.lambda_qconcursos_prefix_name}-questionspage"
  handler          = "./qconcrusos/questions/index.handler"
  description      = "Scrape the qconcursos questions page by filter url"
  runtime          = "nodejs14.x"
  timeout          = 900
  memory_size      = 1024
  role             = aws_iam_role.lambda_magnifier_scrape_qconcursos_questions_page_role.arn
  s3_bucket        = aws_s3_bucket.bucket_root.id
  s3_key           = aws_s3_bucket_object.lambda_functions_bucket_object.key
  source_code_hash = data.archive_file.functions_artefact.output_base64sha256
  layers           = [aws_lambda_layer_version.layer_components.arn]
  environment {
    variables = {
      TABLE_NAME          = "${var.project_name}-questions"
      QCONCURSOS_BASE_URL = "https://www.qconcursos.com"
    }
  }
}

resource "aws_lambda_function" "qconcursos_answers_page" {
  function_name    = "${var.lambda_qconcursos_prefix_name}-answerspage"
  handler          = "./qconcrusos/anwsers/index.handler"
  description      = "Scrape the qconcursos answers page by filter and question id"
  runtime          = "nodejs14.x"
  timeout          = 900
  memory_size      = 1024
  role             = aws_iam_role.lambda_magnifier_scrape_qconcursos_questions_page_role.arn
  s3_bucket        = aws_s3_bucket.bucket_root.id
  s3_key           = aws_s3_bucket_object.lambda_functions_bucket_object.key
  source_code_hash = data.archive_file.functions_artefact.output_base64sha256
  layers           = [aws_lambda_layer_version.layer_components.arn]
  environment {
    variables = {
      TABLE_NAME          = "${var.project_name}-questions"
      QCONCURSOS_BASE_URL = "https://www.qconcursos.com"
    }
  }
}

resource "aws_lambda_permission" "lambda_magnifier_scrape_qconcursos_questions_page_api" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:*/*"
}
