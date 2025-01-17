"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const shortenAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function WalletDialog() {
  const { user, setShowAuthFlow, handleLogOut, primaryWallet } = useDynamicContext();

  return (
    <>
      {user ? (
        <>
        <Button
          variant="ghost"
          size="sm"
          className="glow-effect h-7 px-3 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-purple-100/50 dark:hover:shadow-purple-900/50"
        >
          <Wallet className="mr-1.5 h-3 w-3" />
          {shortenAddress(primaryWallet?.address ?? "")}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  variant="ghost"
                  size="sm"
                  className="glow-effect h-7 px-3 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-purple-100/50 dark:hover:shadow-purple-900/50"
                  onClick={handleLogOut}
                >
                  <LogOut className="mr-1.5 h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
      ) : (
        <Button
          effect="shine"
          variant="ghost"
          size="sm"
          className="glow-effect h-7 px-3 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:shadow-purple-100/50 dark:hover:shadow-purple-900/50"
          onClick={() => setShowAuthFlow(true)}
        >
          <Wallet className="mr-1.5 h-3 w-3" />
          Connect Wallet
        </Button>
      )}
    </>
  );
}
