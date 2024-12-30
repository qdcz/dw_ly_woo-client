import { defineComponent, reactive, ref, watch } from 'vue';
import PublicDialog from '@/components/foreground/dialog/publicDialog.tsx';
import { cn } from '@/utils';

import Input from '@/components/foreground/form/Input.tsx';
import Select from '@/components/foreground/form/Select.tsx';
import ComfirmButton from '@/components/foreground/form/ComfirmButton.tsx';
import * as APIs from '../../../api/index';
import { ElMessage } from 'element-plus';
import { UserStore } from '@/store/user/user';
import { OthereStore } from '@/store/other/other';


export default defineComponent({
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        onClose: {
            type: Function,
            required: true
        }
    },
    name: "CreateAPI",
    components: {
        PublicDialog,
        Input,
        Select,
        ComfirmButton
    },
    emits: ['refresh'],
    setup(props, { emit }) {
        const userStore = UserStore();
        const othereStore = OthereStore();
        const sexOptions = [
            { label: "男", value: 0 },
            { label: "女", value: 1 },
        ]
        const formData = reactive({
            name: '',
            sex: '',
            phone: '',
            address: '',
            introduction: '',
            avatar: '',
        });
        const previewAvatar = ref("");
        const isShowAvatarToopTip = ref(false);

        const resetFormData = () => {
            formData.name = '';
            formData.sex = '';
            formData.phone = '';
            formData.address = '';
            formData.introduction = '';
            formData.avatar = '';
        }

        const convertMinioImage = (url: string) => {
            const imageCache = othereStore.getImageCache();
            if (imageCache.get(url)) {
                previewAvatar.value = imageCache.get(url)
            } else {
                APIs.downloadImage({
                    bucketName: "visix",
                    objectName: encodeURIComponent(url),
                }).then((res) => {
                    const minioBase = import.meta.env.VITE_MINIO_ENDPOINT + ":" + import.meta.env.VITE_MINIO_PORT;
                    res.data = res.data.replace(/http:\/\/[^\/]+:\d+/g, `http://${minioBase}`);
                    imageCache.set(url, res.data, 1000 * 60 * 20);
                    previewAvatar.value = imageCache.get(url)
                })
            }
        }

        const changeAvatar = async (event) => {
            const file = event.target.files[0];
            console.log(file); // 获取选择的文件列表


            // 生成预操作的url
            const { code, data }: any = await APIs.UploadImage({
                bucketName: "visix",
                prefix: "projectImage/",
                fileName: file.name,
                expires: 1000 * 60
            });

            // 替换预签名URL中的域名和端口
            const minioEndpoint = import.meta.env.VITE_MINIO_ENDPOINT;
            const minioPort = import.meta.env.VITE_MINIO_PORT;
            const minioBase = `${minioEndpoint}:${minioPort}`;

            if (code !== 200) {
                ElMessage.error("生成预上传链接失败");
                return
            }

            const uploadImageUrl = data.replace(/http:\/\/[^\/]+:\d+/g, `http://${minioBase}`);
            console.log("uploadImageUrl", uploadImageUrl);

            // 使用自定义上传
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uploadImageUrl, true);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    ElMessage.success("上传成功！");
                    formData.avatar = "projectImage/" + file.name;
                    convertMinioImage(formData.avatar)
                } else {
                    ElMessage.error("上传失败！" + xhr.statusText);
                }
            };
            xhr.onerror = function () {
                ElMessage.error("请求错误" + xhr.statusText);
            };
            xhr.send(file);
        }

        const onConfirm = async (e: MouseEvent) => {
            if (!userStore.userInfo) return
            const { id, username } = JSON.parse(userStore.userInfo);

            const res: any = await APIs.UpdateUser({
                id,
                ...formData
            });
            if (res.code === 200) {
                ElMessage.success("更新成功！");
                await userStore.SETUSERINFO(
                    JSON.stringify({
                        username,
                        id,
                        name: formData.name,
                        avatar: formData.avatar,
                    })
                );
                resetFormData();
                props.onClose();
            }

        }

        const getUserInfo = async (userId: string) => {
            const { code, data }: any = await APIs.UserInfo(userId);
            if (code === 200) {
                Object.keys(formData).forEach(key => {
                    formData[key] = data[key] || (data[key] === 0 ? data[key] : "");
                    if (key == "avatar" && data['avatar']) {
                        convertMinioImage(data['avatar']);
                    }
                });
            }
        }

        watch(() => props.isOpen, (n, o) => {
            if (n) {
                if (!userStore.userInfo) return
                const { id } = JSON.parse(userStore.userInfo);
                getUserInfo(id)
            }
        })

        const renderFormFields = (formData: any) => {
            return (
                <div class="flex flex-row">
                    <div class="flex-1">
                        <div class={cn("mb-4")}>
                            <div class="pb-2">name</div>
                            <Input prop="name" placeholder="enter your name" bordered={true} modelValue={formData.name}
                                onUpdate:modelValue={(value: string) => formData.name = value} />
                        </div>
                        <div class={cn("mb-4")}>
                            <div class="pb-2">sex</div>
                            <Select prop="sex" placeholder="select your sex" modelValue={formData.sex} options={sexOptions}
                                onUpdate:modelValue={(value: string) => formData.sex = value} />
                        </div>
                        <div class={cn("mb-4")}>
                            <div class="pb-2">phone</div>
                            <Input prop="phone" placeholder="enter your phone" bordered={true} modelValue={formData.phone}
                                onUpdate:modelValue={(value: string) => formData.phone = value} />
                        </div>
                        <div class={cn("mb-4")}>
                            <div class="pb-2">address</div>
                            <Input prop="address" placeholder="enter your address" bordered={true} modelValue={formData.address} type="textarea"
                                onUpdate:modelValue={(value: string) => formData.address = value} />
                        </div>
                        <div class={cn("mb-4")}>
                            <div class="pb-2">introduction</div>
                            <Input prop="introduction" placeholder="enter your introduction" bordered={true} modelValue={formData.introduction} type="textarea"
                                onUpdate:modelValue={(value: string) => formData.introduction = value} />
                        </div>
                    </div>
                    <div class="px-6 flex flex-col items-center">
                        <div class="pb-4">avatar</div>
                        <div class="relative cursor-pointer">
                            <input class="w-40 h-40 absolute opacity-0" type="file"
                                onMouseenter={() => isShowAvatarToopTip.value = true}
                                onMouseleave={() => isShowAvatarToopTip.value = false}
                                onChange={changeAvatar}
                            />
                            <img class={cn("w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-600 p-2")}
                                src={previewAvatar.value}
                            >
                            </img>
                        </div>
                        <div class={cn(
                            "relative",
                            "transition-opacity duration-500",
                            "mt-4 py-1 px-2 text-sm rounded dark:bg-gray-700 bg-gray-900 dark:text-gray-300 text-white",
                            isShowAvatarToopTip.value ? "opacity-1" : "opacity-0"
                        )}>
                            <div class={cn(
                                "absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0",
                                "border-l-8 border-r-8 border-b-8 border-transparent dark:border-y-gray-700 border-y-gray-300"
                            )}></div>
                            <span>Click to change avatar</span>
                        </div>
                        <span class="text-red-700 w-40 text-center">Tip: Remember to save after uploading</span>
                    </div>
                </div>
            );
        };

        return () => (
            <PublicDialog
                width="50%"
                title="UserInfo"
                isOpen={props.isOpen}
                onClose={() => props.onClose()}
            >
                {{
                    default: () => (
                        <>
                            {renderFormFields(formData)}
                        </>
                    ),
                    footer: () => (
                        <ComfirmButton text="Save" onClick={onConfirm} />
                    )
                }}
            </PublicDialog>
        );
    }
});
