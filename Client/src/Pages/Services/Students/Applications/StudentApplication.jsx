import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../../../Components/index";
import { pageFade, stepAnimation } from "../../../../Animations/animations";
import ApplicationStepper from "./ApplicationStepper.jsx";
import StudentDetailsStep from "./StudentDetailsStep.jsx";
import CompanyDetailsStep from "./CompanyDetailsStep.jsx";
import InternshipDetailsStep from "./InternshipDetailsStep.jsx";
import { useOrganisations } from "../../../../Services/Queries/organisation.queries";
import { useSubmitStudentApplication } from "../../../../Services/Queries/studentApplication.queries";

const StudentApplicationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",

    defaultValues: {
      semester: "6",

      organisation: "",
      organisationsEmployye: "",
      designation: "",
      internshipType: "",
      tentativeWorkLocations: "",
      tentativeStartDate: "",
      tentativeEndDate: "",
      modeOfInternship: "",
      description: "",
    },
  });

  /*
   * Fetch organisations from backend
   */
  const {
    data: organisationsResponse,
    isLoading: organisationsLoading,
    isError: organisationsError,
  } = useOrganisations();

  /*
   * Application submission mutation
   */
  const { mutateAsync: submitApplication } = useSubmitStudentApplication();

  /*
   * Backend response:
   *
   * {
   *   data: [...]
   * }
   */
  const organisations = useMemo(() => {
    return organisationsResponse?.data || [];
  }, [organisationsResponse]);

  const selectedOrganisationId = watch("organisation");

  /*
   * Find the selected organisation from the backend data.
   */
  const selectedOrganisation = useMemo(() => {
    if (!selectedOrganisationId) {
      return null;
    }

    return (
      organisations.find(
        (organisation) => organisation._id === selectedOrganisationId,
      ) || null
    );
  }, [organisations, selectedOrganisationId]);

  /*
   * If the selected organisation is removed/invalid,
   * clear the selected value.
   */
  useEffect(() => {
    if (
      selectedOrganisationId &&
      organisations.length > 0 &&
      !selectedOrganisation
    ) {
      setValue("organisation", "");
    }
  }, [selectedOrganisationId, organisations, selectedOrganisation, setValue]);

  const stepFields = {
    1: ["semester"],

    2: ["organisation", "organisationsEmployye", "designation"],

    3: [
      "tentativeWorkLocations",
      "tentativeStartDate",
      "tentativeEndDate",
      "modeOfInternship",
      "internshipType",
    ],
  };

  const goNext = async () => {
    const fields = stepFields[currentStep];

    const valid = await trigger(fields);

    if (!valid) {
      return;
    }

    /*
     * Don't allow step 2 to continue without a valid
     * backend organisation.
     */
    if (currentStep === 2 && !selectedOrganisation) {
      return;
    }

    setDirection(1);

    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const goBack = () => {
    if (currentStep === 1) {
      navigate("/students/applications");
      return;
    }

    setDirection(-1);

    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const onSubmit = async (data) => {
    /*
     * Organisation information is NOT taken from
     * the submitted form.
     *
     * Only the organisation ID is sent.
     */
    if (!selectedOrganisation) {
      return;
    }
    const applicationPayload = {
      semester: Number(data.semester),
      organisation: data.organisation,
      organisationsEmployye: data.organisationsEmployye.trim(),
      designation: data.designation.trim(),
      tentativeStartDate: data.tentativeStartDate,
      tentativeEndDate: data.tentativeEndDate,
      tentativeWorkLocations: [data.tentativeWorkLocations.trim()],
      internshipType: data.internshipType,
      modeOfInternship: data.modeOfInternship,
      description: data.description?.trim() || "",
    };

    await submitApplication(applicationPayload);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.section
        initial="hidden"
        animate="visible"
        variants={pageFade}
        className="
          flex min-h-[calc(100dvh-4rem)]
          items-center justify-center
          px-4 py-8
          sm:px-6
        "
      >
        <Card
          className="
            w-full max-w-lg
            border-border
            bg-cream-soft
            p-8
            text-center
            shadow-card
          "
        >
          <div
            className="
              mx-auto flex size-14
              items-center justify-center
              rounded-full
              bg-brand-50
              text-brand-700
            "
          >
            <CheckCircle2 size={28} strokeWidth={1.8} />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-ink">
            Application submitted
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
            Your internship application has been submitted successfully and is
            now ready for review.
          </p>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => navigate("/students/applications")}
            className="
              mt-6
              bg-brand-700
              text-white
              hover:bg-brand-800
              focus-visible:ring-brand-700
            "
          >
            View my applications
          </Button>
        </Card>
      </motion.section>
    );
  }

  return (
    <>
      <title>New Internship Application | JGEC Internship Portal</title>

      <meta
        name="description"
        content="Complete and submit your internship application through the JGEC Internship Portal."
      />

      <meta name="robots" content="noindex, nofollow" />

      <meta name="theme-color" content="#ffffff" />

      <meta
        property="og:title"
        content="New Internship Application | JGEC Internship Portal"
      />

      <meta
        property="og:description"
        content="Complete and submit your internship application for review."
      />

      <meta property="og:type" content="website" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={pageFade}
        className="
          min-h-[calc(100dvh-4rem)]
          bg-cream
          px-4 py-6
          sm:px-6
          lg:px-8
        "
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Applications</p>

              <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                New internship application
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                Complete the details below to submit your internship application
                for review.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-cream-soft px-3 py-1.5 text-xs font-medium text-ink-muted">
              <span className="size-1.5 rounded-full bg-brand-700" />
              Step {currentStep} of 3
            </div>
          </div>

          <ApplicationStepper currentStep={currentStep} />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentStep === 1 && (
                <StudentDetailsStep register={register} errors={errors} />
              )}

              {currentStep === 2 && (
                <CompanyDetailsStep
                  register={register}
                  errors={errors}
                  organisations={organisations}
                  selectedOrganisation={selectedOrganisation}
                />
              )}

              {currentStep === 3 && (
                <InternshipDetailsStep
                  register={register}
                  errors={errors}
                  watch={watch}
                />
              )}
            </motion.div>

            {organisationsError && currentStep === 2 && (
              <p className="mt-3 text-sm text-red-600">
                Unable to load organisations. Please try again.
              </p>
            )}

            <div
              className="
                mt-5 flex flex-col-reverse
                gap-3 border-t border-border
                pt-5 sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={goBack}
                className="
                  text-ink-muted
                  hover:bg-cream-dark
                  hover:text-ink
                "
              >
                <ArrowLeft size={16} strokeWidth={1.9} />

                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={goNext}
                  disabled={currentStep === 2 && organisationsLoading}
                  className="
                    bg-brand-700
                    text-white
                    hover:bg-brand-800
                    focus-visible:ring-brand-700
                  "
                >
                  {currentStep === 2 && organisationsLoading
                    ? "Loading organisations..."
                    : "Continue"}

                  <ArrowRight size={16} strokeWidth={1.9} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="
                    bg-brand-700
                    text-white
                    hover:bg-brand-800
                    focus-visible:ring-brand-700
                  "
                >
                  {isSubmitting ? "Submitting..." : "Submit application"}

                  {!isSubmitting && <ArrowRight size={16} strokeWidth={1.9} />}
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.section>
    </>
  );
};

export default StudentApplicationPage;
