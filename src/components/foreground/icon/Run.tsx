import { defineComponent } from "vue";

export default defineComponent({
    name: "RunIcon",
    setup() {
        return () => (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="1em" 
                height="1em" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        );
    }
});
