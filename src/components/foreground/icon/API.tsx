import { defineComponent } from 'vue';

export default defineComponent({
    name: 'APIIcon',
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
                    d="M9 3v2m6-2v2M9 19h6m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2M3 10h18M12 14v4m0 0l-2-2m2 2l2-2"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        );
    }
});