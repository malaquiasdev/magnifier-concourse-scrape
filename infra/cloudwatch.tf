resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.function_name}"
  retention_in_days = 3
}
