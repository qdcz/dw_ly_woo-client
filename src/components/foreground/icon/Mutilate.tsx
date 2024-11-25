import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MutilateIcon',
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        }
    },
    setup(props) {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                style={{
                    width: props.width,
                    height: props.height
                }}
            >
                <path d="M3 6h18M3 12h18M3 18h18" />
                <circle cx="19" cy="6" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="18" r="1" fill="currentColor" />
            </svg>
        );
    }
});
