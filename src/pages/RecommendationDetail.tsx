import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Sun,
  Battery,
  Gauge,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  TrendingUp,
  Package,
  Wrench,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, formatNumber, formatDateTime } from "@/lib/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { PricingModal } from "@/components/PricingModal";
import { useLocation } from "react-router-dom";

interface Product {
  category: string;
  name: string;
  quantity: number;
  unitPriceNGN: number;
  totalPriceNGN: number;
  supplier: string;
}

interface RecommendationData {
  id: string;
  summary: string;
  reasoning: string;
  primary_solution: string;
  system_capacity_kw: number;
  solar_panels_count: number | null;
  battery_capacity_kwh: number | null;
  inverter_size_kw: number | null;
  equipment_cost_ngn: number;
  installation_cost_ngn: number;
  total_cost_ngn: number;
  monthly_operating_cost: number;
  roi_months: number | null;
  products_json: Product[];
  generated_at: string;
  client: {
    full_name: string;
    email: string;
    phone: string;
    business_name: string | null;
    state: string;
    lga: string;
    address: string;
    estimated_load_kw: number;
    daily_usage_hours: number;
    property_type: string;
  };
}

const solutionIcons: Record<string, typeof Sun> = {
  "Solar+Battery": Sun,
  "Hybrid": Gauge,
  "Generator+Inverter": Zap,
};

const solutionColors: Record<string, string> = {
  "Solar+Battery": "bg-energy-green-light text-energy-green border-energy-green/30",
  "Hybrid": "bg-solar-gold-light text-amber-700 border-amber-300",
  "Generator+Inverter": "bg-orange-50 text-orange-700 border-orange-200",
};

