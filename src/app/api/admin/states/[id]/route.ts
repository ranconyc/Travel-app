import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedState = await prisma.state.update({
      where: { id },
      data: {
        name: body.name,
        code: body.code,
        slug: body.slug,
        type: body.type,
        imageHeroUrl: body.imageHeroUrl,
        imageHeroPublicId: body.imageHeroPublicId,
        coords: body.coords,
      },
    });

    revalidatePath(`/admin/destinations`);
    revalidatePath(`/${body.type}/${body.slug}`);

    return NextResponse.json({ success: true, state: updatedState });
  } catch (error) {
    console.error("Failed to update state:", error);
    return NextResponse.json(
      { error: "Failed to update state" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.state.delete({
      where: { id },
    });

    revalidatePath(`/admin/destinations`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete state:", error);
    return NextResponse.json(
      { error: "Failed to delete state" },
      { status: 500 },
    );
  }
}
