import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeIcon',
    setup() {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1024 1024"
                stroke="currentColor"
                class="w-5 h-5"
            >
                <path
                    d="M223.444 424.016A60 60 0 0 0 202 469.986V822h170V606c0-33.138 26.862-60 60-60h160c33.138 0 60 26.862 60 60v216h170V469.986a60 60 0 0 0-21.444-45.97l-250-209.678c-22.3-18.704-54.812-18.704-77.112 0l-250 209.678zM562 636h-100v186c0 49.706-40.294 90-90 90h-170c-49.706 0-90-40.294-90-90V469.986a150 150 0 0 1 53.608-114.928l250-209.678c55.754-46.76 137.03-46.76 192.784 0l250 209.678A150 150 0 0 1 912 469.986V822c0 49.706-40.294 90-90 90h-170c-49.706 0-90-40.294-90-90v-186z"
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        );
    }
});