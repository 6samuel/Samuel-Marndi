import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CodeHighlightTabsProps {
  code: Record<string, string>;
  filename?: string;
  className?: string;
}

export function CodeHighlightTabs({ code, filename, className }: CodeHighlightTabsProps) {
  const languages = Object.keys(code);
  const [activeTab, setActiveTab] = useState(languages[0]);

  return (
    <div className={cn("rounded-md border", className)}>
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        {filename && (
          <div className="text-xs text-muted-foreground">{filename}</div>
        )}
      </div>
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between border-b px-4">
          <TabsList className="h-10 bg-transparent p-0">
            {languages.map((lang) => (
              <TabsTrigger
                key={lang}
                value={lang}
                className={cn(
                  "rounded-none border-b-2 border-transparent pb-3 pt-2 font-medium",
                  activeTab === lang
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {languages.map((lang) => (
          <TabsContent
            key={lang}
            value={lang}
            className="p-4 overflow-auto max-h-[500px]"
          >
            <pre>
              <code className="whitespace-pre-wrap break-words">{code[lang]}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}