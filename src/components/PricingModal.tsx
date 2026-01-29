import { Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface PricingModalProps {
    currentRecommendationId: string;
}

export function PricingModal({ currentRecommendationId }: PricingModalProps) {
    const handlePaymentClick = () => {
        // Store ID so we can return to it after payment redirect
        localStorage.setItem("pendingRecommendationId", currentRecommendationId);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
                {/* Basic Plan */}
                <Card className="border-2 shadow-lg relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-display">Basic Report</CardTitle>
                        <CardDescription>Essential breakdown for small homes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">₦25,000</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                System Sizing
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Estimated Cost
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Basic Component List
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full" variant="outline" onClick={handlePaymentClick}>
                            <a href="https://paystack.shop/pay/8-g5f3dfh3">Get Basic</a>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Premium Plan */}
                <Card className="border-2 border-primary shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                        RECOMMENDED
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl font-display flex items-center gap-2">
                            <Zap className="h-5 w-5 fill-current text-yellow-400" />
                            Premium Report
                        </CardTitle>
                        <CardDescription>Complete analysis & professional support.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">₦50,000</div>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Everything in Basic</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>ROI Calculator</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Detailed Brand Recommendations</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Installer Contact</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full" variant="solar" size="lg" onClick={handlePaymentClick}>
                            <a href="https://paystack.shop/pay/83bgioxwhe">Get Premium</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

