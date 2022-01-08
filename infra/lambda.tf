resource "null_resource" "lambda_build_run" {
  triggers = {
    functions_folder = "${data.archive_file.functions_artefact.output_sha}"
  }
  provisioner "local-exec" {
    command = "yarn run build"
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
  s3_bucket = aws_s3_bucket.bucket_root.id
  s3_key = aws_s3_bucket_object.lambda_functions_bucket_object.key
  source_code_hash = data.archive_file.functions_artefact.output_base64sha256
  layers = [aws_lambda_layer_version.layer_components.arn]
}
