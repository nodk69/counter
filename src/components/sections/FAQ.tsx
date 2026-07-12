import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Is counter free to use?",
      answer: "Yes, completely free, always. There are no premium tiers, no hidden fees, and absolutely no ads."
    },
    {
      question: "Does counter store my text?",
      answer: "No. Your text never leaves your browser. All counting and analysis happens instantly on your device, ensuring complete privacy."
    },
    {
      question: "How is reading time calculated?",
      answer: "Based on the widely accepted average reading speed of 200 words per minute. Speaking time is calculated at 130 words per minute."
    },
    {
      question: "Can I import documents?",
      answer: "Yes, you can import plain text (.txt) and Markdown (.md) files directly using the upload button in the toolbar."
    },
    {
      question: "What is the Flesch-Kincaid score?",
      answer: "It's a readability metric from 0–100 that indicates how difficult a passage in English is to understand. Higher scores indicate material that is easier to read."
    },
    {
      question: "Is there a word limit?",
      answer: "No limit. Counter is built to handle texts of any length, from a single tweet to an entire novel, without slowing down."
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-12 text-center">Frequently asked questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
              <AccordionTrigger className="text-left font-medium text-lg hover:no-underline hover:text-primary transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
