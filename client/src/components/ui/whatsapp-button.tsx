import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const phoneNumber = "+918280320550"; // Samuel Marndi's WhatsApp number

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message with name
    const formattedMessage = `Hi, I'm ${name}. ${message}`;
    const encodedMessage = encodeURIComponent(formattedMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
    
    // Close the dialog
    setOpen(false);
    setName("");
    setMessage("");
  };

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-green-500 hover:bg-green-600 z-50"
        onClick={() => setOpen(true)}
      >
        <FaWhatsapp className="h-6 w-6 text-white" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
          <DialogHeader className="pt-10 sm:pt-6">
            <DialogTitle>Send a WhatsApp Message</DialogTitle>
            <DialogDescription>
              Have a question? Send me a message directly on WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="sm:text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="sm:col-span-3"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-4 items-start gap-2 sm:gap-4">
                <Label htmlFor="message" className="sm:text-right pt-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="sm:col-span-3 min-h-[100px]"
                  placeholder="How can I help you?"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 pb-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="sm:order-1 order-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="sm:order-2 order-1">
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsAppButton;
