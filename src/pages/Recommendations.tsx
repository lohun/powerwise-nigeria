import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RecommendationsTable } from "@/components/RecommendationsTable";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface RecommendationRow {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  location: string;
  primary_solution: string;
  system_capacity_kw: number;
  total_cost_ngn: number;
  roi_months: number | null;
  generated_at: string;
}

export default function Recommendations() {
  const [data, setData] = useState<RecommendationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const { data: recommendations, error } = await supabase
          .from("recommendations")
          .select(`
            id,
            primary_solution,
            system_capacity_kw,
            total_cost_ngn,
            roi_months,
            generated_at,
            clients (
              full_name,
              email,
              phone,
              state,
              lga
            )
          `)
          .order("generated_at", { ascending: false });

        if (error) throw error;

        const transformed: RecommendationRow[] = (recommendations || []).map((rec: any) => ({
          id: rec.id,
          client_name: rec.clients?.full_name || "Unknown",
          client_email: rec.clients?.email || "",
          client_phone: rec.clients?.phone || "",
          location: `${rec.clients?.lga || ""}, ${rec.clients?.state || ""}`,
          primary_solution: rec.primary_solution,
          system_capacity_kw: Number(rec.system_capacity_kw),
          total_cost_ngn: Number(rec.total_cost_ngn),
          roi_months: rec.roi_months,
          generated_at: rec.generated_at,
        }));

        setData(transformed);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-solar-gold/20 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 text-primary-foreground"
          >
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Recommendations
              </h1>
              <p className="text-primary-foreground/80">
                View and export all generated power recommendations.
              </p>
            </div>
            <Button asChild variant="solar" size="lg">
              <Link to="/assessment">
                <Plus className="h-5 w-5" />
                New Assessment
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 60L1440 60V30C1320 10 1200 0 1080 0C960 0 840 20 720 30C600 40 480 40 360 30C240 20 120 10 60 5L0 0V60Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Table Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <RecommendationsTable data={data} isLoading={isLoading} />
        </div>
      </section>
    </Layout>
  );
}
