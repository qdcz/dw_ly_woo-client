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
                "ly_border": "0 0 1px 0px #efefef",
                "ly_border_dark": "0 0 2px 0px #3d3d3d",
                "ly_inputActive": "0px 0px 2px 1px #3b82f6",
                "ly_inputActive__dark": "0px 0px 2px 1px #c8d7ef"
            }
        },
    },
    plugins: [],

};
