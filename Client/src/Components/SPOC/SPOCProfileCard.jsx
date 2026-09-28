const SPOCProfileCard = ({ label, value, icon: Icon }) => {
  return (
    <div
      className="
        flex
        min-w-0
        items-start
        gap-3
        rounded-xl
        border
        border-border
        bg-cream-soft
        p-3.5
        sm:p-4
      "
    >
      <span
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-brand-100
          text-brand-700
          sm:size-10
        "
      >
        <Icon size={17} strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.06em]
            text-ink-muted
            sm:text-[11px]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            wrap-break-word
            text-sm
            font-medium
            leading-5
            text-ink
            sm:text-[15px]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default SPOCProfileCard;
