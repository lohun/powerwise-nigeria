import { motion } from "framer-motion";
import { ClipboardList, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ClientAssessmentForm } from "@/components/ClientAssessmentForm";

export default function Assessment() {
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
            className="max-w-2xl mx-auto text-center text-primary-foreground"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Power Assessment Form
            </h1>
            <p className="text-primary-foreground/80">
              Tell us about your property and power needs. Our AI will generate a 
              personalized recommendation with detailed specifications and pricing.
            </p>
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

      {/* Form Section */}
      <section className="py-12 bg-background">
        <div className="container max-w-3xl">
          <ClientAssessmentForm />
        </div>
      </section>
    </Layout>
  );
}
