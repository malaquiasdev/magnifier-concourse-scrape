resource "aws_apigatewayv2_api" "this" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_magnifier_scrape_qconcursos_questions_page_invoke" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.invoke_arn
  timeout_milliseconds   = 5000
}

resource "aws_apigatewayv2_route" "qconcursos_questions" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /v1/qconcursos"
}

resource "aws_apigatewayv2_route" "qconcursos_questions_post" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /v1/qconcursos/questions"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_magnifier_scrape_qconcursos_questions_page_invoke.id}"

}
