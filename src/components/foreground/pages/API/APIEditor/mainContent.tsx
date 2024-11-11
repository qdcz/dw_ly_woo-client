import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { cn } from '@/utils/index';
import { API_METHOD, API_STEP } from '@/constants';
import APIs from '@/components/foreground/pages/API/APIs';
import { ElMessage } from 'element-plus';

import MonacoEditor from '@/components/monaco.vue';
import editorFuncBox from '@/components/editor-func-box/index.jsx';

export default defineComponent({
    name: "mainContent",
    components: {
        MonacoEditor,
        editorFuncBox
    },
    setup(props) {
        const route = useRoute();
        const loading = ref(true);
        const preprocessingLoading = ref(true);
        const preprocessingFunc = ref<string | null>(null);
        const APIInfo: any = ref({});

        const getMethodStyles = (method: string) => {
            const styles = {
                'GET': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-600 hover:bg-green-200 dark:hover:bg-green-800/50',
                'POST': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/50',
                'PUT': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-800/50',
                'DELETE': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-600 hover:bg-red-200 dark:hover:bg-red-800/50'
            };
            return styles[method] || styles['DELETE'];
        };

        const getStepStyles = (step: number) => {
            const styles = {
                0: "bg-green-500",
                1: "bg-blue-500",
                2: "bg-yellow-500",
                3: "bg-purple-500",
                4: "bg-red-500"
            };
            return styles[step] || styles[4];
        };

        const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
            ElMessage.success('已复制到剪贴板');
        };

        onMounted(() => {
            APIs._APIInfo({ id: route.query.id as string }).then((res: any) => {
                // console.log(res.data);
                if (res.code === 200) {
                    APIInfo.value = res.data;
                }
            }).finally(() => {
                loading.value = false;
            });

            APIs._GetAPIModuleHook({ apiId: route.query.id as string, hookType: 1 }).then((res: any) => {
                // console.log(res.data);
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        preprocessingFunc.value = res.data[0];
                    } else {
                        preprocessingFunc.value = null;
                    }
                }
            }).finally(() => {
                preprocessingLoading.value = false;
            });
        });

        return () => (
            <div class={cn(
                "text-gray-900 dark:text-gray-100 relative h-screen w-full",
            )}>
                <div class="p-4">
                    <div class="text-2xl font-bold">{APIInfo.value?.name}</div>
                    <div class="text-gray-600 dark:text-gray-400 mt-1 text-sm">{APIInfo.value?.description}</div>
                    <div class="flex items-center space-x-2 mt-2">
                        <div class={cn(
                            getMethodStyles(API_METHOD[APIInfo.value?.method]),
                            "rounded-[4px] py-1 px-2 cursor-pointer select-none inline-block",
                            "text-gray-600 dark:text-slate-50",
                            "font-[600]",
                            "transition-colors duration-300"
                        )}>{API_METHOD[APIInfo.value?.method]}</div>
                        <div class="text-gray-600 dark:text-slate-50 cursor-pointer relative group" onClick={() => copyToClipboard(`/visix/api/${APIInfo.value?.path}/${route.query.id}`)}>
                            <div>/visix/api/{APIInfo.value?.path}/{route.query.id}</div>
                            <div class={cn(
                                "absolute -bottom-1.5 left-0 w-0 h-[2px] animate-pulse",
                                "group-hover:w-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                                "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:100%_auto] animate-gradient"
                            )}></div>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600 dark:text-slate-50 text-sm">
                            <div class={cn(
                                "w-2 h-2 rounded-full",
                                getStepStyles(APIInfo.value.step)
                            )}></div>
                            {API_STEP[APIInfo.value.step]}
                        </div>
                    </div>

                    <div class="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-2">
                            <span>createdAt:</span>
                            <span>{new Date(APIInfo.value?.createdAt).toLocaleString()}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span>updatedAt:</span>
                            <span>{new Date(APIInfo.value?.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>


                    <div class="mt-8">
                        <div class="text-lg font-semibold mb-4">preprocessing</div>
                        <div class="relative w-full h-full">
                            {preprocessingLoading.value && (
                                <div class="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            <div class="flex flex-wrap gap-3 w-full h-full">
                                {preprocessingFunc.value != null ? (
                                    <editorFuncBox
                                        name={"preprocessing"}
                                        paramString="params, utils, plugin"
                                        class={cn(
                                            "w-full rounded-lg overflow-hidden",
                                            "border border-gray-200 dark:border-gray-700",
                                            "shadow-sm hover:shadow-md transition-shadow duration-300",
                                            "relative before:absolute before:inset-0",
                                            "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                                            "after:absolute after:inset-0",
                                            "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
                                            "before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-[2s] before:ease-in-out",
                                            "after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-[2s] after:ease-in-out after:delay-500"
                                        )}
                                    >
                                        <MonacoEditor
                                            initialValue={"preprocessingFunc.value"}
                                            initialLanguage="javascript"
                                            className={cn(
                                                "bpreprocessingEditor h-48",
                                                "bg-gray-50 dark:bg-black"
                                            )}
                                        />
                                    </editorFuncBox>
                                ) : (
                                    <div
                                        class={cn(
                                            "px-3 py-2 rounded-lg border border-dashed",
                                            "border-gray-300 dark:border-gray-600",
                                            "hover:border-blue-500 dark:hover:border-blue-400",
                                            "cursor-pointer transition-all duration-300",
                                            "flex items-center gap-2"
                                        )}
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span class="text-sm">添加前置节点</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div >


                {
                    loading.value && (
                        <div class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )
                }
            </div >
        );
    }
});
