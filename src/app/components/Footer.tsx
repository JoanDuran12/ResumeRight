import { IconFileDescription } from "@tabler/icons-react";

function Footer() {
  return (
    <footer className="w-full px-24 py-4 flex items-center justify-between my-6">
      <div className="flex items-center gap-2">
        <IconFileDescription stroke={2} className="size-8" />
        <span className="font-bold text-xl">ResumeRight</span>
      </div>
      <div className="items-center text-sm ">
        2025 ResumeRight
      </div>
    </footer>
  );
}

export default Footer;
