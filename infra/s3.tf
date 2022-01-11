resource "aws_s3_bucket" "root" {
  bucket        = var.bucket_root_path
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket_object" "lambda_layer" {
  bucket = aws_s3_bucket.root.id
  key    = "${var.project_name}-layer"
  source = data.archive_file.layers_artefact.output_path
  etag   = filemd5(data.archive_file.layers_artefact.output_path)
}
