resource "aws_lambda_function" "lambda_magnifier_scrape_qconcursos_questions_page" {
  function_name    = "${var.lambda_qconcursos_prefix_name}-questionspage"
  handler          = "./dist/qconcursos/questions/index.handler"
  description      = "Scrape the qconcursos questions page by filter url"
  runtime          = "nodejs14.x"
  timeout          = 900
  memory_size      = 1024
  role             = aws_iam_role.lambda_magnifier_scrape_qconcursos_questions_page_role.arn
  source_code_hash = data.archive_file.functions_artefact.output_base64sha256
  layers = [aws_lambda_layer_version.layer_components.arn]
}
