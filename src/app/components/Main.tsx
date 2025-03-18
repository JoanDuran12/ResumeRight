import { IconCaretRight, IconDots } from "@tabler/icons-react";

function Main() {
  return (
    <section className="w-full py-12 px-24 md:py-12 lg:py-24 xl:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Create Professional Tailored Resumes in Minutes
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl my-4">
                Stand out from the crowd with beautifully designed resumes that
                get you noticed. Our AI-powered platform makes it easy to build
                the perfect resume for any job.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row ">
            <span className="bg-black text-white items-center inline-flex justify-center gap-2 text-sm font-medium hover:underline underline-offset-4 h-11 rounded-md px-8">
              Build Your Resume
              <IconCaretRight stroke={2} />
            </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IconDots stroke={2} />
              <span>Free</span>
              <span>and</span>
              <span>Open Source</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] ">
              <img
                className="relative z-10 overflow-hidden rounded-xl bg-background shadow-xl"
                src="https://writelatex.s3.amazonaws.com/published_ver/16158.jpeg?X-Amz-Expires=14400&X-Amz-Date=20250317T031437Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWJBOALPNFPV7PVH5/20250317/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=922112baed75e74dc4d2c6fdd1b66a65f893b5f859032906f2e212cf19a90cd1"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;