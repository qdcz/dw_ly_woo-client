export default {
    minio: {
        endPoint: import.meta.env.VITE_MINIO_ENDPOINT,
        port: Number(import.meta.env.VITE_MINIO_PORT),
        useSSL: import.meta.env.VITE_MINIO_USE_SSL === 'true',
        accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY,
        secretKey: import.meta.env.VITE_MINIO_SECRET_KEY,
    },
};
