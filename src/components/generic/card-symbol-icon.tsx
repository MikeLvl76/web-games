import { CardColor, CardSymbol } from "@/server-actions/pack-generator";
import { Club, Spade, Heart, Diamond, TriangleAlert } from "lucide-react";

type Props = {
  symbol: CardSymbol;
  color: CardColor;
};

export default function CardSymbolIcon({ symbol, color }: Props) {
  if (symbol === "club" && color === "black") {
    return <Club color={color} size={32} fill={color} />;
  }

  if (symbol === "spade" && color === "black") {
    return <Spade color={color} size={32} fill={color} />;
  }

  if (symbol === "heart" && color === "red") {
    return <Heart color={color} size={32} fill={color} />;
  }

  if (symbol === "diamond" && color === "red") {
    return <Diamond color={color} size={32} fill={color} />;
  }

  return <TriangleAlert color="black" size={32} fill="yellow" />;
}
