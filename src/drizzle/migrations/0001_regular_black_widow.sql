CREATE TABLE "mpesa_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"merchant_request_id" varchar(100) NOT NULL,
	"checkout_request_id" varchar(100) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reference_code" varchar(50) NOT NULL,
	"description" varchar(255) NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"mpesa_receipt_number" varchar(50),
	"result_code" integer,
	"result_description" varchar(255),
	"is_complete" boolean DEFAULT false,
	"is_successful" boolean DEFAULT false,
	"callback_metadata" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "created_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "updated_at" SET DATA TYPE date;