import { IconFileDescription, IconBolt, IconStack, IconNotification, IconStar, IconChecks } from '@tabler/icons-react';

const FeaturesItems = [
  {
    title: "AI-Powered Content",
    description:
      "Our AI helps you write compelling bullet points and summaries tailored to your target job.",
    Icon: <IconBolt stroke={2} className="size-8"/>,
  },
  {
    title: "Cover Letter Builder",
    description:
      "Create a professional cover letter that highlights your skills and experience in minutes.",
    Icon: <IconFileDescription stroke={2} className="size-8" />,
  },
  {
    title: "Beautiful Templates",
    description:
      "Choose from dozens of professionally designed templates that stand out from the crowd.",
    Icon: <IconStack stroke={2} className="size-8" />,
  },
  {
    title: "ATS Optimization",
    description:
      "Ensure your resume passes through Applicant Tracking Systems with our keyword optimization tools.",
    Icon: <IconNotification stroke={2} className="size-8" />,
  },
  {
    title: "Expert Feedback",
    description:
      "Get personalized suggestions to improve your resume's impact and effectiveness.",
    Icon: <IconStar stroke={2} className="size-8" />,
  },
  {
    title: "Version Control",
    description:
      "Create multiple versions of your resume tailored to different jobs or industries.",
    Icon: <IconChecks stroke={2} className="size-8" />,
  },
];

function Features() {
  return (
    <section className="w-full py-12 px-24 md:py-12 lg:py-24 xl:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className=" bg-black text-white rounded-lg px-4 py-2 text-sm">
            Features
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything you need to create the perfect resume
          </h2>
          <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform provides all the tools you need to build a professional
            resume that gets you noticed by recruiters and hiring managers.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {FeaturesItems.map((item, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                {item.Icon}
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
