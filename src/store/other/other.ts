import { ImageCache } from "@/utils";
import { defineStore } from "pinia";

export const OthereStore = defineStore({
    id: "other",
    state: () => ({
        imageCache: new ImageCache()
    }),
    actions: {
        getImageCache() {
            return this.imageCache;
        },
    },
});
