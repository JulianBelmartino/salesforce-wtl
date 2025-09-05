// api/createLead.js
import fetch from "node-fetch"; // optional, Vercel supports fetch natively

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { first_name, last_name, email, company } = req.body;

  // Basic validation
  if (!last_name || !company) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Salesforce Web-to-Lead endpoint
  const url = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";

  // Your Salesforce Org ID
  const oid = process.env.SALESFORCE_OID; // store this in Vercel Environment Variables

  // Construct form data
  const formData = new URLSearchParams();
  formData.append("oid", oid);
  formData.append("first_name", first_name || "");
  formData.append("last_name", last_name);
  formData.append("email", email || "");
 

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      return res.status(200).json({ message: "Lead created successfully" });
    } else {
      return res.status(500).json({ error: "Failed to create lead" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
