/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            zIndex: {
                100: "100",
            },
            boxShadow: {
                "dwly_border":"0 0 1px 1px #e7e7e7",
                "dwly_inputActive": "0px 0px 2px 1px #3b82f6",
                "dwly_inputActive__dark": "0px 0px 2px 1px #c8d7ef"
            }
        },
    },
    plugins: [],

};
