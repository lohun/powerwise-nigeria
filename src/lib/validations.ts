import { z } from 'zod';

export const clientSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number").min(10, "Phone number too short"),
  businessName: z.string().optional(),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500),
  estimatedLoadKW: z.number().min(0.5, "Minimum 0.5 kW").max(1000, "Maximum 1000 kW"),
  dailyUsageHours: z.number().min(1, "Minimum 1 hour").max(24, "Maximum 24 hours"),
  propertyType: z.enum(["Residential", "Commercial", "Industrial"]),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
] as const;

export const propertyTypes = [
  { value: "Residential", label: "Residential", description: "Homes, apartments, estates" },
  { value: "Commercial", label: "Commercial", description: "Offices, shops, hotels" },
  { value: "Industrial", label: "Industrial", description: "Factories, warehouses" },
] as const;
