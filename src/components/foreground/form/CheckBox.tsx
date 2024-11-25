import { defineComponent, ref } from 'vue';
// import { cn } from '@/utils/tailwindcss';

export default defineComponent({
    name: 'Checkbox',
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const isChecked = ref(props.modelValue);

        // const toggleCheck = () => {
        //     isChecked.value = !isChecked.value;
        //     emit('update:modelValue', isChecked.value);
        // };

        return () => (
            <div class="flex items-center cursor-pointer">
                <el-checkbox v-model={isChecked.value} />
            </div>
        );
    },
});
