import * as Minio from "minio";
import config from "../config";

const minioClient = new Minio.Client(config.minio);

export { minioClient };
