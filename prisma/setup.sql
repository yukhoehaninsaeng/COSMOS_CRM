-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "unified_id" UUID,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "gender" TEXT,
    "birth_year" INTEGER,
    "skin_type" TEXT,
    "segment" TEXT,
    "rfm_score" JSONB,
    "ltv" DECIMAL(15,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_identities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "channel_user_id" TEXT NOT NULL,
    "identifier_type" TEXT NOT NULL,
    "identifier_value" TEXT NOT NULL,
    "confidence_score" DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "channel" TEXT,
    "sku_master_id" UUID,
    "meta" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "sku_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sub_category" TEXT,
    "ingredients" JSONB,
    "unit_cost" DECIMAL(15,2),
    "selling_price" DECIMAL(15,2),
    "lot_expiry" DATE,
    "is_bundle" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sku_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_aliases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku_master_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "alias_code" TEXT NOT NULL,
    "alias_name" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sku_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_bundles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bundle_sku_id" UUID NOT NULL,
    "component_sku_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "cost_ratio" DECIMAL(5,4) NOT NULL,
    "is_gift" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sku_bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku_master_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "qty_available" INTEGER NOT NULL DEFAULT 0,
    "qty_reserved" INTEGER NOT NULL DEFAULT 0,
    "reorder_point" INTEGER NOT NULL DEFAULT 10,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "channel_order_id" TEXT,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "discount_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "ordered_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "sku_master_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(15,2) NOT NULL,
    "lot_number" TEXT,
    "is_bundle_item" BOOLEAN NOT NULL DEFAULT false,
    "parent_item_id" UUID,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_orders_raw" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channel" TEXT NOT NULL,
    "raw_json" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error_message" TEXT,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_orders_raw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "segment_filter" JSONB,
    "ab_test" JSONB,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_sends" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "variant" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sent_at" TIMESTAMP(3),
    "opened_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),
    "converted_at" TIMESTAMP(3),
    "revenue_attr" DECIMAL(15,2),

    CONSTRAINT "campaign_sends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journeys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "trigger_config" JSONB,
    "steps" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_enrollments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "journey_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "follower_cnt" INTEGER,
    "avg_engagement" DECIMAL(5,2),
    "avg_roi" DECIMAL(10,2),
    "skin_type_focus" TEXT,
    "category_focus" TEXT[],
    "contact" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencer_campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "influencer_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "utm_code" TEXT NOT NULL,
    "coupon_code" TEXT,
    "fee" DECIMAL(15,2),
    "revenue_attributed" DECIMAL(15,2),
    "roi" DECIMAL(10,2),
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "influencer_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voc_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku_master_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "channel_review_id" TEXT,
    "rating" INTEGER,
    "content" TEXT,
    "sentiment" TEXT,
    "tags" JSONB,
    "lot_number" TEXT,
    "is_alert" BOOLEAN NOT NULL DEFAULT false,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analyzed_at" TIMESTAMP(3),

    CONSTRAINT "voc_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'member',
    "group_id" UUID,
    "password_hash" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "invited_by" UUID,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "permissions" JSONB,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "payload_before" JSONB,
    "payload_after" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_connections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "auth_type" TEXT NOT NULL,
    "token_encrypted" TEXT,
    "refresh_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'disconnected',
    "last_latency_ms" INTEGER,
    "last_checked_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_phone_idx" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customers_unified_id_idx" ON "customers"("unified_id");

-- CreateIndex
CREATE INDEX "customers_segment_idx" ON "customers"("segment");

-- CreateIndex
CREATE INDEX "customer_identities_customer_id_idx" ON "customer_identities"("customer_id");

-- CreateIndex
CREATE INDEX "customer_identities_channel_channel_user_id_idx" ON "customer_identities"("channel", "channel_user_id");

-- CreateIndex
CREATE INDEX "customer_events_customer_id_idx" ON "customer_events"("customer_id");

-- CreateIndex
CREATE INDEX "customer_events_event_type_idx" ON "customer_events"("event_type");

-- CreateIndex
CREATE INDEX "customer_events_occurred_at_idx" ON "customer_events"("occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "sku_master_sku_code_key" ON "sku_master"("sku_code");

-- CreateIndex
CREATE INDEX "sku_master_sku_code_idx" ON "sku_master"("sku_code");

-- CreateIndex
CREATE INDEX "sku_master_category_idx" ON "sku_master"("category");

-- CreateIndex
CREATE INDEX "sku_master_is_bundle_idx" ON "sku_master"("is_bundle");

-- CreateIndex
CREATE UNIQUE INDEX "sku_aliases_channel_alias_code_key" ON "sku_aliases"("channel", "alias_code");

-- CreateIndex
CREATE INDEX "inventory_sku_master_id_idx" ON "inventory"("sku_master_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_sku_master_id_channel_key" ON "inventory"("sku_master_id", "channel");

-- CreateIndex
CREATE INDEX "orders_customer_id_idx" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "orders_channel_idx" ON "orders"("channel");

-- CreateIndex
CREATE INDEX "orders_ordered_at_idx" ON "orders"("ordered_at");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "channel_orders_raw_channel_idx" ON "channel_orders_raw"("channel");

-- CreateIndex
CREATE INDEX "channel_orders_raw_processed_idx" ON "channel_orders_raw"("processed");

-- CreateIndex
CREATE INDEX "channel_orders_raw_ingested_at_idx" ON "channel_orders_raw"("ingested_at");

-- CreateIndex
CREATE INDEX "campaign_sends_campaign_id_idx" ON "campaign_sends"("campaign_id");

-- CreateIndex
CREATE INDEX "campaign_sends_customer_id_idx" ON "campaign_sends"("customer_id");

-- CreateIndex
CREATE INDEX "campaign_sends_status_idx" ON "campaign_sends"("status");

-- CreateIndex
CREATE UNIQUE INDEX "influencer_campaigns_utm_code_key" ON "influencer_campaigns"("utm_code");

-- CreateIndex
CREATE INDEX "voc_reviews_sku_master_id_idx" ON "voc_reviews"("sku_master_id");

-- CreateIndex
CREATE INDEX "voc_reviews_channel_idx" ON "voc_reviews"("channel");

-- CreateIndex
CREATE INDEX "voc_reviews_sentiment_idx" ON "voc_reviews"("sentiment");

-- CreateIndex
CREATE INDEX "voc_reviews_ingested_at_idx" ON "voc_reviews"("ingested_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "customer_identities" ADD CONSTRAINT "customer_identities_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_events" ADD CONSTRAINT "customer_events_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_events" ADD CONSTRAINT "customer_events_sku_master_id_fkey" FOREIGN KEY ("sku_master_id") REFERENCES "sku_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_aliases" ADD CONSTRAINT "sku_aliases_sku_master_id_fkey" FOREIGN KEY ("sku_master_id") REFERENCES "sku_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_bundles" ADD CONSTRAINT "sku_bundles_bundle_sku_id_fkey" FOREIGN KEY ("bundle_sku_id") REFERENCES "sku_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_bundles" ADD CONSTRAINT "sku_bundles_component_sku_id_fkey" FOREIGN KEY ("component_sku_id") REFERENCES "sku_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_sku_master_id_fkey" FOREIGN KEY ("sku_master_id") REFERENCES "sku_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sku_master_id_fkey" FOREIGN KEY ("sku_master_id") REFERENCES "sku_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_sends" ADD CONSTRAINT "campaign_sends_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_sends" ADD CONSTRAINT "campaign_sends_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_enrollments" ADD CONSTRAINT "journey_enrollments_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_enrollments" ADD CONSTRAINT "journey_enrollments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_campaigns" ADD CONSTRAINT "influencer_campaigns_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "influencer_campaigns" ADD CONSTRAINT "influencer_campaigns_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voc_reviews" ADD CONSTRAINT "voc_reviews_sku_master_id_fkey" FOREIGN KEY ("sku_master_id") REFERENCES "sku_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- 초기 관리자 계정 (비밀번호: 1q2w3e4r@@, bcrypt hash)
INSERT INTO "users" ("email","name","role","password_hash","is_active")
VALUES (
  'fdadmin@flowit.com',
  'fdadmin',
  'super_admin',
  '$2a$12$qaFUA0pKqNoqAlWNe3D52uN6NfUw6KW1PLbJt0uBMH/8RdHVt/2d2',
  true
) ON CONFLICT (email) DO NOTHING;
