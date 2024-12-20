/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            left: {
            
            },
            zIndex: {
                100: "100",
            },
            boxShadow: {
                "ly_mimicry":"0px 0px 4px 0px #c7c7c7",
                "ly_border": "0 0 1px 0px #9c9a9a",
                "ly_border_dark": "0 0 2px 0px #797979",
                "ly_inputActive": "0px 0px 2px 1px #3b82f6",
                "ly_inputActive__dark": "0px 0px 2px 1px #c8d7ef"
            }
        },
    },
    plugins: [],

};
