The only difference between the chrome version and the firefox one is the manifest (v2 vs v3).

This extension now supports localized Amazon wishlist URLs, including paths with
segments like '-/en/hz/wishlist/ls/' so it works across different country and
language variants.

Building
--------

Run `npm run build` to create `dist/chrome.zip` and `dist/firefox.zip`.
