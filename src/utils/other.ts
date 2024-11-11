const accreditTimeMap = {
    "1d": "1天",
    "3d": "3天",
    "7d": "7天",
    "10d": "10天",
    "30d": "30天",
    "60d": "60天",
    "120d": "120天",
    "1y": "1年",
    "2y": "2年",
    "3y": "3年",
    "10y": "10年",
    "999999y": "永久",
};

export const getAccreditTimeMap = accreditTimeMap;

export const formatAccreditTime = (row, column) => {
    return accreditTimeMap[row.accreditTime];
};

export class ImageCache {
    private cache: Map<string, { image: any; expiry: number }>;

    constructor() {
        this.cache = new Map(); // 使用 Map 来存储 URL 和图像及其过期时间
    }

    get(url) {
        const entry = this.cache.get(url);
        if (entry) {
            if (entry.expiry > Date.now()) {
                return entry.image;
            } else {
                this.cache.delete(url);
            }
        }
        return null;
    }

    set(url, image, expiry) {
        const expiryTime = Date.now() + expiry;
        this.cache.set(url, { image, expiry: expiryTime });
    }
}
