import type { Metadata } from "next";
import ColumnCard from "@/components/ColumnCard";
import SectionTitle from "@/components/SectionTitle";
import { getAllColumns } from "@/lib/columns";

export const metadata: Metadata = {
  title: "건강 칼럼",
  description:
    "루원365한의원 건강 칼럼. 통증 관리, 교통사고, 생활습관, 환절기 건강 관리 등 다양한 주제를 다룹니다.",
};

export default function ColumnsPage() {
  const columns = getAllColumns();

  return (
    <>
      {/* 페이지 헤더 */}
      <section
        className="bg-canvas-soft py-14 px-4 text-center"
        style={{ borderBottom: "1px solid rgba(32,21,21,0.08)" }}
      >
        <p className="eyebrow mb-3">건강 칼럼</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
          한의원에서 전하는 건강 정보
        </h1>
        <p className="text-body text-sm sm:text-base max-w-xl mx-auto">
          정보 제공을 목적으로 작성된 칼럼이며, 의료 상담을 대체하지 않습니다.
        </p>
      </section>

      {/* 칼럼 목록 */}
      <section className="py-14 px-4 bg-canvas">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            en={`Total ${columns.length}`}
            title="칼럼 목록"
          />

          {columns.length === 0 ? (
            <p className="text-center text-mute py-20 text-sm">
              아직 등록된 칼럼이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((column) => (
                <ColumnCard key={column.slug} column={column} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
