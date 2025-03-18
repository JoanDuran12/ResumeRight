import { IconCaretRight } from "@tabler/icons-react";

function Component() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl text-white font-bold tracking-tighter md:text-4xl/tight">
              Ready to build your perfect resume?
            </h2>
            <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of job seekers who have successfully landed their
              dream jobs with ResumeRight.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <a
              className="bg-white text-black items-center inline-flex justify-center gap-2 text-sm font-medium hover:underline underline-offset-4 h-11 rounded-md px-8"
              href="#GetStartedRightNow"
            >
              Get Started Right Now
              <IconCaretRight stroke={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Component;
