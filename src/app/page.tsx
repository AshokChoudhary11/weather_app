"use client";
import { Command, CommandInput } from "@/components/ui/command";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex w-full h-full items-center justify-center mt-12">
      <Command className="w-4/5 border">
        <CommandInput
          placeholder="Search a city..."
          onKeyDown={(e) => {
            // check if the key pressed is the enter key
            if (e.key === "Enter") {
              // get the value of the input
              const value = e.currentTarget.value;
              // check if the value is not empty
              if (value) {
                // redirect to the search page
                router.push(`/search/${value}`);
              }
            }
          }}
        />
      </Command>
    </div>
  );
}
