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

data "aws_iam_policy_document" "lambda_invoke" {
  statement {
    sid       = "AllowWorToInvokeLambda"
    effect    = "Allow"
    resources = ["arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:*"]
    actions   = ["lambda:InvokeFunction"]
  }
}

data "aws_iam_policy_document" "qconcursos_questions_ddl" {
  statement {
    effect    = "Allow"
    resources = [aws_sqs_queue.qconcursos_questions_ddl.arn]
    actions   = ["sqs:*"]
  }
}

data "aws_iam_policy_document" "qconcursos_answers_ddl" {
  statement {
    effect    = "Allow"
    resources = [aws_sqs_queue.qconcursos_answers_ddl.arn]
    actions   = ["sqs:*"]
  }
}

data "aws_iam_policy_document" "qconcursos_questions" {
  statement {
    effect    = "Allow"
    resources = [aws_sqs_queue.qconcursos_questions.arn]
    actions   = ["sqs:*"]
  }
}

data "aws_iam_policy_document" "qconcursos_answers" {
  statement {
    effect    = "Allow"
    resources = [aws_sqs_queue.qconcursos_answers.arn]
    actions   = ["sqs:*"]
  }
}

resource "aws_iam_role" "qconcursos_entrypoint" {
  name               = "${var.lambda_qconcursos_prefix_name}-entrypoint-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role" "qconcursos_question" {
  name               = "${var.lambda_qconcursos_prefix_name}-question-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role" "qconcursos_answer" {
  name               = "${var.lambda_qconcursos_prefix_name}-answer-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "create_logs" {
  name   = "${var.lambda_qconcursos_prefix_name}-cw-logs-policy"
  policy = data.aws_iam_policy_document.lambda_create_logs_cloudwatch.json
}

resource "aws_iam_policy" "qconcursos_question_invoke" {
  name   = "${var.lambda_qconcursos_prefix_name}-qconcursos_question_invoke"
  policy = data.aws_iam_policy_document.lambda_invoke.json
}

resource "aws_iam_policy" "qconcursos_answer_invoke" {
  name   = "${var.lambda_qconcursos_prefix_name}-qconcursos_answer_invoke"
  policy = data.aws_iam_policy_document.lambda_invoke.json
}

resource "aws_iam_policy" "dynamodb_audity" {
  name   = "${var.lambda_qconcursos_prefix_name}-dynamo-audity-table-policy"
  policy = data.aws_iam_policy_document.dynamodb_audity_table.json
}

resource "aws_iam_policy" "dynamodb_question" {
  name   = "${var.lambda_qconcursos_prefix_name}-dynamo-question-table-policy"
  policy = data.aws_iam_policy_document.dynamodb_questions_table.json
}

resource "aws_iam_policy" "qconcursos_question_sqs" {
  name   = "${var.lambda_qconcursos_prefix_name}-sqs-question-policy"
  policy = data.aws_iam_policy_document.qconcursos_questions.json
}

resource "aws_iam_policy" "qconcursos_answer_sqs" {
  name   = "${var.lambda_qconcursos_prefix_name}-sqs-answer-policy"
  policy = data.aws_iam_policy_document.qconcursos_answers.json
}

resource "aws_iam_role_policy_attachment" "qconcursos_entrypoint_create_logs" {
  policy_arn = aws_iam_policy.create_logs.arn
  role       = aws_iam_role.qconcursos_entrypoint.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_question_create_logs" {
  policy_arn = aws_iam_policy.create_logs.arn
  role       = aws_iam_role.qconcursos_question.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_answer_create_logs" {
  policy_arn = aws_iam_policy.create_logs.arn
  role       = aws_iam_role.qconcursos_answer.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_entrypoint_dynamo_audity_table" {
  policy_arn = aws_iam_policy.dynamodb_audity.arn
  role       = aws_iam_role.qconcursos_entrypoint.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_question_dynamo_audity_table" {
  policy_arn = aws_iam_policy.dynamodb_audity.arn
  role       = aws_iam_role.qconcursos_question.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_question_dynamo_question_table" {
  policy_arn = aws_iam_policy.dynamodb_question.arn
  role       = aws_iam_role.qconcursos_question.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_entrypoint_invoke_lambda" {
  policy_arn = aws_iam_policy.qconcursos_question_invoke.arn
  role       = aws_iam_role.qconcursos_entrypoint.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_question_invoke_lambda" {
  policy_arn = aws_iam_policy.qconcursos_answer_invoke.arn
  role       = aws_iam_role.qconcursos_answer.name
}

resource "aws_iam_role_policy_attachment" "qconcursos_question_sqs_queu" {
  policy_arn = aws_iam_policy.qconcursos_question_sqs.arn
  role       = aws_iam_role.qconcursos_question.name
}

resource "aws_sqs_queue_policy" "qconcursos_questions_ddl" {
  queue_url = aws_sqs_queue.qconcursos_questions_ddl.id
  policy    = data.aws_iam_policy_document.qconcursos_questions_ddl.json
}

resource "aws_sqs_queue_policy" "qconcuros_questions" {
  queue_url = aws_sqs_queue.qconcursos_questions_ddl.id
  policy    = data.aws_iam_policy_document.qconcursos_questions_ddl.json
}

resource "aws_iam_role_policy_attachment" "qconcursos_answer_sqs_queu" {
  policy_arn = aws_iam_policy.qconcursos_answer_sqs.arn
  role       = aws_iam_role.qconcursos_answer.name
}

resource "aws_sqs_queue_policy" "qconcursos_answer_ddl" {
  queue_url = aws_sqs_queue.qconcursos_answers_ddl.id
  policy    = data.aws_iam_policy_document.qconcursos_answers_ddl.json
}

resource "aws_sqs_queue_policy" "qconcuros_answer" {
  queue_url = aws_sqs_queue.qconcursos_answers_ddl.id
  policy    = data.aws_iam_policy_document.qconcursos_answers_ddl.json
}
