"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const roleConfig = {
    buyer: {
      title: "Buyer Dashboard",
      description: "Browse produce lots and submit RFQs",
    },
    farmer: {
      title: "Farmer Dashboard",
      description: "Manage your farms and harvest data",
    },
    admin: {
      title: "Admin Dashboard",
      description: "System administration and monitoring",
    },
  } as const;

  const config = roleConfig[session.user.role as keyof typeof roleConfig] || roleConfig.buyer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-xs capitalize text-gray-500">{session.user.role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {session.user.role === "buyer" && (
            <>
              <DashboardCard title="Browse Produce" description="View available lots from farmers" href="/buyer/produce" />
              <DashboardCard title="My RFQs" description="Track your quotation requests" href="/buyer/rfqs" />
              <DashboardCard title="Orders" description="Manage your orders and deliveries" href="/buyer/orders" />
            </>
          )}

          {session.user.role === "farmer" && (
            <>
              <DashboardCard title="My Farms" description="Manage farm information and locations" href="/farmer/farms" />
              <DashboardCard title="Harvest Data" description="Log harvest and produce lots" href="/farmer/harvests" />
              <DashboardCard title="Quotes" description="View buyer quotations" href="/farmer/quotes" />
            </>
          )}

          {session.user.role === "admin" && (
            <>
              <DashboardCard title="Users" description="Manage users and permissions" href="/admin/users" />
              <DashboardCard title="System" description="Platform statistics and health" href="/admin/system" />
              <DashboardCard title="Audits" description="View activity logs" href="/admin/audits" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <div className="cursor-pointer rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
        <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
