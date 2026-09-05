type SectionTitleProps = {
  en?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
};

export default function SectionTitle({
  en,
  title,
  subtitle,
  center = true,
  light = false,
}: SectionTitleProps) {
  const textColor = light ? "rgba(250,246,241,0.9)" : "#2A1C14";
  const subColor = light ? "rgba(200,168,130,0.8)" : "#9E8676";
  const subtitleColor = light ? "rgba(200,180,168,0.7)" : "#705C4F";

  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      {en && (
        <div
          className={`flex items-center gap-3 mb-3 ${center ? "justify-center" : ""}`}
          style={{ color: subColor }}
        >
          <span className="w-7 h-px" style={{ backgroundColor: "currentColor", opacity: 0.4 }} />
          <span className="eyebrow-serif text-sm" style={{ opacity: 0.85 }}>{en}</span>
          <span className="w-7 h-px" style={{ backgroundColor: "currentColor", opacity: 0.4 }} />
        </div>
      )}
      <h2
        className="font-serif-kr text-[1.7rem] sm:text-4xl font-semibold text-balance-ko"
        style={{ color: textColor, letterSpacing: "-0.5px", lineHeight: 1.25 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-sm sm:text-base leading-[1.85] max-w-2xl text-balance-ko ${center ? "mx-auto" : ""}`}
          style={{ color: subtitleColor }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
