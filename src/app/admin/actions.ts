"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth/session";
import { collection, Collections, type ProjectRequestDoc } from "@/lib/db/collections";
import { REQUEST_STATUSES, type RequestStatus } from "@/components/admin/status-pill";
import { audit } from "@/lib/security/audit";

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const session = await requireAdmin(); // re-check every call — never trust client
  if (!REQUEST_STATUSES.includes(status)) throw new Error("Invalid status");
  if (!ObjectId.isValid(id)) throw new Error("Invalid id");

  const col = await collection<ProjectRequestDoc>(Collections.ProjectRequests);
  const existing = await col.findOne({ _id: new ObjectId(id) }, { projection: { status: 1 } });
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

  await audit({
    type: "admin.request.status_changed",
    actor: session.user?.email ?? undefined,
    target: id,
    meta: { from: existing?.status, to: status },
  });

  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
}
