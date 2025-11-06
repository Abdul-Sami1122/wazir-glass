import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What areas do you serve in Pakistan?",
      answer:
        "We primarily serve Lahore and surrounding areas, but we undertake projects across Pakistan including Islamabad, Karachi, Faisalabad, Multan, and other major cities for larger commercial and industrial projects.",
    },
    {
      question: "How long does a typical installation take?",
      answer:
        "Project duration varies based on scope and complexity. Residential projects like shower cabins typically take 1-3 days, while commercial installations may take 1-4 weeks. We provide detailed timelines during the initial consultation.",
    },
    {
      question: "Do you provide warranties on your work?",
      answer:
        "Yes! We provide comprehensive warranties on both materials and workmanship. Glass products come with manufacturer warranties, and our installation work is guaranteed for 1-2 years depending on the project type.",
    },
    {
      question: "Can you customize designs according to my requirements?",
      answer:
        "Absolutely! We specialize in customized solutions. Our team works closely with you to understand your vision and creates bespoke designs that match your aesthetic preferences and functional needs.",
    },
    {
      question: "What types of glass do you work with?",
      answer:
        "We work with all types of architectural glass including tempered glass, double-glazed glass, laminated glass, frosted glass, tinted glass, and decorative glass. We help you choose the best option for your specific application.",
    },
    {
      question: "Do you handle both residential and commercial projects?",
      answer:
        "Yes, we have extensive experience in residential, commercial, and industrial projects. From home shower cabins to large-scale commercial curtain walls, we handle projects of all sizes.",
    },
    {
      question: "How do I get a quote for my project?",
      answer:
        "Simply call us at 0321-8457556 or fill out the contact form on our website. We'll schedule a site visit for accurate measurements and provide you with a detailed, transparent quote within 24-48 hours.",
    },
    {
      question: "Do you provide maintenance services?",
      answer:
        "Yes, we offer maintenance and repair services for all glass and aluminium installations. We also provide annual maintenance contracts for commercial clients to ensure long-lasting performance.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-gray-800">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and processes
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg px-6 border shadow-sm"
              >
                <AccordionTrigger className="text-left hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
