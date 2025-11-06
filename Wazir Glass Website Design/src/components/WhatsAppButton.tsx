// src/components/WhatsAppButton.tsx
import { MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function WhatsAppButton() {
  // Your WhatsApp number (replace 0321... with 92321...)
  const whatsAppNumber = "923218457556";
  const message = "Hello! I'm visiting your website and have a question.";

  const url = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-24 z-50 p-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-700 transition-all"
            aria-label="Contact us on WhatsApp"
          >
            <MessageSquare className="w-6 h-6" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Contact us on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}