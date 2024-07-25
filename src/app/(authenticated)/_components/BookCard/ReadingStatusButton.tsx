import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";

type Props = {
  status: ReadingStatus;
  meta: ReadingStatusMetadataItem;
  selected: boolean;
};

export const readingStatusOrder: ReadingStatus[] = [
  "want_read",
  "reading",
  "read",
] as const;

export default function ReadingStatusButton({ status, meta, selected }: Props) {
  const Icon = selected ? meta.IconFilled : meta.IconSolid;

  return (
    <button
      className="h-14 w-20 rounded-2xl bg-card transition hover:brightness-95"
      key={meta.label}
      type="submit"
      name="status"
      value={selected ? "none" : status}
    >
      <Icon className="mx-auto mb-1 h-6 w-6" />
      <span className="text-xxs">{meta.label}</span>
    </button>
  );
}
