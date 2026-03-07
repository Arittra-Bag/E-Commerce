import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260307092418 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "tenant" drop constraint if exists "tenant_slug_unique";`);
    this.addSql(`create table if not exists "tenant" ("id" text not null, "name" text not null, "slug" text not null, "is_active" boolean not null default true, "is_default" boolean not null default false, "domains" text[] not null default '{}', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tenant_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tenant_slug_unique" ON "tenant" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_tenant_deleted_at" ON "tenant" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tenant" cascade;`);
  }

}
