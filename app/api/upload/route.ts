import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  console.log("🔔 Upload API hit");

  const formData = await req.formData();

  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const folder = formData.get("folder") as string;
  if (!file || !userId) {
    return NextResponse.json(
      { error: "Missing file or userId" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(folder)
    .upload(`${userId}_${file.name}`, buffer, {
      contentType: file.type || "image/png",
      upsert: true,
    });

  if (error) {
    console.error(" Supabase upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const publicUrl = supabase.storage.from(folder).getPublicUrl(data.path)
    .data.publicUrl;

  return NextResponse.json({ url: publicUrl });
}

export async function DELETE(req: NextRequest) {
  const formData = await req.formData();

  const filepath = formData.get("filepath") as string;

  const folder = formData.get("folder") as string;
  if (!filepath || !folder) {
    return NextResponse.json(
      { error: "Missing filepath or folder" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(`${folder}`)
    .remove([`${filepath}`]);
  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({ data: "success" }, { status: 200 });
}
