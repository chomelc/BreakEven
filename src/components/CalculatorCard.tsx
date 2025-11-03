import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  tier?: "Core" | "Pro";
}

const CalculatorCard = ({
  title,
  description,
  icon: Icon,
  to,
  tier,
}: CalculatorCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
      <CardHeader>
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-accent-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {tier && (
            <Badge
              className={tier === "Pro" ? "" : "border-foreground/20"}
              variant={tier === "Pro" ? "default" : "outline"}
            >
              {tier}
            </Badge>
          )}
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          variant="ghost"
          className="group/btn p-0 h-auto font-medium text-primary hover:text-primary"
        >
          <Link to={to} className="flex items-center gap-2">
            Try it now
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalculatorCard;
