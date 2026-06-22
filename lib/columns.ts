import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const columnsDirectory = path.join(process.cwd(), "content/columns");

export type ColumnMeta = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  tags?: string[];
};

export type Column = ColumnMeta & {
  content: string;
};

export function getAllColumnSlugs(): string[] {
  if (!fs.existsSync(columnsDirectory)) return [];
  return fs
    .readdirSync(columnsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllColumns(): ColumnMeta[] {
  const slugs = getAllColumnSlugs();
  const columns = slugs.map((slug) => {
    const fullPath = path.join(columnsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title ?? "",
      summary: data.summary ?? "",
      category: data.category ?? "일반",
      date: data.date ?? "",
      tags: data.tags ?? [],
    };
  });

  return columns.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getColumnBySlug(slug: string): Promise<Column | null> {
  const fullPath = path.join(columnsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const htmlContent = await marked(content);

  return {
    slug,
    title: data.title ?? "",
    summary: data.summary ?? "",
    category: data.category ?? "일반",
    date: data.date ?? "",
    tags: data.tags ?? [],
    content: htmlContent,
  };
}
