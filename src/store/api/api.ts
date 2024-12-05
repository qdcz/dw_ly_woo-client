import { defineStore } from "pinia";

export const ApiStore = defineStore({
    id: "api",
    state: () => ({
        preprocessingLog: [],
        postprocessingLog: []
    }),
    actions: {
        GETLOGGERDATA() {
            return {
                preprocessingLog: this.preprocessingLog,
                postprocessingLog: this.postprocessingLog
            };
        },
        changeLoggerData(data: any) {
            const loggerData = JSON.parse(data);
            this.preprocessingLog = loggerData.preprocessingLogger || [];
            this.postprocessingLog = loggerData.postprocessingLogger || [];
        },
        clearLoggerData(logType: string) {
            if (logType === 'preprocessingLog') {
                this.preprocessingLog = [];
            } else if (logType === 'postprocessingLog') {
                this.postprocessingLog = [];
            } else {
                this.preprocessingLog = [];
                this.postprocessingLog = [];
            }
        }
    },
});
