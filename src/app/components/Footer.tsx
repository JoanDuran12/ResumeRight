import Image from "next/image";

function Footer() {
  return (
    <footer className="w-full px-24 py-4 flex items-center justify-between my-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 relative">
          <Image
            src="/logo.svg"
            alt="ResumeRight Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="font-bold text-xl">ResumeRight</span>
      </div>
      <div className="items-center text-sm">
        © 2025 ResumeRight
      </div>
    </footer>
  );
}

export default Footer;
