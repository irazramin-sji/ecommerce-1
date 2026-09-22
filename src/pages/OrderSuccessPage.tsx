import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";

export default function OrderSuccessPage() {
  return (
    <PageLayout>
      <PageLayout.Content>
        <div className="p-8 bg-card rounded text-center">
          <h1 className="text-2xl font-bold">Thank you — your order is placed!</h1>
          <p className="mt-2 text-muted-foreground">This is a demo order confirmation. In production you will receive an email with order details and an invoice.</p>
          <div className="mt-4">
            <Link to="/account" className="btn btn-primary">Go to my account</Link>
            <Link to="/" className="ml-2">Continue shopping</Link>
          </div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
