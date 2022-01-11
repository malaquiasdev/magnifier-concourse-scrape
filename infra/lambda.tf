data "archive_file" "layers_artefact" {
  output_path = "files/layers.zip"
  type        = "zip"
  source_dir  = "${local.layers_path}/dependencies"
}

resource "aws_lambda_layer_version" "this" {
  layer_name          = "${var.lambda_qconcursos_prefix_name}-layer"
  description         = "All functions libs installed here"
  s3_bucket           = aws_s3_bucket.root.id
  s3_key              = aws_s3_bucket_object.lambda_layer.key
  source_code_hash    = data.archive_file.layers_artefact.output_base64sha256
  compatible_runtimes = ["nodejs14.x"]
}
