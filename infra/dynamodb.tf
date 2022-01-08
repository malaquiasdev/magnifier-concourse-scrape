resource "aws_dynamodb_table" "dynamodb_questions_table" {
  name         = "${var.project_name}-questions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "questionId"
  attribute {
    name = "questionId"
    type = "S"
  }
}
