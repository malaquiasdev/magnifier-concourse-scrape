variable "aws_region" {
  type    = string
  default = "sa-east-1"
}

variable "aws_profile" {
  type    = string
  default = "default"
}

variable "envi_bucket_root_path" {
  type = string
  default = "enviproglue-jqrts"
}

variable "project_name" {
  type = string
  default = "magnifier-concourse-scrape"
}

variable "lambda_qconcursos_prefix_name" {
  type = string
  default = "magnifier-scrape-qconcursos"
}