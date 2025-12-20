# Complete Codespaces Setup Guide

## Quick Start (Do These Steps)

1. **In the Codespaces TERMINAL tab, run:**
   ```bash
   npm run dev
   ```

2. **Wait for the server to start** - You should see:
   - `▲ Next.js 14.2.35`
   - `✓ Ready in XXXXms`
   - `Local: http://localhost:3000`

3. **Go to the PORTS tab** (at the bottom)

4. **Find port 3000** in the table

5. **Click the padlock icon** next to port 3000 to change it from "Private" to "Public"

6. **Click the URL** in the "Forwarded Address" column:
   `https://bookish-succotash-9756p9rx4x9wcpg5p-3000.app.github.dev/`

7. **The app should open in your browser!**

## Troubleshooting

**If you get HTTP ERROR 502:**
- Make sure `npm run dev` is still running in the terminal
- Make sure the port is set to "Public" (not "Private")
- Wait 10-15 seconds after making it public before clicking the URL

**If the server stops:**
- Go back to TERMINAL tab
- Run `npm run dev` again

**If port 3000 shows "Running Process" as empty:**
- The server isn't running - start it with `npm run dev`

