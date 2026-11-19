import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck2,
  FileClock,
  Files,
  ListChecks,
  UsersRound,
} from "lucide-react";
import { fadeUp, staggerContainer } from "../../../../Animations/animations";
import {
  useDownloadSpocNoc,
  useGenerateSpocNoc,
  useSpocApplications,
  useViewSpocNoc,
} from "../../../../Services/Queries/spocApplication.quires";
import GenerateNocModal from "./GenerateNOCModal";
import GeneratedNocsSection from "./GeneratedNOCSection";
import NocStatCard from "./NOCStatusCard";
import NocStatusBanner from "./NOCStatusBanner";
import PendingNocsSection from "./PendinNOCSection";
import QueryErrorCard from "./QueryErrorCard";
import ToastViewport from "./TaostViewPort";
import useNocFiles from "./useNOCFiles";
import useNocGeneration from "./useNOCGenerations";
import useToasts from "./useToasts";
import { getErrorMessage, toNocRecords } from "./noc.utils";

// Applications approved by the SPOC that still need a NOC.
const PENDING_STATUS = "approved_by_spoc";
const GENERATED_STATUS = "noc_generated";

const SPOCNOC = () => {
  const pendingQuery = useSpocApplications({ status: PENDING_STATUS });
  const generatedQuery = useSpocApplications({ status: GENERATED_STATUS });

  const { mutateAsync: generateNoc } = useGenerateSpocNoc();
  const { mutateAsync: downloadNoc } = useDownloadSpocNoc();
  const { mutateAsync: viewNoc } = useViewSpocNoc();

  const { toasts, notify, dismiss } = useToasts();
  const { generate, generatingIds } = useNocGeneration({ generateNoc, notify });
  const { activeAction, view, download } = useNocFiles({
    viewNoc,
    downloadNoc,
    notify,
  });

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [targets, setTargets] = useState([]);
  const [activeSection, setActiveSection] = useState("pending");

  const pendingNocs = useMemo(
    () => toNocRecords(pendingQuery.data, PENDING_STATUS),
    [pendingQuery.data],
  );

  const generatedNocs = useMemo(
    () => toNocRecords(generatedQuery.data, GENERATED_STATUS),
    [generatedQuery.data],
  );

  const companyCount = useMemo(
    () => new Set(generatedNocs.map((noc) => noc.company)).size,
    [generatedNocs],
  );

  const studentCount = useMemo(
    () => new Set(generatedNocs.map((noc) => noc.studentId)).size,
    [generatedNocs],
  );

  const isLoading = pendingQuery.isLoading || generatedQuery.isLoading;
  const isError = pendingQuery.isError || generatedQuery.isError;
  const loadError = pendingQuery.error ?? generatedQuery.error;

  const handleToggle = useCallback((id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedIds((current) => {
      const selectable = pendingNocs
        .filter((noc) => !generatingIds.has(noc.id))
        .map((noc) => noc.id);

      return selectable.every((id) => current.has(id))
        ? new Set()
        : new Set(selectable);
    });
  }, [pendingNocs, generatingIds]);

  const handleClearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const handleCloseModal = useCallback(() => setTargets([]), []);

  const handleConfirmGenerate = async () => {
    const succeeded = await generate(targets.map((noc) => noc.id));

    setSelectedIds((current) => {
      const next = new Set(current);
      succeeded.forEach((id) => next.delete(id));
      return next;
    });
    setTargets([]);
  };

  const handleRetry = () => {
    pendingQuery.refetch();
    generatedQuery.refetch();
  };

  const isModalGenerating = targets.some((noc) => generatingIds.has(noc.id));

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="box-border mx-auto w-full min-w-0 max-w-[1600px] overflow-x-hidden px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9"
      >
        <motion.header
          variants={fadeUp}
          className="w-full min-w-0 rounded-2xl border border-border bg-surface px-5 py-6 shadow-(--shadow-card) sm:px-7 sm:py-7"
        >
          <p className="eyebrow">
            SPOC WORKSPACE
            <span className="mx-1 text-ink-muted/50">/</span>
            NOCS
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            NOC Management
          </h1>

          <p className="mt-2 w-full max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
            Generate and manage No Objection Certificates for approved
            internship applications.
          </p>
        </motion.header>

        {isError ? (
          <QueryErrorCard
            message={getErrorMessage(loadError, "Something went wrong")}
            onRetry={handleRetry}
          />
        ) : (
          <>
            <NocStatusBanner
              pendingCount={pendingNocs.length}
              loading={isLoading}
            />

            <motion.section
              variants={staggerContainer}
              className="mt-5 grid w-full min-w-0 auto-rows-29 grid-cols-1 items-stretch gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
            >
              <NocStatCard
                icon={FileClock}
                label="Pending"
                value={pendingNocs.length}
                helper="Awaiting NOC generation"
                loading={isLoading}
              />

              <NocStatCard
                icon={FileCheck2}
                label="NOCs Generated"
                value={generatedNocs.length}
                helper="Approved applications"
                loading={isLoading}
              />

              <NocStatCard
                icon={Files}
                label="Organisations"
                value={companyCount}
                helper="Organisation with generated NOCs"
                loading={isLoading}
              />

              <NocStatCard
                icon={UsersRound}
                label="Students"
                value={studentCount}
                helper="Students covered by NOCs"
                loading={isLoading}
              />
            </motion.section>

            <div className="mt-6 flex w-full min-w-0 gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 sm:mt-7 sm:w-fit">
              <button
                type="button"
                role="tab"
                aria-selected={activeSection === "pending"}
                onClick={() => setActiveSection("pending")}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-colors sm:px-4 hover:cursor-pointer ${activeSection === "pending" ? "bg-brand-600 text-white shadow-sm" : "text-ink-muted hover:bg-brand-50 hover:text-brand-800"}`}
              >
                <ListChecks size={16} aria-hidden="true" />
                Pending NOCs
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${activeSection === "pending" ? "bg-white/15 text-white" : "bg-ink-muted/10 text-ink-muted"}`}
                >
                  {pendingNocs.length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeSection === "generated"}
                onClick={() => setActiveSection("generated")}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-colors sm:px-4 hover:cursor-pointer ${activeSection === "generated" ? "bg-brand-600 text-white shadow-sm" : "text-ink-muted hover:bg-brand-50 hover:text-brand-800"}`}
              >
                <FileCheck2 size={16} aria-hidden="true" />
                Generated NOCs
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${activeSection === "generated" ? "bg-white/15 text-white" : "bg-ink-muted/10 text-ink-muted"}`}
                >
                  {generatedNocs.length}
                </span>
              </button>
            </div>

            <div
              role="tabpanel"
              aria-label={
                activeSection === "pending" ? "Pending NOCs" : "Generated NOCs"
              }
            >
              {activeSection === "pending" ? (
                <PendingNocsSection
                  nocs={pendingNocs}
                  loading={pendingQuery.isLoading}
                  selectedIds={selectedIds}
                  generatingIds={generatingIds}
                  onToggle={handleToggle}
                  onToggleAll={handleToggleAll}
                  onClearSelection={handleClearSelection}
                  onGenerate={setTargets}
                />
              ) : (
                <GeneratedNocsSection
                  nocs={generatedNocs}
                  loading={generatedQuery.isLoading}
                  activeAction={activeAction}
                  onView={view}
                  onDownload={download}
                />
              )}
            </div>
          </>
        )}
      </motion.div>

      <GenerateNocModal
        nocs={targets}
        isGenerating={isModalGenerating}
        onConfirm={handleConfirmGenerate}
        onClose={handleCloseModal}
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default SPOCNOC;
