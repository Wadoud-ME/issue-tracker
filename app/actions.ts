"use server"; // 1. THIS IS THE MAGIC WORD.
// It tells Next.js: "Even though this looks like a normal function,
// strictly run this on the server. Never send this code to the browser."

import { prisma } from "@/lib/db"; // Import the connection we made in Step 5
import { revalidatePath } from "next/cache";

// --- ACTION 1: SAVE DATA ---
export async function createClassification(formData: FormData) {
  // formData is the raw data coming from the HTML <form> input
  const name = formData.get("name") as string;

  // Basic validation: If the user typed nothing, stop here.
  if (!name || !name.trim()) {
    throw new Error("Name is required");
  }

  // Talk to the database
  try {
    await prisma.classification.create({
      data: {
        name: name.trim(),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create classification:", error);
    return { success: false, error: "Failed to create space" };
  }

  // RevalidatePath is like hitting "Refresh" on the data.
  // It tells Next.js: "The data on the homepage changed.
  // Next time you show it, fetch the fresh list."
}

// --- ACTION 2: GET DATA ---
export async function getClassifications() {
  // Talk to the database
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const items = await prisma.classification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      // ADD THIS: Include the count of issues
      include: {
        _count: {
          select: { issues: true },
        },
      },
    });

    return items;
  } catch (error) {
    console.error("Failed to fetch classifications:", error);
    throw new Error("Failed to load classifications");
  }
}

// --- ACTION 3: DELETE DATA ---

export async function deleteClassification(id: string) {
  try {
    await prisma.classification.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete space", error);
    return { success: false, error: "Failed to delete" };
  }
}

/**
 * 1. GET ISSUES
 * Fetches all issues belonging to a specific Space ID
 */
export async function getIssues(spaceId: string) {
  if (!spaceId) return [];
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const issues = await prisma.issue.findMany({
      where: {
        spaceId: spaceId,
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
    });
    return issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
}

/**
 * 2. CREATE ISSUE
 */
export async function createIssue(formData: FormData) {
  const title = formData.get("title") as string;
  const spaceId = formData.get("spaceId") as string;
  const priority = (formData.get("priority") as string) || "medium";
  const label = (formData.get("label") as string) || "feature";

  if (!title || !spaceId) {
    return { success: false, message: "Title and Space ID are required" };
  }

  try {
    await prisma.issue.create({
      data: {
        title,
        spaceId,
        priority,
        label,
        status: "todo", // Default status
      },
    });

    // Refresh the page data so the new issue appears
    revalidatePath(`/spaces/${spaceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating issue:", error);
    return { success: false, message: "Database Error" };
  }
}

/**
 * 3. DELETE ISSUE (for Drag and Drop later)
 */

export async function deleteIssue(issueId: string, spaceId: string) {
  try {
    await prisma.issue.delete({
      where: { id: issueId },
    });

    revalidatePath(`/spaces/${spaceId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete issue:", error);
    return { success: false, message: "Failed to delete" };
  }
}

/**
 * 4. UPDATE ISSUE
 */
export async function updateIssue(
  issueId: string,
  spaceId: string,
  updates: { status?: string; priority?: string }
) {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: updates,
    });

    revalidatePath(`/spaces/${spaceId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update issue", error);
    return { success: false, message: "Failed to update" };
  }
}
