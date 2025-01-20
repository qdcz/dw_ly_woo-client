import { defineComponent, nextTick, onMounted, ref } from 'vue';
import Sortable from 'sortablejs';
import { cn, convertMinioImage } from '@/utils/index';


import ServerMonitoring from './ServerMonitoring.tsx'
import DropDownMenu from './dropDownMenu.tsx';

import MultipleIcon from '@/components/foreground/icon/Mutilate';
import ExpansionIcon from '@/components/foreground/icon/Expansion';

import APIs from '../APIs';


export default defineComponent({
    name: "ProjectList",
    components: { ServerMonitoring, DropDownMenu, MultipleIcon, ExpansionIcon },
    setup() {
        const projectListSortable = ref<any>(null);
        const projectList = ref<Array<any>>([]);

        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);

        /**
         * api request
         */
        const getProject = async () => {
            const res: any = await APIs._ProjectList({
                page: currentPage.value,
                take: pageSize.value
            });
            projectList.value = res.data;
            projectList.value.forEach(async (item: any) => item.previewBanner = await convertMinioImage(item.banner));
            total.value = res.total;

            nextTick(() => {
                setTimeout(() => {
                    projectListSortable.value = Sortable.create(document.getElementById('ProjectList'), {
                        animation: 250,
                        handle: '.DataUnitDrag',
                        onEnd: () => {
                            if (projectListSortable.value.toArray().length > 1) {
                                // updateConfirmDialogStatus(true, "Tip", "Are you sure you want to save the current order?");
                                // CurrentComfirmType.value = "save";
                            }
                        }
                    });
                }, 100);
            })
        };


        onMounted(async () => {
            await getProject();
        });

        return () => (
            <div class={cn("flex flex-col")}>
                <ServerMonitoring />

                <div id="ProjectList" class={cn(
                    "select-none",
                    "mt-4",
                    "rounded-lg",
                    "bg-gray-100 dark:bg-gray-800",
                    "text-center"
                )}>
                    {projectList.value.map((item: any) => (
                        <div class={cn(
                            "flex flex-wrap items-center justify-between",
                            "transition-all duration-200",
                            "px-2 rounded-lg border-b border-b-gray-700 cursor-pointer",
                            "hover:dark:bg-gray-700 "
                        )}>
                            <div class={cn("w-1/8 p-2 flex items-center gap-2")}>
                                <MultipleIcon width="5" height="5" class="DataUnitDrag" />
                            </div>
                            <div class={cn(
                                "w-1/8",
                                "rounded-full text-white text-xs p-1",
                            )}>
                                <img class={cn("w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 p-1")}
                                    src={item.previewBanner}
                                />
                            </div>
                            <div class={cn("w-1/4 p-2", "dark:text-gray-300", "flex flex-col items-start")}>
                                <span class="text-base text-nowrap">
                                    {item.cName}
                                </span>
                                <span class="text-xs mt-1">
                                    {item.eName}
                                </span>
                            </div>
                            <div class="flex-1"></div>
                            <div class={cn(
                                "w-1/4 p-2 flex justify-end",
                                "dark:text-gray-400",
                                "text-xs"
                            )}>
                                <div class="relative"
                                    onMouseenter={() => item.IsShowMenu = true}
                                    onMouseleave={() => item.IsShowMenu = false}
                                >
                                    <DropDownMenu
                                        class={cn(
                                            "absolute -left-1/2 -translate-x-1/2 translate-y-1/2 z-10",
                                        )}
                                        isOpen={item.IsShowMenu} onClose={() => item.IsShowMenu = false}>
                                    </DropDownMenu>
                                    <ExpansionIcon width="5" height="5" />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        );
    }
});
