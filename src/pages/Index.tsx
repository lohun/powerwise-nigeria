import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Sun, Battery, Gauge, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

const features = [
  {
    icon: Sun,
    title: "Solar Solutions",
    description: "Harness Nigeria's abundant sunlight with premium solar panels and systems.",
  },
  {
    icon: Battery,
    title: "Battery Storage",
    description: "Store energy for 24/7 power availability, even during grid outages.",
  },
  {
    icon: Gauge,
    title: "Hybrid Systems",
    description: "Smart hybrid solutions combining solar, battery, and generator backup.",
  },
  {
    icon: TrendingUp,
    title: "ROI Analysis",
    description: "Get detailed cost breakdowns and return on investment projections.",
  },
];

const benefits = [
  "AI-powered recommendations tailored to your needs",
  "Real-time Nigerian market pricing",
  "Comprehensive product specifications",
  "Installation cost estimates",
  "Monthly operating cost projections",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-solar-gold/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-primary/30 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center text-primary-foreground"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Energy Solutions</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Power Your Future with
              <span className="block text-solar-gold">Smart Energy Solutions</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Get personalized alternate power recommendations for your Nigerian property. 
              Our AI analyzes your needs and provides detailed solutions with real market pricing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" variant="solar">
                <Link to="/assessment">
                  Start Assessment
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/recommendations">
                  View Recommendations
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Complete Power Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From residential to industrial, we provide tailored recommendations for all your power needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-card border shadow-card hover:shadow-card-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-energy-green-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our
                <span className="text-gradient-green block">AI Recommendations?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our intelligent system analyzes your specific requirements and delivers 
                customized power solutions with accurate Nigerian market pricing.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-solar-gold/20 rounded-3xl blur-2xl" />
              <div className="relative bg-card rounded-2xl border shadow-card-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">Sample Recommendation</h3>
                    <p className="text-sm text-muted-foreground">5kW Residential System</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Solar Panels</span>
                    <span className="font-medium">10 × 550W</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Battery Storage</span>
                    <span className="font-medium">15 kWh</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Inverter</span>
                    <span className="font-medium">5.5 kW</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold">Total Cost</span>
                    <span className="font-bold text-primary text-lg">₦4,500,000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Power Up?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free power assessment today and get your personalized recommendation in minutes.
            </p>
            <Button asChild size="xl" variant="hero">
              <Link to="/assessment">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
