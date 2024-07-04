import { readingStatusValues } from "@/types/book";
import { object, picklist } from "valibot";

export const readingStatusSchema = object({
  status: picklist(readingStatusValues),
});
