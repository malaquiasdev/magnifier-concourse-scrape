resource "aws_iam_role" "lambda_magnifier_scrape_qconcursos_questions_page_role" {
  name =  "${var.lambda_qconcursos_prefix_name}-questions-page-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "lambda_create_logs_policy" {
  name = "${var.project_name}-create-cw-logs-policy"
  policy = data.aws_iam_policy_document.lambda_create_logs_cloudwatch.json
}

resource "aws_iam_policy" "dynamodb_questions_table_policy" {
  name = "${var.project_name}-questions-table-policy"
  policy = data.aws_iam_policy_document.dynamodb_questions_table_doc.json
}

resource "aws_iam_role_policy_attachment" "lambda_magnifier_scrape_qconcursos_questions_page_attach" {
  policy_arn = aws_iam_policy.lambda_create_logs_policy.arn
  role = aws_iam_role.lambda_magnifier_scrape_qconcursos_questions_page_role.name
}

resource "aws_iam_role_policy_attachment" "lambda_magnifier_scrape_qconcursos_questions_table_attach" {
  policy_arn = aws_iam_policy.dynamodb_questions_table_policy.arn
  role = aws_iam_role.lambda_magnifier_scrape_qconcursos_questions_page_role.name
}