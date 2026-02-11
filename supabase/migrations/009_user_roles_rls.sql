-- EMGurus Hub — Add missing RLS SELECT policy on user_roles
-- The user_roles table has RLS enabled but no SELECT policy for users,
-- causing client-side queries to return empty results.

-- Allow authenticated users to read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to read all roles (needed for admin dashboard user management)
CREATE POLICY "Admins can read all roles"
  ON public.user_roles FOR SELECT
  USING (public.user_has_role('admin'));

-- Allow admins to manage roles (insert/update/delete)
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.user_has_role('admin'));
