# Blue 42 Productions: setup guide (no terminal needed)

You do this once. After that you edit everything at yoursite.com/admin.

## 1. Unzip
Unzip `blue42-decap.zip` on your computer. You will upload the files inside the folder (not the zip itself).

## 2. Put the files on GitHub
1. Make a free account at github.com.
2. Click the + at the top right, choose New repository, name it `blue42`, keep it Private or Public, click Create.
3. On the new repository page, click "uploading an existing file".
4. Open the unzipped folder, select everything inside it, and drag it into the browser. Wait for the upload bar to finish, then click Commit changes.

## 3. Tell the admin page which repository it edits
1. In your repository, open `public`, then `admin`, then `config.yml`.
2. Click the pencil icon. On the line starting `repo:` replace `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` with your real username and repo name (example: `jane/blue42`). Click Commit changes.

## 4. Put the site online with Netlify
1. Go to netlify.com and sign up with GitHub.
2. Click Add new project, then Import an existing project, choose GitHub, and pick `blue42`.
3. Leave the settings as they are (they are already set) and click Deploy. Wait about two minutes.
4. Netlify shows your site address. Open it to see the site with sample content.

## 5. Turn on your admin login
1. On GitHub go to Settings, then Developer settings, then OAuth Apps, then New OAuth App.
2. Application name: Blue 42 Admin. Homepage URL: your Netlify site address. Authorization callback URL: `https://api.netlify.com/auth/done`. Click Register.
3. Copy the Client ID. Click Generate a new client secret and copy it too.
4. In Netlify open your project, go to Project configuration, then Access and security, then OAuth, and click Install provider. Choose GitHub and paste the Client ID and secret.
5. If a screen is named differently, search "Decap CMS GitHub backend Netlify" for the current steps.

## 6. Log in and edit
Go to `your-site-address/admin` and click Login with GitHub. You will see: Stories, Creators, Photo galleries (one per game), Polls, Rankings, and Site text. Click one, click New (or open an existing item), fill in the form, click Publish. The site updates in about a minute.

## Your weekly routine
- Polls: add a new poll with its options and set Status to Open. Set last week's poll to Closed and type the Winner so it appears in Past winners.
- Stories: add recaps and features. Tick "Story of the week" on one story (untick the old one) and "Show in the Stories of the week list" on up to five.
- Photo galleries: make one gallery per game. Enter the game name, date, school, and the creator credit, then add as many photos as you like (upload, alt text, tick Permission on file). Only fill in a creator on a single photo if someone else shot it. Photos without permission stay hidden.
- Photos of the Week: open Site text, then Photos of the Week. Set the week date and pick up to 5 photos in order (#1 is shown biggest). Tick Permission on file for each one.
- Rankings: duplicate last week's ranking or add a new one with the new date. The newest one shows on the site.
- Replace every "Sample" item with real ones, or delete it. Open an item and use Delete entry.

## Rules for players (they are minors)
Only publish photos and names with permission. Never enter phone numbers or home addresses for players. Use the Request removal link on any page to take something down: delete the item in the admin.

## Good to know
- Polls: votes are stored by Netlify automatically. A repeat visitor is blocked by a cookie and by their network address, so two people on the same Wi-Fi may be counted as one.
- Contact form messages arrive in Netlify under Forms. Turn on email notifications there.
- Your own web address: in Netlify use Domain management. Then update `site` in `astro.config.mjs`, the Sitemap line in `public/robots.txt`, and `site_url` in `public/admin/config.yml`.
- To let someone else edit: in GitHub open the repository, Settings, Collaborators, and invite them.
- This package has not been run end to end yet. If the Netlify build shows an error, copy the red error text to Claude to fix.
