resource "aws_apigatewayv2_api" "this" {
  name          = var.project_name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "this" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.qconcursos_entrypoint.invoke_arn
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_route" "qconcursos" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /v1/qconcursos"
}

resource "aws_apigatewayv2_route" "qconcursos_entrypoint" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /v1/qconcursos/schedule"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
}
