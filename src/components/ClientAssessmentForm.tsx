import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Zap, MapPin, Building, User, Mail, Phone, Clock, Bolt } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { clientSchema, type ClientFormData, nigerianStates, propertyTypes } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";

export function ClientAssessmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      estimatedLoadKW: 5,
      dailyUsageHours: 8,
    },
  });

  const propertyType = watch("propertyType");
  const state = watch("state");

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      // First create the client
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          business_name: data.businessName || null,
          state: data.state,
          lga: data.lga,
          address: data.address,
          estimated_load_kw: data.estimatedLoadKW,
          daily_usage_hours: data.dailyUsageHours,
          property_type: data.propertyType,
        })
        .select()
        .single();

      if (clientError) {
        if (clientError.code === "23505") {
          toast.error("This email is already registered");
        } else {
          throw clientError;
        }
        return;
      }

      toast.info("Generating AI recommendation...", { duration: 10000 });

      const recommendation = await fetch('http://localhost:3000/make_recommendation', {
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(
          {
            clientId: client.id,
            fullName: data.fullName,
            state: data.state,
            lga: data.lga,
            estimatedLoadKW: data.estimatedLoadKW,
            dailyUsageHours: data.dailyUsageHours,
            propertyType: data.propertyType,
          }
        )
      });

      console.log(recommendation);

      const message = await recommendation.json();

      if (!recommendation.ok) {
        console.error("AI Error:", message);
        toast.error("Failed to generate recommendation. Please try again.");
        return;
      }

      toast.success("Recommendation generated successfully!");
      toast.success("Recommendation generated successfully!");

      const isLocked = !user;
      navigate(`/recommendations/${message.id}`, { state: { locked: isLocked } });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register("fullName")}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+234 800 123 4567"
                  className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name (optional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="businessName"
                  placeholder="Your business name"
                  className="pl-10"
                  {...register("businessName")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <MapPin className="h-5 w-5 text-primary" />
              Location Details
            </CardTitle>
            <CardDescription>Where will the power system be installed?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={state}
                onValueChange={(value) => setValue("state", value, { shouldValidate: true })}
              >
                <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-popover">
                  {nigerianStates.map((stateName) => (
                    <SelectItem key={stateName} value={stateName}>
                      {stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lga">Local Government Area *</Label>
              <Input
                id="lga"
                placeholder="Enter your LGA"
                {...register("lga")}
                className={errors.lga ? "border-destructive" : ""}
              />
              {errors.lga && (
                <p className="text-sm text-destructive">{errors.lga.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your full address"
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Power Requirements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Bolt className="h-5 w-5 text-accent" />
              Power Requirements
            </CardTitle>
            <CardDescription>Tell us about your electricity needs</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={propertyType}
                onValueChange={(value) =>
                  setValue("propertyType", value as ClientFormData["propertyType"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className={errors.propertyType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-sm text-destructive">{errors.propertyType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedLoadKW">Estimated Load (kW) *</Label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                <Input
                  id="estimatedLoadKW"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="1000"
                  className={`pl-10 ${errors.estimatedLoadKW ? "border-destructive" : ""}`}
                  {...register("estimatedLoadKW", { valueAsNumber: true })}
                />
              </div>
              {errors.estimatedLoadKW && (
                <p className="text-sm text-destructive">{errors.estimatedLoadKW.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Typical home: 3-5 kW, Small business: 5-15 kW, Industrial: 50+ kW
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="dailyUsageHours">Daily Usage Hours *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dailyUsageHours"
                  type="number"
                  step="0.5"
                  min="1"
                  max="24"
                  className={`pl-10 ${errors.dailyUsageHours ? "border-destructive" : ""}`}
                  {...register("dailyUsageHours", { valueAsNumber: true })}
                />
              </div>
              {errors.dailyUsageHours && (
                <p className="text-sm text-destructive">{errors.dailyUsageHours.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                How many hours per day do you need backup power?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="xl"
            variant="hero"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[280px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Recommendation...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Get AI Recommendation
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
