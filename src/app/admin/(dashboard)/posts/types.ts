import type { PostStatus } from "@/lib/contracts/blog";
import type { FieldErrors } from "@/lib/errors";

export type SaveState =
  | { kind: "idle" }
  | { kind: "error"; message: string; fieldErrors: FieldErrors }
  | { kind: "saved"; message: string; status: PostStatus; slug: string };

export type { UploadResult } from "@/lib/images/uploadTypes";

/** Serializable initial values handed from the server page to the editor. */
export interface EditorValues {
  title: string;
  slug: string;
  description: string;
  seoTitle: string;
  contentMarkdown: string;
  coverUrl: string;
  coverAlt: string;
}

export const EMPTY_EDITOR_VALUES: EditorValues = {
  title: "",
  slug: "",
  description: "",
  seoTitle: "",
  contentMarkdown: "",
  coverUrl: "",
  coverAlt: "",
};
