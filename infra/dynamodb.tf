resource "aws_dynamodb_table" "qconcursos_audity" {
  name         = "${var.project_name}-audity"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "requestId"
  attribute {
    name = "requestId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "qconcursos_questions" {
  name         = "${var.project_name}-questions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
}
