alter table "user" add column tfa_enabled boolean;
alter table "user" add column tfa_recovery_codes text[];
alter table "user" add column tfa_url text;

---- create above / drop below ----

alter table "user" drop column tfa_enabled;
alter table "user" drop column tfa_recovery_codes;
alter table "user" drop column tfa_url;
