/**
 * GitHub 레포를 칼럼 저장소로 쓰기 위한 얇은 래퍼.
 *
 * 왜 GitHub 인가 —
 * Vercel Blob 은 무료 플랜에서 advanced operation 월 2,000회 한도가 있고, 이를 넘기면
 * 스토어가 통째로 정지(limits-exceeded-suspended)되어 읽기까지 403 이 된다. 실제로
 * 2026-09 에 이 일이 나서 칼럼이 전부 사라졌다. GitHub 은 레포 쓰기에 이런 한도가 없고,
 * 커밋이 곧 배포라 파일이 그대로 사이트에 실린다.
 *
 * 읽기는 배포된 번들의 content/columns 를 그대로 쓰므로 API 를 소모하지 않는다.
 * 이 모듈은 "쓰기"(발행·수정·삭제·이미지 업로드)에서만 쓰인다.
 */

const API = "https://api.github.com";

const repo = () => process.env.GITHUB_REPO || "";
const branch = () => process.env.GITHUB_BRANCH || "main";
const token = () => process.env.GITHUB_TOKEN || "";

/** 글쓰기를 GitHub 커밋으로 처리할 수 있는 상태인가 */
export const useGithub = () => Boolean(token() && repo());

/** 배포 환경인데 저장소가 없으면 파일시스템은 휘발되므로 저장한 척하면 안 된다 */
export const isEphemeral = () => Boolean(process.env.VERCEL) && !useGithub();

type GhFile = { path: string; content: string; encoding: "utf-8" | "base64" };

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${init?.method ?? "GET"} ${path} 실패 (HTTP ${res.status}) ${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * 파일 여러 개를 커밋 하나로 묶어 올린다 (Git Data API).
 * 글 1건 + 이미지 5장을 한 번에 올려 배포도 한 번만 돌게 하려는 것.
 * 다른 커밋이 먼저 들어와 ref 가 움직였으면 한 번 다시 시도한다.
 */
export async function commitFiles(
  files: GhFile[],
  deletions: string[],
  message: string,
  attempt = 0
): Promise<string> {
  const r = repo();
  const b = branch();

  const ref = await gh(`/repos/${r}/git/ref/heads/${b}`);
  const baseSha: string = ref.object.sha;
  const baseCommit = await gh(`/repos/${r}/git/commits/${baseSha}`);

  const tree: Record<string, unknown>[] = [];
  for (const f of files) {
    const blob = await gh(`/repos/${r}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: f.content, encoding: f.encoding === "utf-8" ? "utf-8" : "base64" }),
    });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  for (const p of deletions) tree.push({ path: p, mode: "100644", type: "blob", sha: null });
  if (tree.length === 0) return baseSha;

  const newTree = await gh(`/repos/${r}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }),
  });
  const commit = await gh(`/repos/${r}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
  });

  try {
    await gh(`/repos/${r}/git/refs/heads/${b}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
  } catch (e) {
    // 그 사이 다른 커밋이 들어온 경우 — 최신 ref 로 한 번만 다시 쌓는다
    if (attempt < 2) return commitFiles(files, deletions, message, attempt + 1);
    throw e;
  }
  return commit.sha;
}

/** 레포에 그 경로의 파일이 있는가 (방금 커밋해 아직 배포 안 된 파일도 잡힌다) */
export async function existsInRepo(path: string): Promise<boolean> {
  try {
    await gh(`/repos/${repo()}/contents/${encodeURI(path)}?ref=${branch()}`);
    return true;
  } catch {
    return false;
  }
}

/** 배포 번들보다 레포가 최신일 수 있으므로, 파일시스템에 없으면 여기서 읽는다 */
export async function readFromRepo(path: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${repo()}/${branch()}/${encodeURI(path)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.text();
}
