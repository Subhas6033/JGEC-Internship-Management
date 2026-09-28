import { Card } from "../index";

const SPOCStatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <Card
      className="
        box-border
        w-full
        min-w-0
        max-w-full
        border-border
        bg-surface
        p-0
        shadow-(--shadow-card)
        transition-shadow
        duration-200
        hover:shadow-(--shadow-card-hover)
      "
    >
      <Card.Content
        className="
          w-full
          min-w-0
          p-5
          sm:p-5
        "
      >
        <div
          className="
            flex
            w-full
            min-w-0
            items-start
            justify-between
            gap-3 p-4
            sm:gap-4
          "
        >
          <div className="min-w-0 flex-1">
            <p
              className="
                truncate
                text-xs
                font-medium
                text-ink-muted
                sm:text-sm
              "
              title={title}
            >
              {title}
            </p>

            <p
              className="
                mt-1.5
                truncate
                text-xl
                font-bold
                leading-tight
                tracking-tight
                text-ink
                sm:mt-2
                sm:text-2xl
              "
              title={String(value)}
            >
              {value}
            </p>

            <p
              className="
                mt-1
                wrap-break-word
                text-[11px]
                leading-4
                text-ink-muted
                sm:text-xs
                sm:leading-5
              "
              title={description}
            >
              {description}
            </p>
          </div>

          {Icon && (
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
              <Icon size={18} strokeWidth={2} />
            </span>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default SPOCStatCard;
