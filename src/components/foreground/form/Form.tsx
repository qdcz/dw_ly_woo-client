import { defineComponent, provide, ref } from 'vue';
import { FORM_INJECTION_KEY } from '@/tokens';
export default defineComponent({
    name: "Input",
    props: {
        modelValue: {
            type: Object,
            default: () => ({})
        },
        rules: {
            type: Object,
            default: () => ({})
        }
    },
    emits: [],
    setup(props, { emit, slots, expose }) {
        const checkError = ref({});
        const validate = () => {
            return new Promise((resolve, reject) => {
                let isPass = true;
                if (typeof checkError.value !== 'object') {
                    isPass = false;
                    checkError.value = {};
                }
                if (Object.keys(props.rules).length > 0) {
                    for (let i in props.rules) {
                        if (props.rules[i].required) {
                            checkError.value[i] = props.modelValue[i].value ? "" : props.rules[i].message;
                            !props.modelValue[i].value && (isPass = false);
                        } else {
                            checkError.value[i] = "";
                        }
                    }
                }
                if (isPass) {
                    resolve({});
                } else {
                    reject(checkError.value);
                }
            })
        }
        expose([validate, checkError])

        provide(FORM_INJECTION_KEY, {
            checkError: checkError
        });

        return () => (
            <>
                {slots.default?.()}
            </>
        );
    }
});
