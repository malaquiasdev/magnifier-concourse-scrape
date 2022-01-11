output "layers" {
  value = [{
    components = {
      arn         = aws_lambda_layer_version.dependencies.arn
      name        = aws_lambda_layer_version.dependencies.layer_name
      version     = aws_lambda_layer_version.dependencies.version
      description = aws_lambda_layer_version.dependencies.description
      created_at  = aws_lambda_layer_version.dependencies.created_date
    }
  }]
}

output "lambdas" {
  value = [{
    questionspage = {
      arn           = aws_lambda_function.qconcursos_entrypoint.arn
      name          = aws_lambda_function.qconcursos_entrypoint.function_name
      description   = aws_lambda_function.qconcursos_entrypoint.description
      version       = aws_lambda_function.qconcursos_entrypoint.version
      last_modified = aws_lambda_function.qconcursos_entrypoint.last_modified
    }
  }]
}

output "apigateway_url" {
  value = aws_apigatewayv2_stage.this.invoke_url
}
