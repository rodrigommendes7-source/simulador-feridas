type InfoBannerVariant = "info" | "success";

export function InfoBanner({
  variant = "info",
  children,
}: {
  variant?: InfoBannerVariant;
  children: React.ReactNode;
}) {
  const styles: Record<InfoBannerVariant, React.CSSProperties> = {
    info: {
      background: "var(--color-info-subtle)",
      border: "0.5px solid var(--color-info-border)",
      color: "var(--color-info)",
    },
    success: {
      background: "var(--color-success-subtle)",
      border: "0.5px solid var(--color-success-border)",
      color: "var(--color-success)",
    },
  };

  return (
    <p
      style={{
        ...styles[variant],
        fontSize: "var(--text-label)",
        lineHeight: "var(--leading-normal)",
        padding: "var(--space-sm) var(--space-md)",
        borderRadius: "var(--radius-md)",
        textAlign: "center",
        maxWidth: "600px",
      }}
    >
      {children}
    </p>
  );
}
