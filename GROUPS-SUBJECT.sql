-- Per-subject groups: each group belongs to one subject. Run once in Supabase SQL Editor.
alter table groups add column if not exists subject poll_subject;
update groups set subject = 'sport' where subject is null;

drop function if exists create_group(text, text);
create or replace function create_group(p_name text, p_subject poll_subject default 'sport', p_photo text default null)
returns groups language plpgsql security definer set search_path=public as $$
declare g groups; begin
  insert into groups(name, invite_code, photo_url, created_by, subject)
    values (p_name, gen_code(), p_photo, auth.uid(), p_subject) returning * into g;
  insert into group_members(group_id, profile_id, role) values (g.id, auth.uid(), 'admin');
  return g;
end; $$;
grant execute on function create_group(text, poll_subject, text) to authenticated;
