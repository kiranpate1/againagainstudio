"use server";

export type Event = {
  id: string;
  eventName: string;
  date: string | null;
  description: string;
  link: string | null;
  image: string | null;
  hasHost: boolean;
  hostName: string;
};

export async function debugNotionDatabase() {
  // console.log("===== NOTION DEBUG START =====");
  // console.log("Database ID:", process.env.EVENTS_DATABASE_ID);
  // console.log("API Key exists:", !!process.env.NOTION_API_KEY);
  // console.log("API Key length:", process.env.NOTION_API_KEY?.length);

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.EVENTS_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response OK:", response.ok);
    console.log("Full response data:", JSON.stringify(data, null, 2));
    console.log("Total results:", data.results?.length || 0);

    if (data.results && data.results.length > 0) {
      const firstPage: any = data.results[0];
      console.log("\nProperty names in your database:");
      console.log(Object.keys(firstPage.properties));

      console.log("\nFirst page full properties:");
      console.log(JSON.stringify(firstPage.properties, null, 2));
    } else if (data.object === "error") {
      console.error("Notion API returned an error:");
      console.error("Code:", data.code);
      console.error("Message:", data.message);
    } else {
      console.log("No results found. Full data:", data);
    }

    return data.results || [];
  } catch (error: any) {
    console.error("Notion API Error:", error);
    console.error("Error details:", error.message);
    return [];
  }
}

export async function getNotionEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.EVENTS_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sorts: [
            {
              property: "Date",
              direction: "ascending",
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Notion API Error Response:", data);
      return [];
    }

    const events = data.results.map((page: any) => {
      const props = page.properties;

      // Log the actual property names for debugging
      console.log("Available properties:", Object.keys(props));

      return {
        id: page.id,
        eventName: props["Event name"]?.title?.[0]?.plain_text || "",
        date: props.Date?.date?.start || null,
        description: props.Description?.rich_text?.[0]?.plain_text || "",
        link: props.Link?.url || null,
        image:
          props.Image?.files?.[0]?.file?.url ||
          props.Image?.files?.[0]?.external?.url ||
          null,
        hasHost: props["Has host"]?.checkbox || false,
        hostName: props["Host name"]?.rich_text?.[0]?.plain_text || "",
      };
    });

    return events;
  } catch (error: any) {
    console.error("Notion API Error:", error);
    console.error("Error details:", error.message);
    return [];
  }
}
