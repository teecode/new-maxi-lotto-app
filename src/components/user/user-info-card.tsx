
import { Button } from "@/components/ui/button";
import type {UserInfoCardProps} from "@/types/profile";
import { formatCurrency } from "@/lib/utils";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {Image} from "@unpic/react";
import {Link} from "@tanstack/react-router";

const UserInfoCard = ({ name, balance, email, avatar, rank }: UserInfoCardProps) => {
  return (

    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="default" className="p-0">
        <ItemMedia variant="image" className="w-20 h-20">
          <Image
            src={avatar}
            alt={`${name} avatar`}
            width={80}
            height={80}
            className="object-fill w-full  rounded-full"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-lg sm:text-xl font-medium text-foreground">{name}</ItemTitle>
          <ItemDescription className="space-y-1">
            <span className="text-muted-foreground block text-sm font-bold text-yellow-600">{rank}</span>
            <span className="text-muted-foreground block text-sm">{email}</span>
            <span className="text-muted-foreground block">{formatCurrency(balance)}</span>
          </ItemDescription>

          <div className="flex w-full mt-2 gap-4 justify-between">
            <Button
              asChild
              className="flex-1 bg-pink-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-pink-600 transition-colors"
            >
              <Link to="/deposit">Deposit</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-green-400 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-500 transition-colors"
            >
              <Link to="/withdrawal">Withdraw</Link>
            </Button>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
};

export default UserInfoCard;
