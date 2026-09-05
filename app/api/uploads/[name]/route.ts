import fs from "fs";
import path from "path";
import { uploadsDirectory } from "@/lib/columns";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(name)) {
    return new Response("Not found", { status: 404 });
  }
  const filePath = path.join(uploadsDirectory, name);
  if (!fs.existsSync(filePath)) return new Response("Not found", { status: 404 });
  const ext = name.split(".").pop()!.toLowerCase();
  const data = fs.readFileSync(filePath);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
