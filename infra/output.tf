output "layers" {
  value = [{
    components = {
      arn         = aws_lambda_layer_version.layer_components.arn
      name        = aws_lambda_layer_version.layer_components.layer_name
      version     = aws_lambda_layer_version.layer_components.version
      description = aws_lambda_layer_version.layer_components.description
      created_at  = aws_lambda_layer_version.layer_components.created_date
    }
  }]
}

output "lambdas" {
  value = [{
    questionspage = {
      arn           = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.arn
      name          = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.function_name
      description   = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.description
      version       = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.version
      last_modified = aws_lambda_function.lambda_magnifier_scrape_qconcursos_questions_page.last_modified
    }
  }]
}
