"use server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  console.log("===== FORM SUBMISSION DEBUG =====");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  console.log("CONTACT_FORM_ID:", process.env.CONTACT_FORM_ID);
  console.log("API Key exists:", !!process.env.NOTION_API_KEY);

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  const payload = {
    parent: {
      database_id: process.env.CONTACT_FORM_ID,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      "Email Address": {
        email: email,
      },
      Message: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    },
  };

  console.log("Request payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Notion API Error Response:", data);

      // Return more specific error message
      const errorMsg = data.message || "Failed to submit form";
      return { success: false, error: errorMsg };
    }

    console.log("Form submitted successfully:", data.id);
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting form:", error);
    console.error("Error stack:", error.stack);
    return { success: false, error: error.message || "An error occurred" };
  }
}
