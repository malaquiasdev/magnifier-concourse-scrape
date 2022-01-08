resource "null_resource" "layer_install_dependencies" {
  triggers = {
    layer_build = filemd5("${local.layers_path}/components/nodejs/package.json")
  }

  provisioner "local-exec" {
    working_dir = "${local.layers_path}/components/nodejs/"
    command = "rm -rf node_modules && yarn install --production"
  }
}

resource "aws_lambda_layer_version" "layer_components" {
  layer_name = "${var.lambda_qconcursos_prefix_name}-components"
  description = "All functions libs installed here" 
  s3_bucket = aws_s3_bucket.bucket_root.id
  s3_key = aws_s3_bucket_object.layer_components_bucket_object.key
  source_code_hash = data.archive_file.layers_artefact.output_base64sha256
  compatible_runtimes = ["nodejs14.x"]
}