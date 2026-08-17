"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const roleConfig = {
    buyer: {
      title: "Buyer Dashboard",
      description: "Browse produce lots and submit RFQs",
      color: "blue",
    },
    farmer: {
      title: "Farmer Dashboard",
      description: "Manage your farms and harvest data",
      color: "green",
    },
    admin: {
      title: "Admin Dashboard",
      description: "System administration and monitoring",
      color: "purple",
    },
  };

  const config =
    roleConfig[session.user.role as keyof typeof roleConfig] ||
    roleConfig.buyer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {config.title}
            </h1>
            <p className="text-gray-600 text-sm">{config.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {session.user.role}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {session.user.role === "buyer" && (
            <>
              <DashboardCard
                title="Browse Produce"
                description="View available lots from farmers"
                href="/buyer/produce"
              />
              <DashboardCard
                title="My RFQs"
                description="Track your quotation requests"
                href="/buyer/rfqs"
              />
              <DashboardCard
                title="Orders"
                description="Manage your orders and deliveries"
                href="/buyer/orders"
              />
            </>
          )}

          {session.user.role === "farmer" && (
            <>
              <DashboardCard
                title="My Farms"
                description="Manage farm information and locations"
                href="/farmer/farms"
              />
              <DashboardCard
                title="Harvest Data"
                description="Log harvest and produce lots"
                href="/farmer/harvests"
              />
              <DashboardCard
                title="Quotes"
                description="View buyer quotations"
                href="/farmer/quotes"
              />
            </>
          )}

          {session.user.role === "admin" && (
            <>
              <DashboardCard
                title="Users"
                description="Manage users and permissions"
                href="/admin/users"
              />
              <DashboardCard
                title="System"
                description="Platform statistics and health"
                href="/admin/system"
              />
              <DashboardCard
                title="Audits"
                description="View activity logs"
                href="/admin/audits"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}
