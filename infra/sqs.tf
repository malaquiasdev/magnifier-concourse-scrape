resource "aws_sqs_queue" "qconcursos_questions_ddl" {
  name                        = "${var.project_name}-qconcursos-questions-ddl"
  message_retention_seconds   = 86400
  visibility_timeout_seconds  = 43200
  fifo_queue                  = false
  content_based_deduplication = false
  max_message_size            = 262144
}

resource "aws_sqs_queue" "qconcursos_questions" {
  name                        = "${var.project_name}-qconcursos-questions"
  delay_seconds               = 900
  message_retention_seconds   = 86400
  visibility_timeout_seconds  = 43200
  fifo_queue                  = false
  content_based_deduplication = false
  max_message_size            = 262144
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.qconcursos_questions_ddl.arn,
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "qconcursos_answers_ddl" {
  name                        = "${var.project_name}-qconcursos-answers-ddl"
  message_retention_seconds   = 86400
  visibility_timeout_seconds  = 43200
  fifo_queue                  = false
  content_based_deduplication = false
  max_message_size            = 262144
}


resource "aws_sqs_queue" "qconcursos_answers" {
  name                        = "${var.project_name}-qconcursos-answers"
  delay_seconds               = 900
  message_retention_seconds   = 86400
  visibility_timeout_seconds  = 43200
  fifo_queue                  = false
  content_based_deduplication = false
  max_message_size            = 262144
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.qconcursos_answers_ddl.arn,
    maxReceiveCount     = 1
  })
}
