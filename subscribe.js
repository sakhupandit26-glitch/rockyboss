export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event_source_url } = req.body;

    const accessToken = process.env.META_ACCESS_TOKEN;
    const pixelId = "2360101954817649";

    const response = await fetch(
      `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [
            {
              event_name: "Subscribe",
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              event_source_url: event_source_url || "",
              user_data: {
                client_ip_address:
                  req.headers["x-forwarded-for"]?.split(",")[0] || "",
                client_user_agent: req.headers["user-agent"] || ""
              }
            }
          ]
        })
      }
    );

    const result = await response.json();

    return res.status(response.ok ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
