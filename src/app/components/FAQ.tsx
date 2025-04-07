'use client'

import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

export type FAQItem = {
  question: string;
  answer: string;
};

// Default FAQ data
const defaultFaqData: FAQItem[] = [
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
    answer: "You can download your resume as a PDF, which is the industry standard for job applications."
  }
];

export function FAQAccordionItem({ item, isOpen, toggleOpen }: 
  { item: FAQItem; isOpen: boolean; toggleOpen: () => void }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex w-full justify-between items-center py-5 px-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        onClick={toggleOpen}
      >
        <span className="text-lg">{item.question}</span>
        <IconChevronDown 
          className={`flex-shrink-0 transition-transform ${isOpen ? "transform rotate-180" : ""}`} 
          size={22} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 py-4 px-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-700 dark:text-gray-300">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

type FAQProps = {
  title?: string;
  subtitle?: string;
  faqItems?: FAQItem[];
  className?: string;
}

export default function FAQ({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about ResumeRight",
  faqItems = defaultFaqData,
  className = ""
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="FAQ" className={`py-16 px-4 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {faqItems.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              toggleOpen={() => toggleAccordion(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 