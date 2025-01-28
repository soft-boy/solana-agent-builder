// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        ultramodern: {
          primary: '#3b82f6', // Blue for buttons and accents
          secondary: '#22D3EE', // Cyan (can be used sparingly)
          accent: '#F43F5E', // Red for warnings or highlights
          neutral: '#202429', // Dark gray for menus and cards
          'base-100': '#f4f6f6', // Light gray for background
          info: '#3B82F6', // Info blue
          success: '#10B981', // Green for success
          warning: '#F59E0B', // Amber for warnings
          error: '#EF4444', // Red for errors
        },
      },
    ],
  },
};
