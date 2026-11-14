import {
  ArrowUpRight,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  FileCheck2,
} from "lucide-react";

import { Card } from "../../../../Components/index";

import DashboardHeader from "./DashboardHeader";
import OverviewStats from "./OverviewStats";
import InternshipAnalytics from "./InternshipAnalytics";
import DepartmentOverview from "./DepartmentOverview";
import PendingNOCs from "./PendingNOCs";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";

const AdminDashboard = () => {
  return (
    <main className="min-h-screen min-w-0 bg-cream p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <DashboardHeader />

        <Card className="relative overflow-hidden border-brand-200/60 bg-white">
          <Card.Content className="relative flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="relative z-10 max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <span className="size-2 rounded-full bg-green-500" />
                Academic Session 2026–2027
              </div>

              <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Welcome to the Administration Portal
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-ink-muted">
                Manage companies, students, NOC requests and internship
                activities from one centralized workspace.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => console.log?.("Manage NOCs")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800"
                >
                  Manage NOCs
                  <ArrowUpRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => console.log?.("View Companies")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-cream-soft"
                >
                  View Companies
                </button>
              </div>
            </div>

            <div className="relative hidden shrink-0 items-center justify-center sm:flex">
              <div className="absolute size-48 rounded-full bg-brand-50" />
              <div className="absolute size-36 rounded-full border border-brand-100" />

              <div className="relative flex size-28 items-center justify-center rounded-3xl border border-brand-100 bg-white shadow-card">
                <GraduationCap
                  size={58}
                  strokeWidth={1.3}
                  className="text-brand-700"
                />
              </div>

              <div className="absolute -right-4 -top-2 flex size-11 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                <Building2 size={21} className="text-brand-700" />
              </div>

              <div className="absolute -bottom-3 -left-4 flex size-11 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                <BriefcaseBusiness size={21} className="text-green-600" />
              </div>

              <div className="absolute -bottom-2 -right-4 flex size-10 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                <FileCheck2 size={19} className="text-amber-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Platform Overview
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                Key administrative statistics
              </p>
            </div>
          </div>

          <OverviewStats />
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <InternshipAnalytics />
          </div>

          <div className="min-w-0">
            <DepartmentOverview />
          </div>
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <PendingNOCs />
          </div>

          <div className="min-w-0">
            <RecentActivities />
          </div>
        </section>

        <section>
          <QuickActions />
        </section>

        <footer className="border-t border-border pt-4">
          <p className="text-center text-xs text-ink-muted">
            JGEC Internship Management Portal · Administration
          </p>
        </footer>
      </div>
    </main>
  );
};

export default AdminDashboard;
