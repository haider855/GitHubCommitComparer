import type { BannerVariant } from "../types/app";

interface BannerProps {
  variant: BannerVariant;
  message: string;
  visible: boolean;
}

const iconByVariant: Record<BannerVariant, string> = {
  error: "ti-alert-circle",
  warn: "ti-alert-triangle",
  info: "ti-info-circle",
};

export function Banner({ variant, message, visible }: BannerProps) {
  return (
    <div className={`banner banner-${variant} ${visible ? "visible" : ""}`}>
      <i className={`ti ${iconByVariant[variant]}`} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
