resource "aws_cloudwatch_log_group" "qconcursos_entrypoint" {
  name              = "/aws/lambda/${aws_lambda_function.qconcursos_entrypoint.function_name}"
  retention_in_days = 3
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/api_gw/${aws_apigatewayv2_api.this.name}"
  retention_in_days = 3
}