export default function RecommendationDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendation() {
      if (!id) return;

      try {
        const { data: rec, error: fetchError } = await supabase
          .from("recommendations")
          .select(`
            *,
            clients (*)
          `)
          .eq("id", id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!rec) {
          setError("Recommendation not found");
          return;
        }

        setData({
          id: rec.id,
          summary: rec.summary,
          reasoning: rec.reasoning,
          primary_solution: rec.primary_solution,
          system_capacity_kw: Number(rec.system_capacity_kw),
          solar_panels_count: rec.solar_panels_count,
          battery_capacity_kwh: rec.battery_capacity_kwh ? Number(rec.battery_capacity_kwh) : null,
          inverter_size_kw: rec.inverter_size_kw ? Number(rec.inverter_size_kw) : null,
          equipment_cost_ngn: Number(rec.equipment_cost_ngn),
          installation_cost_ngn: Number(rec.installation_cost_ngn),
          total_cost_ngn: Number(rec.total_cost_ngn),
          monthly_operating_cost: Number(rec.monthly_operating_cost),
          roi_months: rec.roi_months,
          products_json: (rec.products_json as unknown) as Product[],
          generated_at: rec.generated_at,
          client: {
            full_name: rec.clients.full_name,
            email: rec.clients.email,
            phone: rec.clients.phone,
            business_name: rec.clients.business_name,
            state: rec.clients.state,
            lga: rec.clients.lga,
            address: rec.clients.address,
            estimated_load_kw: Number(rec.clients.estimated_load_kw),
            daily_usage_hours: Number(rec.clients.daily_usage_hours),
            property_type: rec.clients.property_type,
          },
        });
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load recommendation");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendation();
    fetchRecommendation();
  }, [id]);

  const { user } = useAuth();
  const location = useLocation();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Check if unlocked via payment
    const hasPaid = localStorage.getItem("powerwise_unlocked") === "true";

    // Determine lock state:
    // 1. If user is logged in -> UNLOCKED
    // 2. If user paid -> UNLOCKED
    // 3. Implied from navigation state (locked: true) -> LOCKED (unless paid)

    if (user || hasPaid) {
      setIsLocked(false);
    } else {
      // Default to locked for unauthenticated users checking a new recommendation
      // If we arrived with no state (direct link), we might want to also lock it for anonymous users
      const stateLocked = location.state?.locked;
      // Force lock if not logged in and not paid
      setIsLocked(true);
    }
  }, [user, location.state]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "Not found"}</h1>
          <Button asChild>
            <Link to="/recommendations">
              <ArrowLeft className="h-4 w-4" />
              Back to Recommendations
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const SolutionIcon = solutionIcons[data.primary_solution] || Zap;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-12">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
              <Link to="/recommendations">
                <ArrowLeft className="h-4 w-4" />
                Back to Recommendations
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-primary-foreground">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${solutionColors[data.primary_solution]} text-sm px-3 py-1`}>
                    <SolutionIcon className="h-4 w-4 mr-1.5" />
                    {data.primary_solution}
                  </Badge>
                  <span className="text-primary-foreground/60 text-sm">
                    {formatDateTime(data.generated_at)}
                  </span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {data.client.full_name}
                </h1>
                <p className="text-primary-foreground/80 flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {data.client.lga}, {data.client.state}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1 text-primary-foreground">
                <span className="text-sm text-primary-foreground/60">Total Investment</span>
                <span className="font-display text-3xl md:text-4xl font-bold">
                  {formatNaira(data.total_cost_ngn)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40V20C1200 0 960 10 720 20C480 30 240 20 0 0V40Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 bg-background relative min-h-screen">
        {isLocked && data && (
          <PricingModal currentRecommendationId={data.id} />
        )}

        <div className={`container transition-all duration-500 ${isLocked ? "blur-md pointer-events-none select-none opacity-50 overflow-hidden h-screen" : ""}`}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      AI Recommendation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg font-medium">{data.summary}</p>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 text-muted-foreground text-sm uppercase tracking-wide">
                        Detailed Analysis
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{data.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Technical Specs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-primary" />
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-energy-green-light">
                        <Zap className="h-6 w-6 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">System Capacity</p>
                        <p className="font-display text-xl font-bold">{data.system_capacity_kw} kW</p>
                      </div>
                      {data.solar_panels_count && (
                        <div className="p-4 rounded-xl bg-solar-gold-light">
                          <Sun className="h-6 w-6 text-amber-600 mb-2" />
                          <p className="text-sm text-muted-foreground">Solar Panels</p>
                          <p className="font-display text-xl font-bold">{data.solar_panels_count} units</p>
                        </div>
                      )}
                      {data.battery_capacity_kwh && (
                        <div className="p-4 rounded-xl bg-blue-50">
                          <Battery className="h-6 w-6 text-blue-600 mb-2" />
                          <p className="text-sm text-muted-foreground">Battery Storage</p>
                          <p className="font-display text-xl font-bold">{data.battery_capacity_kwh} kWh</p>
                        </div>
                      )}
                      {data.inverter_size_kw && (
                        <div className="p-4 rounded-xl bg-purple-50">
                          <Gauge className="h-6 w-6 text-purple-600 mb-2" />
                          <p className="text-sm text-muted-foreground">Inverter Size</p>
                          <p className="font-display text-xl font-bold">{data.inverter_size_kw} kW</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Products List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Recommended Products
                    </CardTitle>
                    <CardDescription>Detailed breakdown with Nigerian market pricing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.products_json.map((product, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/50 gap-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Supplier: {product.supplier}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {product.quantity} × {formatNaira(product.unitPriceNGN)}
                            </p>
                            <p className="font-semibold text-lg">{formatNaira(product.totalPriceNGN)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Equipment</span>
                      <span className="font-medium">{formatNaira(data.equipment_cost_ngn)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Wrench className="h-4 w-4" />
                        Installation
                      </span>
                      <span className="font-medium">{formatNaira(data.installation_cost_ngn)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-3 -mx-3">
                      <span className="font-semibold">Total Cost</span>
                      <span className="font-bold text-xl text-primary">
                        {formatNaira(data.total_cost_ngn)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Monthly Operating
                      </span>
                      <span className="font-medium">{formatNaira(data.monthly_operating_cost)}</span>
                    </div>
                    {data.roi_months && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">ROI Period</span>
                        <Badge variant="secondary" className="font-semibold">
                          {data.roi_months} months
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Client Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Client Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{data.client.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{data.client.phone}</span>
                    </div>
                    {data.client.business_name && (
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{data.client.business_name}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Type</span>
                        <Badge variant="outline">{data.client.property_type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Load Requirement</span>
                        <span className="font-medium">{data.client.estimated_load_kw} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Usage</span>
                        <span className="font-medium">{data.client.daily_usage_hours} hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
