import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Building2 } from "lucide-react";
import { Button, Card, Input } from "../../../../Components/index";
import {
  pageAnimation,
  staggerContainer,
  fadeUp,
  cardAnimation,
  fadeIn,
  useAnimationVariants,
} from "../../../../Animations/animations";
import DepartmentStatCard from "./DepartmentStatCard";
import DepartmentTableLive from "./DepartmentTable";
import DepartmentViewModal from "./DepartmentViewModal";
import {
  DepartmentStatSkeleton,
  DepartmentTableSkeleton,
} from "./DepartmentSkeleton";
import { useAdminDepartments } from "../../../../Services/Queries/adminDepartment.quires";
import { getErrorMessage } from "../../../../Services/admin/adminDepartments.api";

const AdminDepartmentManagement = () => {
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);

  const pageVariants = useAnimationVariants(pageAnimation);
  const containerVariants = useAnimationVariants(staggerContainer);
  const itemVariants = useAnimationVariants(fadeUp);
  const cardVariants = useAnimationVariants(cardAnimation);
  const fadeVariants = useAnimationVariants(fadeIn);

  const { data, isLoading, isError, error, refetch } = useAdminDepartments();

  const departments = data?.departments ?? [];
  const totals = data?.stats;

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return departments;

    return departments.filter(
      (department) =>
        department.name.toLowerCase().includes(query) ||
        department.code.toLowerCase().includes(query) ||
        department.tpos.some((p) => p.name.toLowerCase().includes(query)) ||
        department.spocs.some((p) => p.name.toLowerCase().includes(query)),
    );
  }, [departments, search]);

  const stats = [
    {
      title: "Total Departments",
      value: totals?.totalDepartments ?? 0,
      description: "Departments in the institute",
      icon: "Building2",
    },
    {
      title: "Total Students",
      value: totals?.totalStudents ?? 0,
      description: "Registered across all departments",
      icon: "GraduationCap",
    },
    {
      title: "TPOs Assigned",
      value: totals?.departmentsWithTpo ?? 0,
      description: "Departments with an active TPO",
      icon: "CheckCircle2",
    },
    {
      title: "SPOCs Assigned",
      value: totals?.departmentsWithSpoc ?? 0,
      description: "Departments with an active SPOC",
      icon: "Building",
    },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <section className="flex min-w-0 items-start gap-3">
        <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
          <Building2 size={24} />
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Department Management
          </h1>

          <p className="mt-1 text-sm leading-6 text-ink-muted">
            View departments, their student counts, and assigned TPOs and SPOCs.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="h-full *:h-full"
          >
            {isLoading ? (
              <DepartmentStatSkeleton />
            ) : (
              <DepartmentStatCard stat={stat} />
            )}
          </motion.div>
        ))}
      </motion.section>

      {/* Department Table */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="min-w-0 overflow-hidden border border-border bg-white shadow-card">
          <div className="space-y-5 border-b border-border p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-ink">
                  Registered Departments
                </h2>

                <p className="mt-1 text-sm text-ink-muted">
                  {isLoading
                    ? "Loading departments…"
                    : `Showing ${filteredDepartments.length} of ${departments.length} departments`}
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-cream-soft p-3 text-brand-600">
                <Building2 size={20} />
              </div>
            </div>

            <div className="min-w-0 sm:max-w-md">
              <Input
                placeholder="Search department, code, TPO, SPOC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<Search size={17} />}
              />
            </div>
          </div>

          <div className="min-w-0 p-3 sm:p-5">
            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full overflow-x-auto"
                >
                  <DepartmentTableSkeleton rows={6} />
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center gap-3 px-5 py-12 text-center"
                >
                  <p className="text-sm font-medium text-ink">
                    Could not load departments
                  </p>
                  <p className="text-xs text-ink-muted">
                    {getErrorMessage(error)}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try again
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <DepartmentTableLive
                    departments={filteredDepartments}
                    onView={setViewing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      <DepartmentViewModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        department={viewing}
      />
    </motion.div>
  );
};

export default AdminDepartmentManagement;
