import { defineComponent, onMounted, reactive, ref } from 'vue';
import PublicDialog from '@/components/foreground/dialog/publicDialog.tsx';
import { cn } from '@/utils';

import Input from '@/components/foreground/form/Input.tsx';
import Select from '@/components/foreground/form/Select.tsx';
import Form from '@/components/foreground/form/Form.tsx';
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
        Form
    },
    setup(props) {

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
                apiBanner: {
                    required: true,
                    message: 'API横幅是必须的'
                },
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

        const onConfirm = async (e: MouseEvent) => {
            // console.log(formData);
            // const checkError = formRef.value[0].validate();
            await formRef.value[0]().then((res: any) => {
                console.log(res);
            }).catch((err: any) => {
                ElMessage.error(err.message);
            })
            // console.log();
            // props.onClose();
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
                    <div class={cn("mb-4")}>
                        <Input prop="apiBanner" placeholder="enter your api banner" bordered={true} modelValue={formData.apiBanner}
                            onUpdate:modelValue={(value: string) => formData.apiBanner = value} />
                    </div>
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
                        <button
                            type="button"
                            class={cn(
                                "inline-flex justify-center rounded-md",
                                "border border-transparent",
                                "transition-all duration-300 ease-linear",
                                "bg-indigo-600 hover:bg-indigo-800",
                                "px-4 py-2 text-sm font-medium text-white",
                                "hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 dark:hover:ring-offset-gray-800"
                            )}
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    )
                }}
            </PublicDialog>
        );
    }
});
