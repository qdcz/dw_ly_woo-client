import { defineComponent, onMounted, reactive, ref } from 'vue';
import PublicDialog from '@/components/foreground/dialog/publicDialog.tsx';
import { cn } from '@/utils';

import Input from '@/components/foreground/form/Input.tsx';
import Select from '@/components/foreground/form/Select.tsx';
import Form from '@/components/foreground/form/Form.tsx';
import ComfirmButton from '@/components/foreground/form/ComfirmButton.tsx';
import APIs from './APIs';
import { API_METHOD, API_STEP } from '@/constants';
import { ElMessage } from 'element-plus';

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
        Form,
        ComfirmButton
    },
    emits: ['refresh'],
    setup(props, { emit }) {

        const projectList: any = ref([]);
        const apiMethodList: any = ref([]);
        const apiStepList: any = ref([]);
        const formRef: any = ref(null);
        const formData = reactive({
            projectId: '',
            apiPath: '',
            apiName: '',
            apiDescription: '',
            apiBanner: '',
            apiStatus: '',
            apiType: '',
            apiMethod: '',
            apiStep: '',
        });
        const formDataRules = reactive(
            {
                projectId: {
                    required: true,
                    message: '项目信息是必须的'
                },
                apiPath: {
                    required: true,
                    message: 'API路径是必须的'
                },
                apiName: {
                    required: true,
                    message: 'API名称是必须的'
                },
                apiDescription: {
                    required: false,
                    message: 'API描述是必须的'
                },
                // apiBanner: {
                //     required: true,
                //     message: 'API横幅是必须的'
                // },
                apiMethod: {
                    required: true,
                    message: 'API方法类型是必须的'
                },
                apiStep: {
                    required: true,
                    message: 'API步骤类型是必须的'
                }
            }
        );


        const resetFormData = () => {
            formData.projectId = '';
            formData.apiPath = '';
            formData.apiName = '';
            formData.apiDescription = '';
            formData.apiMethod = '';
            formData.apiStep = '';
        }

        const onConfirm = async (e: MouseEvent) => {
            await formRef.value[0]().then(async () => {
                const res: any = await APIs._AddAPIModule({
                    projectId: formData.projectId,
                    parentId: "",
                    path: formData.apiPath,
                    name: formData.apiName,
                    description: formData.apiDescription,
                    thumbnail: "",
                    status: formData.apiStatus || 0, // 是否启用 0启用 1禁用
                    step: Number(formData.apiStep), // 开发状态
                    type: 1,  // 1接口 2模块
                    method: Number(formData.apiMethod), // 请求方法
                });
                if (res.code === 200) {
                    ElMessage.success("新增API成功");
                    // clear form data
                    resetFormData();
                    // emit refresh event
                    emit('refresh');
                    props.onClose();
                }
            }).catch((err: any) => {
                ElMessage.error("validate error: " + Object.values(err)[0] as string);
            })
        }

        onMounted(async () => {
            const res: any = await APIs._ProjectList({
                page: 1,
                take: 10000
            });
            if (res.code === 200) {
                projectList.value = res.data.data.map((item: any) => ({
                    label: item.cName,
                    value: item.id
                }));
            }
        });

        const generateSelectOptions = (constant: any) => {
            return Object.keys(constant).map((key: string) => ({
                label: constant[key],
                value: key
            }));
        };

        apiMethodList.value = generateSelectOptions(API_METHOD);
        apiStepList.value = generateSelectOptions(API_STEP);

        const renderFormFields = (formData: any, projectList: any, apiMethodList: any, apiStepList: any) => {
            return (
                <Form ref={formRef} modelValue={formData} rules={formDataRules}>
                    <div class={cn("mb-4")}>
                        <Select prop="projectId" placeholder="select your project" modelValue={formData.projectId} options={projectList.value}
                            onUpdate:modelValue={(value: string) => formData.projectId = value} />
                    </div>
                    <div class={cn("mb-4")}>
                        <Input prop="apiPath" placeholder="enter your api path" bordered={true} modelValue={formData.apiPath}
                            onUpdate:modelValue={(value: string) => formData.apiPath = value} />
                    </div>
                    <div class={cn("mb-4")}>
                        <Input prop="apiName" placeholder="enter your api name" bordered={true} modelValue={formData.apiName}
                            onUpdate:modelValue={(value: string) => formData.apiName = value} />
                    </div>
                    <div class={cn("mb-4")}>
                        <Input prop="apiDescription" placeholder="enter your api description" bordered={true} modelValue={formData.apiDescription} type="textarea"
                            onUpdate:modelValue={(value: string) => formData.apiDescription = value} />
                    </div>
                    {/* <div class={cn("mb-4")}>
                        <Input prop="apiBanner" placeholder="enter your api banner" bordered={true} modelValue={formData.apiBanner}
                            onUpdate:modelValue={(value: string) => formData.apiBanner = value} />
                    </div> */}
                    <div class={cn("mb-4")}>
                        <Select prop="apiMethod" placeholder="select your api method" modelValue={formData.apiMethod} options={apiMethodList.value}
                            onUpdate:modelValue={(value: string) => formData.apiMethod = value} />
                    </div>
                    <div class={cn("mb-4")}>
                        <Select prop="apiStep" placeholder="select your api step" modelValue={formData.apiStep} options={apiStepList.value}
                            onUpdate:modelValue={(value: string) => formData.apiStep = value} />
                    </div>
                </Form>
            );
        };

        return () => (
            <PublicDialog
                title="Create New API"
                isOpen={props.isOpen}
                onClose={() => props.onClose()}
            >
                {{
                    default: () => (
                        <>
                            {renderFormFields(formData, projectList, apiMethodList, apiStepList)}
                        </>
                    ),
                    footer: () => (
                        <ComfirmButton text="Confirm" onClick={onConfirm} />
                    )
                }}
            </PublicDialog>
        );
    }
});
