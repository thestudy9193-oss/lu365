import { marked } from "marked";

/**
 * 칼럼 마크다운 → HTML.
 *
 * marked(GFM)는 물결표 한 개(~)도 취소선으로 해석해서 "주 3~5회, 2~4주" 같은
 * 범위 표기가 <del>5회, 2</del> 로 그어져 나온다. 칼럼에서 취소선은 쓰지 않고
 * 범위 표기는 자주 쓰므로, 렌더 전에 모든 ~ 를 이스케이프해 글자 그대로 보이게 한다.
 * (서버 렌더와 글쓰기 미리보기가 같은 결과를 내도록 둘 다 이 함수를 쓴다.)
 */
export const escapeTildes = (md: string) => md.replace(/~/g, "\\~");

export function renderMarkdown(md: string): string {
  return marked.parse(escapeTildes(md), { async: false }) as string;
}
