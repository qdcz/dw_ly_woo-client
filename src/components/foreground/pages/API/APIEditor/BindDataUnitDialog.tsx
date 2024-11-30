import { defineComponent, ref } from "vue";
import PublicDialog from "@/components/foreground/dialog/publicDialog";

export default defineComponent({
    name: "BindDataUnitDialog",
    components: {
        PublicDialog
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        return () => (
            <PublicDialog title={props.title} isOpen={props.isOpen} />
        );
    }
});