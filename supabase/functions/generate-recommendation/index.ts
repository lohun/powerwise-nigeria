// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import express from 'express';
import { Request, Response, json, text } from 'express';

const app = express()

app.use(json())
app.use(text())



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClientData {
  clientId: string;
  fullName: string;
  state: string;
  lga: string;
  estimatedLoadKW: number;
  dailyUsageHours: number;
  propertyType: string;
}

app.post("/", async (req: Request, res: Response) => {
  if (req.method === "OPTIONS") {
    return res.set(corsHeaders)
    // return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientData: ClientData = await JSON.parse(req.body());
    console.log("Generating recommendation for:", clientData.fullName);

    const LOVABLE_API_KEY = "";
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are an expert electrical engineer specializing in Nigerian power solutions.
  
  CLIENT PROFILE:
  - Name: ${clientData.fullName}
  - Location: ${clientData.lga}, ${clientData.state}, Nigeria
  - Power Requirement: ${clientData.estimatedLoadKW} kW
  - Daily Usage: ${clientData.dailyUsageHours} hours
  - Property Type: ${clientData.propertyType}
  
  TASK: Provide a detailed alternate power recommendation for this Nigerian client.
  
  IMPORTANT: Return ONLY valid JSON with no markdown formatting, no backticks, no explanations outside the JSON.
  
  The JSON structure must be exactly:
  {
  "summary": "A 2-3 sentence overview of the recommended power solution",
  "reasoning": "A detailed 100-150 word explanation of why this solution is ideal for the client's needs, considering their location, load requirements, and property type",
  "primarySolution": "Solar+Battery" or "Hybrid" or "Generator+Inverter",
  "systemCapacityKW": <number - the total system capacity>,
  "solarPanelsCount": <number or null if not applicable>,
  "batteryCapacityKWh": <number or null if not applicable>,
  "inverterSizeKW": <number>,
  "products": [
    {
      "category": "Category name (Solar Panels, Battery, Inverter, etc.)",
      "name": "Specific product name and specs",
      "quantity": <number>,
      "unitPriceNGN": <number in Naira>,
      "totalPriceNGN": <calculated total>,
      "supplier": "Nigerian supplier name"
    }
  ],
  "equipmentCostNGN": <total equipment cost in Naira>,
  "installationCostNGN": <installation cost - typically 15-20% of equipment>,
  "totalCostNGN": <equipment + installation>,
  "monthlyOperatingCost": <monthly maintenance/fuel cost in Naira>,
  "roiMonths": <estimated payback period in months>
  }
  
  Use realistic 2024 Nigerian market prices. Include 3-6 product line items. Consider:
  - Solar panels: ₦80,000-120,000 per 550W panel
  - Lithium batteries: ₦400,000-600,000 per 5kWh
  - Inverters: ₦150,000-400,000 depending on capacity
  - Installation typically 15-20% of equipment cost
  - Factor in the client's location for solar irradiance and grid availability`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert Nigerian electrical engineer. Return only valid JSON, no markdown.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return res.status(429).set({ ...corsHeaders, "Content-Type": "application/json" }).json({ error: "Rate limit exceeded. Please try again in a moment." })
      }
      if (response.status === 402) {
        return res.status(402).set({ ...corsHeaders, "Content-Type": "application/json" }).json({ error: "AI credits exhausted. Please add credits to continue." })
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");

    // Clean and parse the JSON
    let cleaned = content.trim();
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/```json\s*/gi, "").replace(/```\s*/gi, "");
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();

    let recommendation;
    try {
      recommendation = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Store in database
    const supabaseUrl = process.env.VITE_SUPABASE_URL!;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: savedRec, error: dbError } = await supabase
      .from("recommendations")
      .insert({
        client_id: clientData.clientId,
        summary: recommendation.summary,
        reasoning: recommendation.reasoning,
        primary_solution: recommendation.primarySolution,
        system_capacity_kw: recommendation.systemCapacityKW,
        solar_panels_count: recommendation.solarPanelsCount,
        battery_capacity_kwh: recommendation.batteryCapacityKWh,
        inverter_size_kw: recommendation.inverterSizeKW,
        equipment_cost_ngn: recommendation.equipmentCostNGN,
        installation_cost_ngn: recommendation.installationCostNGN,
        total_cost_ngn: recommendation.totalCostNGN,
        monthly_operating_cost: recommendation.monthlyOperatingCost,
        roi_months: recommendation.roiMonths,
        products_json: recommendation.products,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save recommendation");
    }

    console.log("Recommendation saved:", savedRec.id);

    return res.set({ ...corsHeaders, "Content-Type": "application/json" }).json(savedRec);
  } catch (error) {
    console.error("Error in generate-recommendation:", error);
    return res.status(500).set({ ...corsHeaders, "Content-Type": "application/json" }).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }

})

app.listen(3000, ()=> {
  console.log("app is live on port 3000")
})
