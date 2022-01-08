resource "aws_s3_bucket" "bucket_root" {
  bucket = var.bucket_root_path
  acl = "private"
  force_destroy = true
}

resource "aws_s3_bucket_object" "layer_components_bucket_object" {
  bucket = aws_s3_bucket.bucket_root.id
  key = "${var.project_name}-layer"
  source = data.archive_file.layers_artefact.output_path
  etag = filemd5(data.archive_file.layers_artefact.output_path)
}

resource "aws_s3_bucket_object" "lambda_functions_bucket_object" {
  bucket = aws_s3_bucket.bucket_root.id
  key = "${var.project_name}-functions"
  source = data.archive_file.functions_artefact.output_path
  etag = filemd5(data.archive_file.functions_artefact.output_path)
}