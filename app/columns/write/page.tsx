import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ColumnEditor from "@/components/columns/ColumnEditor";
import { isEditor } from "@/lib/auth";
import { MAX_BODY_IMAGES, getColumnBySlug, toDateTimeLocal } from "@/lib/columns";
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
            본문 입력창 위의 <strong>서식 도구</strong>로 소제목 · 인용구 · 목록 · 글자색 · 형광펜을 넣을 수 있습니다.
            글을 드래그해서 선택한 뒤 버튼을 누르면 그 부분에 적용됩니다. 목표 분량은 공백 제외 1,500자입니다.
          </p>
        </div>

        <ColumnEditor
          categories={siteConfig.columnCategories}
          maxBodyImages={MAX_BODY_IMAGES}
          initial={
            existing
              ? {
                  slug: existing.slug,
                  title: existing.title,
                  summary: existing.summary,
                  category: existing.category,
                  tags: existing.tags.join(", "),
                  body: existing.raw,
                  thumbnail: existing.thumbnail,
                  images: existing.images,
                  publishAt: toDateTimeLocal(existing.publishAt),
                  scheduled: existing.scheduled,
                }
              : undefined
          }
        />
      </div>
    </section>
  );
}
