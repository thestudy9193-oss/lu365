import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ColumnEditor from "@/components/columns/ColumnEditor";
import { isEditor } from "@/lib/auth";
import { getColumnBySlug } from "@/lib/columns";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "글쓰기",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ edit?: string }> };

export default async function WritePage({ searchParams }: Props) {
  if (!(await isEditor())) redirect("/columns?auth=required");

  const { edit } = await searchParams;
  const existing = edit ? await getColumnBySlug(decodeURIComponent(edit)) : null;
  if (edit && !existing) redirect("/columns");

  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-8 bg-canvas min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="font-display italic text-sm mb-2" style={{ color: "#9E8676" }}>Luwon Story Editor</p>
          <h1 className="font-serif-kr text-2xl sm:text-3xl font-semibold" style={{ color: "#2A1C14" }}>
            {existing ? "글 수정" : "새 글 작성"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "#705C4F" }}>
            본문은 마크다운으로 작성합니다. <code className="text-xs px-1.5 py-0.5" style={{ backgroundColor: "#F0E8DE" }}>## 소제목</code>,{" "}
            <code className="text-xs px-1.5 py-0.5" style={{ backgroundColor: "#F0E8DE" }}>**강조**</code>,{" "}
            <code className="text-xs px-1.5 py-0.5" style={{ backgroundColor: "#F0E8DE" }}>- 목록</code> 을 사용할 수 있습니다.
          </p>
        </div>

        <ColumnEditor
          categories={siteConfig.columnCategories}
          initial={
            existing
              ? {
                  slug: existing.slug,
                  title: existing.title,
                  summary: existing.summary,
                  category: existing.category,
                  tags: existing.tags.join(", "),
                  date: existing.date,
                  body: existing.raw,
                  thumbnail: existing.thumbnail,
                }
              : undefined
          }
        />
      </div>
    </section>
  );
}
