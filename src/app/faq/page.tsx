import Header from "@/app/components/Header";
import FAQ, { type FAQItem } from "@/app/components/FAQ";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: 'Frequently Asked Questions - ResumeRight',
  description: 'Find answers to common questions about ResumeRight, an AI-powered resume builder.'
};

// Extended FAQ list specific for the full FAQ page
const extendedFAQs: FAQItem[] = [
  {
    question: "What is ResumeRight?",
    answer: "ResumeRight is an AI-powered resume builder that helps you create professional resumes tailored to specific job descriptions. Our tool analyzes job listings and suggests optimizations to make your resume stand out to recruiters and applicant tracking systems."
  },
  {
    question: "Is ResumeRight free to use?",
    answer: "ResumeRight offers both free and premium features. You can create and download basic resumes for free, while our premium features include advanced AI optimization, unlimited resume storage, and access to premium templates."
  },
  {
    question: "How does the AI optimization work?",
    answer: "Our AI analyzes your resume against job descriptions to identify keyword matches, missing skills, and improvement opportunities. It suggests additions and modifications to enhance your resume's relevance for specific job applications, helping you pass applicant tracking systems."
  },
  {
    question: "Can I save multiple versions of my resume?",
    answer: "Yes! You can save multiple versions of your resume in your account. This allows you to tailor different resumes for different job applications or industries without starting from scratch each time."
  },
  {
    question: "Is my data secure?",
    answer: "We take data security seriously. Your information is encrypted and stored securely. We never share your personal data with third parties without your explicit permission. You can delete your account and all associated data at any time."
  },
  {
    question: "What file formats can I download my resume in?",
    answer: "You can download your resume as a PDF, which is the industry standard for job applications. Premium users also get access to additional formats like DOCX (Word document) for further editing if needed."
  },
  {
    question: "Do you offer resume templates?",
    answer: "Yes, we provide a variety of professionally designed resume templates suitable for different industries and career levels. Free users have access to basic templates, while premium users can access our full library of templates, including industry-specific designs."
  },
  {
    question: "Can I cancel my premium subscription?",
    answer: "Yes, you can cancel your premium subscription at any time from your account settings. You'll continue to have access to premium features until the end of your current billing period."
  },
  {
    question: "How do I get help if I have a problem?",
    answer: "We offer several support options. You can browse our help center for guides and tutorials, or contact our support team via the chat button available on most pages. Premium users receive priority support with faster response times."
  },
  {
    question: "Can I use ResumeRight on mobile devices?",
    answer: "Absolutely! ResumeRight is fully responsive and works on desktops, tablets, and smartphones. You can create, edit, and download your resume from any device with a web browser."
  },
  {
    question: "Does ResumeRight help with cover letters too?",
    answer: "Yes, our premium plan includes AI-powered cover letter creation. Similar to our resume builder, it can help you craft tailored cover letters that complement your resume and address specific job requirements."
  },
  {
    question: "How often can I update my resume?",
    answer: "You can update your resume as often as you'd like! We encourage keeping your resume current, and our system makes it easy to make quick updates whenever you gain new skills or experiences."
  }
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-8">
            Get answers to common questions about ResumeRight
          </p>
        </div>
      </div>
      <FAQ 
        faqItems={extendedFAQs} 
        title="" 
        subtitle="" 
        className="pt-2"
      />
      <Footer />
    </>
  );
} 