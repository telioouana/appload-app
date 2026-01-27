CREATE TYPE "public"."currency_enum" AS ENUM('MZN', 'ZAR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."fiscal_regime_enum" AS ENUM('normal', 'simplified-5', 'simplified-3');--> statement-breakpoint
CREATE TYPE "public"."insurance_payment_status_enum" AS ENUM('pending', 'paid', 'not-applicable');--> statement-breakpoint
CREATE TYPE "public"."order_status_enum" AS ENUM('prospect', 'drafted', 'pending', 'on-going', 'delivered', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'partially', 'completed', 'cancelled', 'not-applicable');--> statement-breakpoint
CREATE TYPE "public"."pod_status_enum" AS ENUM('pending-collection', 'pending-delivery', 'delivered', 'verified');--> statement-breakpoint
CREATE TYPE "public"."route_type_enum" AS ENUM('national', 'regional');--> statement-breakpoint
CREATE TYPE "public"."share_enum" AS ENUM('subscribers', 'non-subscribers');--> statement-breakpoint
CREATE TYPE "public"."trip_status_enum" AS ENUM('booked', 'at-loading', 'loading', 'waiting-documents', 'in-transit', 'stopped', 'at-border', 'at-offloading', 'offloading', 'completed');--> statement-breakpoint
CREATE TYPE "public"."trip_type_enum" AS ENUM('backload', 'normal');--> statement-breakpoint
CREATE TYPE "public"."truck_age_enum" AS ENUM('recent', 'not-recent');--> statement-breakpoint
CREATE TYPE "public"."weight_unit_enum" AS ENUM('ton', 'kg', 'liter');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kyc" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"fiscal_regime" text,
	"id_card" jsonb,
	"nuit" jsonb,
	"alvara" jsonb,
	"bank_letter" jsonb,
	"republic_bulletin" jsonb,
	"commercial_exercise" jsonb,
	"commercial_certificate" jsonb,
	CONSTRAINT "kyc_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network" (
	"shipper_id" text NOT NULL,
	"carrier_id" text NOT NULL,
	CONSTRAINT "network_shipper_id_carrier_id_pk" PRIMARY KEY("shipper_id","carrier_id")
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	"subscription_plan" text DEFAULT 'free' NOT NULL,
	"nuit" integer NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"billing_address" text NOT NULL,
	"physical_address" text NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug"),
	CONSTRAINT "organization_nuit_unique" UNIQUE("nuit")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"phone_number" text,
	"phone_number_verified" boolean,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"type" text NOT NULL,
	"gender" text,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "driver" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"carrier_id" text NOT NULL,
	"passport_number" text,
	"id_card" jsonb,
	"passport_card" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driver_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "link" (
	"id" text PRIMARY KEY NOT NULL,
	"carrier_id" text NOT NULL,
	"reg_plate" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"type" text NOT NULL,
	"loading_bay" jsonb NOT NULL,
	"vin" text NOT NULL,
	"booklet" jsonb,
	"license" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "link_reg_plate_unique" UNIQUE("reg_plate")
);
--> statement-breakpoint
CREATE TABLE "trailer" (
	"id" text PRIMARY KEY NOT NULL,
	"carrier_id" text NOT NULL,
	"reg_plate" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"type" text NOT NULL,
	"loading_bay" jsonb NOT NULL,
	"vin" text NOT NULL,
	"booklet" jsonb,
	"license" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trailer_reg_plate_unique" UNIQUE("reg_plate")
);
--> statement-breakpoint
CREATE TABLE "truck" (
	"id" text PRIMARY KEY NOT NULL,
	"carrier_id" text NOT NULL,
	"reg_plate" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"type" text DEFAULT 'tractor' NOT NULL,
	"loading_bay" jsonb,
	"vin" text NOT NULL,
	"booklet" jsonb,
	"license" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "truck_reg_plate_unique" UNIQUE("reg_plate")
);
--> statement-breakpoint
CREATE TABLE "cargo" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric NOT NULL,
	"unit" text DEFAULT 'ton' NOT NULL,
	"packing" text NOT NULL,
	"is_hazardous" boolean DEFAULT false,
	"hazchem_code" text,
	"is_refrigerated" boolean DEFAULT false,
	"temperature" integer,
	"temperature_instructions" text,
	"is_groupage_allowed" boolean DEFAULT false,
	CONSTRAINT "cargo_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "offer" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"carrier_id" text NOT NULL,
	"proposed_loading_date" timestamp,
	"proposed_offloading_date" timestamp,
	"driver_id" text,
	"driver_name" text,
	"driver_passport" text,
	"driver_phone_number" text,
	"truck_plate" text,
	"truck_age" "truck_age_enum",
	"trailer_plate" text,
	"link_plate" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"legacy_id" serial NOT NULL,
	"shipper_id" text NOT NULL,
	"shipper_name" text NOT NULL,
	"loading_address" jsonb,
	"expected_loading_date" timestamp NOT NULL,
	"offloading_address" jsonb,
	"expected_offloading_date" timestamp NOT NULL,
	"distance" integer,
	"expected_trucks" integer DEFAULT 1,
	"status" "order_status_enum",
	"route" "route_type_enum" DEFAULT 'national',
	"share" "share_enum" DEFAULT 'non-subscribers',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_legacy_id_unique" UNIQUE("legacy_id")
);
--> statement-breakpoint
CREATE TABLE "trip" (
	"id" text PRIMARY KEY NOT NULL,
	"legacy_id" serial NOT NULL,
	"order_id" text NOT NULL,
	"carrier_id" text NOT NULL,
	"carrier_name" text NOT NULL,
	"driver_id" text,
	"driver_name" text,
	"driver_passport" text,
	"driver_phone_number" text,
	"truck_plate" text,
	"trailer_plate" text,
	"link_plate" text,
	"truck_age" "truck_age_enum",
	"proposed_loading_date" timestamp NOT NULL,
	"arrival_at_loading" timestamp,
	"arrival_ontime_loading" boolean,
	"actual_loading_date" timestamp,
	"departure_loading_date" timestamp,
	"days_spend_loading" integer,
	"days_spend_traveling" integer,
	"proposed_offloading_date" timestamp NOT NULL,
	"arrival_at_offloading" timestamp,
	"arrival_ontime_offloading" boolean,
	"actual_offloading_date" timestamp,
	"departure_offloading_date" timestamp,
	"days_spend_offloading" integer,
	"demurage_charge" boolean DEFAULT false,
	"total_demurage_charge_days" integer,
	"arrival_at_border" timestamp,
	"departure_from_border" timestamp,
	"loaded_weight" numeric,
	"offloaded_weight" numeric,
	"weight_unit" "weight_unit_enum" DEFAULT 'ton',
	"trip_type" "trip_type_enum" DEFAULT 'normal',
	"deliveries" integer DEFAULT 1,
	"pod_status" "pod_status_enum",
	"status" "trip_status_enum" DEFAULT 'booked',
	"carrier_invoice_number" text,
	"carrier_invoice_date" timestamp,
	"fiscal_regime" "fiscal_regime_enum",
	"carrier_subtotal" numeric,
	"carrier_vat" numeric,
	"carrier_total" numeric,
	"carrier_currency" "currency_enum" DEFAULT 'MZN',
	"carrier_paid_partially" text,
	"carrier_paid_amount" numeric,
	"carrier_paid_percentage" numeric,
	"carrier_payment_status" "payment_status_enum",
	"carrier_remaining_amount" numeric,
	"carrier_remaining_percentage" numeric,
	"carrier_full_payment_date" timestamp,
	"insurance_subscriber" text,
	"insurance_value" numeric,
	"insurance_currency" "currency_enum",
	"insurance_status" "insurance_payment_status_enum",
	"appload_commission_subtotal" numeric,
	"appload_commission_vat" numeric,
	"appload_commission_total" numeric,
	"shipper_invoice_number" text,
	"shipper_invoice_date" timestamp,
	"shipper_subtotal" numeric,
	"shipper_vat" numeric,
	"shipper_total" numeric,
	"shipper_currency" "currency_enum" DEFAULT 'MZN',
	"shipper_paid_partially" text,
	"shipper_paid_amount" numeric,
	"shipper_paid_percentage" numeric,
	"shipper_payment_status" "payment_status_enum",
	"shipper_remaining_amount" numeric,
	"shipper_remaining_percentage" numeric,
	"shipper_full_payment_date" timestamp,
	"number_mechanical_failures_stops" integer DEFAULT 0,
	"total_mechanical_failures_delayed_days" integer,
	"number_documentation_issues_stops" integer DEFAULT 0,
	"total_documentation_issues_delayed_days" integer,
	"number_police_stops" integer DEFAULT 0,
	"total_police_delayed_days" integer,
	"number_accidents" integer DEFAULT 0,
	"cargo_damaged" boolean DEFAULT false,
	"damaged_percent" numeric,
	"claimed" boolean DEFAULT false,
	"age_factor" numeric,
	"load_factor" numeric,
	"default_coefficient" numeric,
	"cost_per_km" numeric,
	"cost_per_unit" numeric,
	"cost_per_unit_km" numeric,
	"total_fuel_cost" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trip_legacy_id_unique" UNIQUE("legacy_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network" ADD CONSTRAINT "network_shipper_id_organization_id_fk" FOREIGN KEY ("shipper_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network" ADD CONSTRAINT "network_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver" ADD CONSTRAINT "driver_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver" ADD CONSTRAINT "driver_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link" ADD CONSTRAINT "link_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trailer" ADD CONSTRAINT "trailer_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "truck" ADD CONSTRAINT "truck_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargo" ADD CONSTRAINT "cargo_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_truck_plate_truck_reg_plate_fk" FOREIGN KEY ("truck_plate") REFERENCES "public"."truck"("reg_plate") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_trailer_plate_trailer_reg_plate_fk" FOREIGN KEY ("trailer_plate") REFERENCES "public"."trailer"("reg_plate") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_link_plate_link_reg_plate_fk" FOREIGN KEY ("link_plate") REFERENCES "public"."link"("reg_plate") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipper_id_organization_id_fk" FOREIGN KEY ("shipper_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_carrier_id_organization_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_truck_plate_truck_reg_plate_fk" FOREIGN KEY ("truck_plate") REFERENCES "public"."truck"("reg_plate") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_trailer_plate_trailer_reg_plate_fk" FOREIGN KEY ("trailer_plate") REFERENCES "public"."trailer"("reg_plate") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_link_plate_link_reg_plate_fk" FOREIGN KEY ("link_plate") REFERENCES "public"."link"("reg_plate") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "kyc_organizationId_idx" ON "kyc" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "link_carrierId_idx" ON "link" USING btree ("carrier_id");--> statement-breakpoint
CREATE INDEX "link_plate_idx" ON "link" USING btree ("reg_plate");--> statement-breakpoint
CREATE INDEX "trailer_carrierId_idx" ON "trailer" USING btree ("carrier_id");--> statement-breakpoint
CREATE INDEX "trailer_plate_idx" ON "trailer" USING btree ("reg_plate");--> statement-breakpoint
CREATE INDEX "truck_carrierId_idx" ON "truck" USING btree ("carrier_id");--> statement-breakpoint
CREATE INDEX "truck_plate_idx" ON "truck" USING btree ("reg_plate");--> statement-breakpoint
CREATE INDEX "cargo_orderId_idx" ON "cargo" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_shipperId_idx" ON "order" USING btree ("shipper_id");--> statement-breakpoint
CREATE INDEX "order_legacyId_idx" ON "order" USING btree ("legacy_id");