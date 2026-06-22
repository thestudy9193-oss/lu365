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
          className={`section-label mb-3 ${center ? "justify-center" : ""}`}
          style={{ color: subColor }}
        >
          <span>{en}</span>
        </div>
      )}
      <h2
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: textColor, letterSpacing: "-0.3px" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: subtitleColor }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
