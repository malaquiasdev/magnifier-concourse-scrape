data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_create_logs_cloudwatch" {
  statement {
    sid       = "AllowCreatingLogGroups"
    effect    = "Allow"
    resources = ["arn:aws:logs:*:*:*"]
    actions   = ["logs:CreateLogGroup"]
  }

  statement {
    sid       = "AllowWritingLogs"
    effect    = "Allow"
    resources = ["arn:aws:logs:*:*:log-group:/aws/lambda/*:*"]

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
  }
}

data "aws_iam_policy_document" "dynamodb_questions_table" {
  statement {
    sid       = "AllowWorkWithDynamodbQConcursosQuestionsTable"
    effect    = "Allow"
    resources = ["arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${var.project_name}-questions"]
    actions   = ["dynamodb:*"]
  }
}

data "aws_iam_policy_document" "dynamodb_audity_table" {
  statement {
    sid       = "AllowWorkWithDynamodbQConcursosAudityTable"
    effect    = "Allow"
    resources = ["arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${var.project_name}-audity"]
    actions   = ["dynamodb:*"]
  }
}

resource "aws_iam_role" "qconcursos_entrypoint" {
  name               = "${var.lambda_qconcursos_prefix_name}-entrypoint-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "create_logs" {
  name   = "${var.lambda_qconcursos_prefix_name}-cw-logs-policy"
  policy = data.aws_iam_policy_document.lambda_create_logs_cloudwatch.json
}

resource "aws_iam_policy" "dynamodb_audity" {
  name   = "${var.lambda_qconcursos_prefix_name}-dynamo-audity-table-policy"
  policy = data.aws_iam_policy_document.dynamodb_audity_table.json
}

resource "aws_iam_role_policy_attachment" "qconcursos_entrypoint_create_logs" {
  policy_arn = aws_iam_policy.create_logs.arn
  role       = aws_iam_role.qconcursos_entrypoint.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_entrypoint_dynamo_audity_table" {
  policy_arn = aws_iam_policy.dynamodb_audity.arn
  role       = aws_iam_role.qconcursos_entrypoint.name
}
