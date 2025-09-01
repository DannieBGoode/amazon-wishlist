The only difference between the chrome version and the firefox one is the manifest (v2 vs v3).

This extension now supports localized Amazon wishlist URLs, including paths with
segments like '-/en/hz/wishlist/ls/' so it works across different country and
language variants.

Building
--------

This extension uses a cross-platform build system that works on Windows, Mac, and Linux.

**Prerequisites:**
- Node.js (v14 or higher)
- npm

**Setup:**
1. Install dependencies: `npm install`
2. Run the build: `npm run build`

The build process will create `dist/chrome.zip` and `dist/firefox.zip` files that can be
installed in their respective browsers.

**Build Details:**
- Automatically handles manifest differences between Chrome (v3) and Firefox (v2)
- Creates optimized zip files without external dependencies
- Works consistently across all operating systems
