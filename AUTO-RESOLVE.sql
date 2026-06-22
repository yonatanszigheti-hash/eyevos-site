-- ============================================================
--  Eyevos — scheduled auto-resolution (system resolver)
--  auto_resolve_poll: called ONLY by the trusted cron endpoint via the
--  service-role key. It has no auth.uid()/membership check (the system is
--  the caller), but it self-guards: it only resolves auto-verifiable
--  subjects (sport/weather/screen/news), only AFTER closes_at, and is
--  REVOKED from normal users so nobody can call it from the app.
--  Run once in Supabase → SQL Editor. Requires FIX-resolve.sql already run.
-- ============================================================

create or replace function auto_resolve_poll(p_poll uuid, p_outcome vote_choice)
returns text language plpgsql security definer set search_path=public as $$
declare
  v polls%rowtype; v_total int; v_win int; w numeric;
  v_base int; v_minor int; v_streak_b int; v_new_streak int; r record;
begin
  select * into v from polls where id=p_poll for update;
  if v.id is null or v.status not in ('open','locked') then return 'skip'; end if;
  if not (v.subject in ('sport','weather','screen','news') and not v.force_proof and v.type='event')
    then return 'not_auto'; end if;                         -- only publicly-verifiable subjects
  if now() < v.closes_at then return 'not_closed'; end if;  -- never before the close time

  select count(*), count(*) filter (where choice=p_outcome) into v_total, v_win from votes where poll_id=p_poll;
  if v_total = 0 then update polls set status='void', resolved_outcome=p_outcome, resolved_by='auto' where id=p_poll; return 'void'; end if;
  w := v_win::numeric / v_total;
  update polls set status='resolved', resolved_outcome=p_outcome, resolved_by='auto' where id=p_poll;

  for r in select voter_id, choice from votes where poll_id=p_poll loop
    if r.choice = p_outcome then
      v_base := 5;
      v_minor := case when v.type<>'person' and w < 0.5
                        and v_total >= 6 and least(v_win, v_total-v_win) >= 2 then 3 else 0 end;
      select streak into v_streak_b from member_scores
        where group_id=v.group_id and profile_id=r.voter_id and subject=v.subject and season_no=v.season_no;
      v_new_streak := coalesce(v_streak_b,0) + 1;
      v_streak_b := case when v_new_streak=3 then 4 when v_new_streak=5 then 5 else 0 end;
      insert into score_events(group_id,profile_id,poll_id,subject,season_no,base,minority_bonus,streak_bonus)
        values (v.group_id,r.voter_id,p_poll,v.subject,v.season_no,v_base,v_minor,v_streak_b)
        on conflict (poll_id,profile_id) do nothing;
      insert into member_scores(group_id,profile_id,subject,season_no,points,streak)
        values (v.group_id,r.voter_id,v.subject,v.season_no, v_base+v_minor+v_streak_b, v_new_streak)
        on conflict (group_id,profile_id,subject) do update
          set points = member_scores.points + v_base+v_minor+v_streak_b, streak = v_new_streak;
    else
      update member_scores set streak=0
        where group_id=v.group_id and profile_id=r.voter_id and subject=v.subject;
    end if;
  end loop;
  return 'resolved';
end; $$;

-- lock it down: only the service role (cron) may run it, never app users
revoke all on function auto_resolve_poll(uuid, vote_choice) from public, anon, authenticated;
