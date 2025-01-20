import * as Minio from "minio";
import config from "../config";
import { OthereStore } from '@/store/other/other';
import * as APIs from '@/api/index';

const minioClient = new Minio.Client(config.minio);

const convertMinioImage = (url: string) => {
    const othereStore = OthereStore();
    return new Promise((resolve) => {
        const imageCache = othereStore.getImageCache();
        if (imageCache.get(url)) {
            resolve(imageCache.get(url))
        } else {
            APIs.downloadImage({
                bucketName: "visix",
                objectName: encodeURIComponent(url),
            }).then((res) => {
                const regex = /^http:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)\/(.*)/;
                const match = res.data.match(regex);
                if (match) {
                    res.data = `${import.meta.env.VITE_MINIO_DOMAIN_PREFIX}/${match[3]}`
                }
                imageCache.set(url, res.data, 1000 * 60 * 20);
                resolve(imageCache.get(url))
            })
        }
    })
}

export { minioClient, convertMinioImage };
