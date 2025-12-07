/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                gruv: {
                    green: '#8ec07c',
                    aqua: '#458588',
                    yellow: '#d79921',
                    red: '#cc241d',
                    dark: '#3c3836',
                },
            },
        },
    },
    plugins: [],
};
