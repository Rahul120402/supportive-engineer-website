import React from 'react';

export const Button = React.forwardRef(({ 
  className = '', 
  children, 
  disabled = false,
  ...props 
}, ref) => (
  <button
    ref={ref}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = 'Button';
```

4. **"Commit new file"** click karo

---

## **Ab Summary - Tumhare paas ye files honi chahiye:**
```
supportive-engineer-website/
├── package.json ✅
├── vite.config.js ✅
├── tailwind.config.js ✅
├── postcss.config.js ✅
├── index.html ✅
├── src/
│   ├── main.jsx ✅
│   ├── index.css ✅
│   ├── App.jsx ✅
│   └── components/
│       └── ui/
│           ├── card.jsx ✅
│           └── button.jsx ✅
