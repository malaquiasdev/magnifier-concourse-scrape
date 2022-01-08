data "archive_file" "functions_artefact" {
  output_path = "files/functions.zip"
  type        = "zip"
  source_dir  = "${local.lambdas_path}"
}

data "archive_file" "layers_artefact" {
  output_path = "files/layers.zip"
  type        = "zip"
  source_dir  = "${local.layers_path}/components"

  depends_on = [null_resource.layer_install_dependencies]
}

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