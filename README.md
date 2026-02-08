LinkNavigation
---
This Chrome extension adds Vim-style hint navigation to web pages. Upon command, it displays short labels above clickable elements (links, buttons, and elements with role="button"), allowing users to select and activate them using the keyboard instead of the mouse.

---
### Installation
1. Download the extension archive.
2. Extract it to any folder.
3. Open chrome://extensions/ in Chrome and enable Developer mode.
4. Click Load unpacked and select the folder with the extension.
5. Assign keyboard shortcuts in the extension settings.
6. Reload the page, enable the extension, and enjoy Vim-style navigation!
---
### How it works
1. When the toggle-hints command is triggered, the extension finds all visible clickable elements on the page:
    - `<a>`
    - `<button>`
    - elements with `role="button"`
2. For each such element, it generates a key combination using the set:
```
a s d f g h j k l
```
3. A small hint label is displayed above each element.
4. The user types letters on the keyboard:
    - If the entered combination uniquely matches one element, it is automatically clicked.
    - If there are no matches, the hints are removed.
    - If the extension is disabled, nothing happens.
