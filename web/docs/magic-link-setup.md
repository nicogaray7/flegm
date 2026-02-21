# Magic link (email sign-in) setup

If users see **"This link is invalid or has expired"** after clicking the email link, the link is likely going through Supabase’s default URL and the token in the fragment (`#access_token=...`) is being stripped by the email client or redirects.

**Fix:** Use a custom Magic Link template so the link in the email goes straight to your app with `token_hash` in the query. The server then verifies it and sets the session.

## Steps

1. Open **Supabase Dashboard** → **Authentication** → **Email Templates**.
2. Select **Magic Link**.
3. In the template body, replace the confirmation link with a link that uses your app URL and the token hash.

Use this for the **link** (one line, no line break in the URL):

```html
<a href="{{ .SiteURL }}/auth/verify-email?token_hash={{ .TokenHash }}&type=email&next=/submit">Log in</a>
```

Example full body:

```html
<h2>Log in to Flegm</h2>
<p>Click the link below to sign in. This link will expire in 1 hour.</p>
<p><a href="{{ .SiteURL }}/auth/verify-email?token_hash={{ .TokenHash }}&type=email&next=/submit">Log in</a></p>
```

4. Save the template.
5. Ensure **Site URL** in **Authentication** → **URL Configuration** is correct (e.g. `https://flegm.vercel.app` for production, `http://localhost:3000` for local).
6. Add `https://your-domain.com/auth/verify-email` (and `http://localhost:3000/auth/verify-email` if needed) to **Redirect URLs** in the same URL Configuration page (some setups require this).

After this, new magic link emails will use the new URL and sign-in should work even when the fragment is stripped.
