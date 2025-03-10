"use client"

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, MapPin, Calendar, CheckCircle, Globe, Twitter, Instagram, Linkedin, Facebook, Github } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

// Use Google's standard test key directly
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Load Calendly widget script and reCAPTCHA script
  useEffect(() => {
    // Load Calendly script
    const calendlyScript = document.createElement('script');
    calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyScript.async = true;
    calendlyScript.onload = () => setCalendlyLoaded(true);
    document.body.appendChild(calendlyScript);
    
    // Load reCAPTCHA script
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
    recaptchaScript.async = true;
    recaptchaScript.onload = () => {
      console.log("reCAPTCHA script loaded");
      setRecaptchaLoaded(true);
    };
    document.body.appendChild(recaptchaScript);
    
    return () => {
      // Cleanup function to remove the scripts when component unmounts
      if (document.body.contains(calendlyScript)) {
        document.body.removeChild(calendlyScript);
      }
      if (document.body.contains(recaptchaScript)) {
        document.body.removeChild(recaptchaScript);
      }
    };
  }, []);

  // Log when reCAPTCHA is loaded
  useEffect(() => {
    if (recaptchaLoaded) {
      console.log("reCAPTCHA is ready to use with site key:", RECAPTCHA_SITE_KEY);
    }
  }, [recaptchaLoaded]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Get the reCAPTCHA token using the global grecaptcha object
      const recaptchaToken = (window as any).grecaptcha?.getResponse();
      console.log("reCAPTCHA token obtained:", recaptchaToken ? `Yes (length: ${recaptchaToken.length})` : "No");
      
      // Send the data to our API endpoint
      console.log("Sending form data to API with reCAPTCHA token");
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken
        }),
      });
      
      const result = await response.json();
      console.log("API response:", result);
      
      if (response.ok && result.success) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        form.reset();
        // Reset reCAPTCHA
        try {
          (window as any).grecaptcha?.reset();
        } catch (e) {
          console.error("Error resetting reCAPTCHA:", e);
        }
        // Set submitted state to show success message
        setFormSubmitted(true);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12 pt-16 px-4 sm:px-6 mx-auto max-w-screen-xl">
      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Contact Me</CardTitle>
              <CardDescription>
                Fill out the form below and I'll get back to you as soon as
                possible.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
                <div className="rounded-full bg-green-100 p-5 text-green-600 border-4 border-green-200 shadow-md">
                  <CheckCircle className="h-16 w-16" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-w-md">
                  <p className="text-sm text-gray-600 mb-2"><strong>What happens next?</strong></p>
                  <ul className="text-left text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>A confirmation email has been sent to you</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>I received your message at prateek@edoflip.com</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                      <span>I typically respond within 24-48 hours</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  onClick={() => setFormSubmitted(false)} 
                  className="mt-6 font-bold py-4 px-6 bg-primary hover:bg-primary/90 text-black shadow-lg border-2 border-black rounded-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Google reCAPTCHA - Using the hardcoded test key */}
                  <div className="my-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                    <p className="text-sm text-gray-500 mb-3">Please verify you're human:</p>
                    <div className="flex justify-center">
                      <div 
                        ref={recaptchaRef}
                        className="g-recaptcha" 
                        data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full font-bold py-6 text-lg bg-primary hover:bg-primary/90 text-black shadow-lg border-2 border-black rounded-md transition-all transform hover:scale-[1.02] active:scale-[0.98]" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Feel free to reach out through any of these channels.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">prateek@edoflip.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">Berlin, Germany</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Website</h3>
                <a href="https://prateekhakay.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">prateekhakay.com</a>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">Connect on Social Media</h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/prateekh777" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <Github className="h-4 w-4 text-gray-800" />
                  <span className="text-sm">GitHub</span>
                </a>
                <a href="https://twitter.com/Prateek_Hakay" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                  <span className="text-sm">Twitter</span>
                </a>
                <a href="https://www.instagram.com/prateekhakay" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <Instagram className="h-4 w-4 text-[#E4405F]" />
                  <span className="text-sm">Instagram</span>
                </a>
                <a href="https://www.linkedin.com/in/pratikhakay/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a href="https://www.facebook.com/prateek.hakay/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <Facebook className="h-4 w-4 text-[#1877F2]" />
                  <span className="text-sm">Facebook</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Schedule a Meeting</CardTitle>
            <CardDescription>
              Book a time slot directly on my calendar for a personal conversation.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendly inline widget */}
          <div className="calendly-inline-widget" data-url="https://calendly.com/prateekh/30min?hide_gdpr_banner=1" style={{minWidth: "320px", height: "700px"}}></div>
        </CardContent>
      </Card>
    </div>
  );
} 