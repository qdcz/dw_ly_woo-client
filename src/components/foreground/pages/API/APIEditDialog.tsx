import { defineComponent, reactive } from 'vue';
import PublicDialog from '../../dialog/publicDialog.tsx';

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
    name: "APIEdit",
    components: {
        PublicDialog
    },
    setup(props) {
        const menuOptions = reactive({
            modelValue: "2",
            options: [
                {
                    value: '1',
                    label: 'Info',
                    disabled: false,
                    active: false
                },
                {
                    value: '2',
                    label: 'Excute',
                    disabled: false,
                    active: false
                }
            ],
            placeholder: '请选择',
            disabled: false,
            bordered: false
        });
        return () => (
            <PublicDialog
                title="API Editor"
                isOpen={props.isOpen}
                onClose={() => props.onClose()}
                dropdownProps={menuOptions}
                onSelectChange={(v) => menuOptions.modelValue = v}
            >

            </PublicDialog>
        );
    }
});
