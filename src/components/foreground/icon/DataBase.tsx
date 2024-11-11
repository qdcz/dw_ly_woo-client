import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DataBaseIcon',
    setup() {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-5 h-5"
            >
                <path
                    d="M4 7v10c0 2 1 2 2 2h12c1 0 2 0 2-2V7c0-2-1-2-2-2H6c-1 0-2 0-2 2zM20 7H4M20 11H4M20 15H4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        );
    }
});