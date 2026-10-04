import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Globe2,
  Mail,
  Search,
  UserRound,
} from "lucide-react";
import { Card, Input } from "../../../../Components/index";

const CompanyDetailsStep = ({
  register,
  errors,
  organisations = [],
  selectedOrganisation,
  organisationValue,
  setValue,
}) => {
  const organisationOptions = useMemo(() => {
    return organisations.map((organisation) => ({
      label: organisation.organisationName,
      value: organisation._id,
    }));
  }, [organisations]);

  return (
    <Card className="overflow-hidden border-border bg-cream-soft shadow-card">
      <Card.Header className="border-b border-border px-5 py-5 sm:px-6">
        <Card.Title className="text-base font-semibold text-ink sm:text-lg">
          Company details
        </Card.Title>

        <Card.Description className="mt-1.5 leading-5 text-ink-muted">
          Select the organisation where you will complete your internship.
        </Card.Description>
      </Card.Header>

      <Card.Content className="px-5 py-5 sm:px-6">
        <div className="m-2 grid gap-5 sm:grid-cols-2">
          {/* Organisation */}
          <div className="sm:col-span-2">
            <SearchableOrganisationSelect
              options={organisationOptions}
              value={organisationValue}
              setValue={setValue}
              register={register}
              error={errors.organisation?.message}
              required
            />
          </div>

          {/* Organisation website */}
          <ReadOnlyField
            label="Organisation website"
            value={selectedOrganisation?.organisationSite}
            icon={<Globe2 size={16} strokeWidth={1.8} />}
          />

          {/* Organisation email */}
          <ReadOnlyField
            label="Organisation email"
            value={selectedOrganisation?.organisationMail}
            icon={<Mail size={16} strokeWidth={1.8} />}
          />

          {/* Organisation location */}
          <div className="sm:col-span-2">
            <ReadOnlyField
              label="Organisation location"
              value={selectedOrganisation?.organisationLocation}
              icon={<Building2 size={16} strokeWidth={1.8} />}
            />
          </div>

          {/* Employee/contact person */}
          <Input
            label="Apply to"
            placeholder="e.g. Priya Menon"
            required
            startIcon={<UserRound size={16} strokeWidth={1.8} />}
            error={errors.organisationsEmployye?.message}
            {...register("organisationsEmployye", {
              required: "Please provide the person you are applying to.",
            })}
          />

          {/* Designation */}
          <Input
            label="Internship role"
            placeholder="e.g. Software Engineering Intern"
            required
            error={errors.designation?.message}
            {...register("designation", {
              required: "Internship role is required.",
            })}
          />
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-cream px-3.5 py-3">
          <Building2 size={15} className="mt-0.5 shrink-0 text-ink-muted" />

          <p className="text-xs leading-5 text-ink-muted">
            Organisation information is fetched directly from the portal. You
            cannot modify the organisation website, location or email.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

const SearchableOrganisationSelect = ({
  options = [],
  value = "",
  setValue,
  register,
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    setValue("organisation", option.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setIsOpen(false);
    setSearch("");
  };

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  return (
    <div ref={containerRef} className="w-full">
      <label className="mb-2 block text-sm font-medium text-ink">
        Organisation
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {/* React Hook Form registration */}
        <input
          type="hidden"
          {...register("organisation", {
            required: "Please select an organisation.",
          })}
        />

        {/* Selected organisation button */}
        <button
          type="button"
          onClick={handleToggle}
          className="
            flex
            h-12
            w-full
            items-center
            justify-between
            gap-2
            rounded-lg
            border
            border-border
            bg-cream-soft
            px-3
            text-left
            text-sm
            outline-none
            transition-all
            focus:border-brand-600
            focus:ring-2
            focus:ring-brand-600/15
          "
        >
          <span className="flex min-w-0 items-center gap-2">
            <Building2
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-ink-muted"
            />

            <span
              className={
                selectedOption ? "truncate text-ink" : "truncate text-ink-muted"
              }
            >
              {selectedOption?.label || "Select an organisation"}
            </span>
          </span>

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className={`
              shrink-0
              text-ink-muted
              transition-transform
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="
              absolute
              z-50
              mt-2
              w-full
              overflow-hidden
              rounded-lg
              border
              border-border
              bg-cream-soft
              shadow-card
            "
          >
            {/* Search */}
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search
                  size={16}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-ink-muted
                  "
                />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search organisation..."
                  className="
                    h-10
                    w-full
                    rounded-md
                    border
                    border-border
                    bg-cream
                    pl-9
                    pr-3
                    text-sm
                    text-ink
                    outline-none
                    placeholder:text-ink-muted
                    focus:border-brand-600
                    focus:ring-2
                    focus:ring-brand-600/15
                  "
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-3
                        rounded-md
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        transition-colors
                        hover:bg-brand-600/10
                        ${
                          isSelected
                            ? "bg-brand-600/10 font-medium text-brand-700"
                            : "text-ink"
                        }
                      `}
                    >
                      <span className="truncate">{option.label}</span>

                      {isSelected && (
                        <Check size={16} strokeWidth={2} className="shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-sm text-ink-muted">
                  No organisations found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const ReadOnlyField = ({ label, value, icon }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>

      <div
        className="
          flex
          min-h-10
          w-full
          items-center
          gap-2
          rounded-md
          border
          border-border
          bg-cream
          px-3
          py-2
          text-sm
          text-ink
        "
      >
        <span className="shrink-0 text-ink-muted">{icon}</span>

        <span className="truncate">{value || "Select an organisation"}</span>
      </div>
    </div>
  );
};

export default CompanyDetailsStep;
