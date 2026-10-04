import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";

import { Card, Button } from "../../Components";

import { StepOneFields, StepTwoFields } from "../../Components/SignupFields";

import StepIndicator from "../../Components/StepIndicator";

const SignupCard = ({
  step,
  direction,
  register,
  errors,
  watch,
  showPassword,
  setShowPassword,
  handleSignatureChange,
  goToStepTwo,
  goToStepOne,
  submitStepTwo,
  isLoading,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        min-w-0
        lg:h-full
        lg:min-h-0
      "
    >
      <Card
        className="
          flex
          h-full
          max-h-full
          w-full
          flex-col
          overflow-hidden
          rounded-2xl
          border-border
          bg-cream-soft/95
          shadow-card
        "
      >
        {/* HEADER */}

        <div
          className="
            shrink-0
            border-b
            border-border
            px-5
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  font-semibold
                  tracking-tight
                  text-ink
                  sm:text-xl
                "
              >
                Student registration
              </h2>

              <p
                className="
                  mt-1
                  max-w-xl
                  text-xs
                  leading-5
                  text-ink-muted
                  sm:text-sm
                "
              >
                Complete the registration process by providing the required
                details carefully.
              </p>

              {/* IMPORTANT */}

              <div
                className="
                  mt-2.5
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50/70
                  px-3
                  py-2
                  text-[10px]
                  leading-4
                  text-amber-800
                "
              >
                <span className="font-semibold">Important:</span> Please review
                your information carefully before submitting. Some registration
                details cannot be changed after account creation.
              </div>
            </div>

            {/* STEP BADGE */}

            <div
              className="
                hidden
                shrink-0
                rounded-full
                border
                border-brand-200
                bg-brand-50
                px-3
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-brand-700
                sm:block
              "
            >
              STEP {step}/2
            </div>
          </div>

          {/* STEP INDICATOR */}

          <div className="mt-5">
            <StepIndicator currentStep={step} />
          </div>
        </div>

        {/* FORM CONTENT */}

        <div
          className="
            min-h-0
            flex-1
            overflow-hidden
            px-5
            py-5
            sm:px-6
          "
        >
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step-one"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 20 : -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -20 : 20,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <StepOneFields
                  register={register}
                  errors={errors}
                  watch={watch}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-two"
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 20 : -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -20 : 20,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <StepTwoFields
                  register={register}
                  errors={errors}
                  watch={watch}
                  handleSignatureChange={handleSignatureChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}

        <div
          className="
            shrink-0
            flex
            min-h-19
            items-center
            justify-between
            gap-3
            border-t
            border-border
            bg-cream-soft
            px-5
            py-3
            sm:px-6
          "
        >
          <div className="min-w-0">
            <p
              className="
                max-w-[320px]
                text-[10px]
                leading-4
                text-ink-muted
              "
            >
              By creating your account, you confirm that the information
              provided is accurate.
            </p>
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              justify-end
              gap-2
            "
          >
            {/* BACK */}

            {step === 2 && (
              <Button
                type="button"
                variant="secondary"
                onClick={goToStepOne}
                disabled={isLoading}
                className="
                  h-12
                  min-w-23
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                "
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </Button>
            )}

            {/* CONTINUE */}

            {step === 1 && (
              <Button
                type="button"
                onClick={goToStepTwo}
                className="
                  h-12
                  min-w-37
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border-0
                  bg-brand-700
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-brand-800
                  hover:shadow-md
                  focus-visible:ring-2
                  focus-visible:ring-brand-700
                  focus-visible:ring-offset-2
                "
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </Button>
            )}

            {/* CREATE ACCOUNT */}

            {step === 2 && (
              <Button
                type="button"
                disabled={isLoading}
                onClick={submitStepTwo}
                className="
                  h-12
                  min-w-42
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border-0
                  bg-brand-700
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-brand-800
                  hover:shadow-md
                  focus-visible:ring-2
                  focus-visible:ring-brand-700
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isLoading ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" />

                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <Check size={15} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SignupCard;
