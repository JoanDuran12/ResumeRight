import { IconFileDescription } from "@tabler/icons-react";

const navItems = [
  {
    title: "Features",
    href: "#Features",
  },
  {
    title: "Templates",
    href: "#Templates",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "FAQ",
    href: "#FAQ",
  },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-24">
        <div className="flex items-center gap-2">
          <IconFileDescription stroke={2} className="size-8" />
          <span className="font-bold text-xl">ResumeRight</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              className="text-sm font-medium hover:underline underline-offset-4"
              href={item.href}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            className="text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex"
            href="#login"
          >
            Log In
          </a>
          <a
            className="border bg-black text-white px-3 py-2 rounded-md text-sm hover:underline underline-offset-4"
            href=""
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
