# Authentication Components

`AdminLoginForm` is the smallest Client Component around React's Server Action state. It submits bounded email/password fields directly to the server, exposes pending and safe error states, supports password-manager autocomplete, and disables itself when public Supabase configuration is incomplete.

The component never creates a browser Supabase session directly, stores credentials, offers registration, or renders raw provider errors.
