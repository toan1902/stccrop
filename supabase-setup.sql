create extension if not exists pgcrypto;
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text default '',
  content_html text not null,
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts for each row execute function public.set_updated_at();
alter table public.posts enable row level security;
drop policy if exists "Public reads published posts" on public.posts;
create policy "Public reads published posts" on public.posts for select using (status='published' or auth.role()='authenticated');
drop policy if exists "Authenticated users create posts" on public.posts;
create policy "Authenticated users create posts" on public.posts for insert to authenticated with check (true);
drop policy if exists "Authenticated users update posts" on public.posts;
create policy "Authenticated users update posts" on public.posts for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users delete posts" on public.posts;
create policy "Authenticated users delete posts" on public.posts for delete to authenticated using (true);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('post-images','post-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "Public reads post images" on storage.objects;
create policy "Public reads post images" on storage.objects for select using (bucket_id='post-images');
drop policy if exists "Authenticated users upload post images" on storage.objects;
create policy "Authenticated users upload post images" on storage.objects for insert to authenticated with check (bucket_id='post-images');
drop policy if exists "Authenticated users delete post images" on storage.objects;
create policy "Authenticated users delete post images" on storage.objects for delete to authenticated using (bucket_id='post-images');
