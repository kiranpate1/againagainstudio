"use server";

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

if (!ZAPIER_WEBHOOK_URL) {
  throw new Error("ZAPIER_WEBHOOK_URL is not defined in environment variables");
}

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to submit form" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "An error occurred" };
  }
}
