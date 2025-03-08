import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Define our case studies data structure
interface CaseStudyData {
  id: number;
  title: string;
  result: string;
  actions: {
    heading: string;
    items: string[];
  }[];
  context: {
    heading: string;
    skills: string[];
  };
}

// Our hardcoded case studies data
const caseStudiesData: CaseStudyData[] = [
  {
    id: 1,
    title:
      "Increasing and Maintaining Conversion Rate from Demo Participants to Paid Customers in an EdTech Setup",
    result:
      "We improved the conversion rate from demo sessions to paid customers by 30% within three months and maintained the uplift over time by establishing a structured, insight-driven approach to trial sessions.",
    actions: [
      {
        heading: "Customer & Sales Insights Gathering",
        items: [
          "Conducted interviews with both parents and sales teams to identify key objections.",
          "Observed trial sessions to understand where engagement was dropping.",
        ],
      },
      {
        heading: "Refining the Demo Experience",
        items: [
          "Identified gaps that failed to energize parents (buyers).",
          "Standardized a structured Demo Playbook with best practices to increase engagement.",
        ],
      },
      {
        heading: "Training & Process Alignment",
        items: [
          "Conducted company-wide training for demo instructors to optimize storytelling, student engagement, and objection handling.",
          "Integrated real-time feedback loops from demo sessions into coaching sessions.",
        ],
      },
      {
        heading: "Data-Driven Monitoring & Swift Action",
        items: [
          "Built a daily dashboard tracking conversion rates, objections, and qualitative feedback.",
          "Implemented a real-time escalation system, allowing quick iterations on scripts and training.",
        ],
      },
    ],
    context: {
      heading: "Key Product Manager Skill Sets Applied",
      skills: [
        "Customer-Centric Mindset: Deeply analyzed buyer behavior to optimize engagement.",
        "Operational Efficiency: Created structured playbooks and feedback loops for continuous improvement.",
        "Data-Driven Decision-Making: Established real-time dashboards for tracking impact and iterating swiftly.",
      ],
    },
  },
  {
    id: 2,
    title:
      "Hiring 500+ Remote Teachers in Indonesia with Language & Cultural Barriers",
    result:
      "Built a scalable hiring model that enabled us to recruit and retain 500+ quality teachers within a year, overcoming remote work challenges, foreign language barriers, and cultural differences.",
    actions: [
      {
        heading: "Foundational Testing with Early Hires",
        items: [
          "Hired two initial contractors to understand cultural fit, compensation expectations, and quality standards.",
          "Defined non-negotiable hiring criteria based on learnings.",
        ],
      },
      {
        heading: "Iterative Referral-Based Scaling",
        items: [
          "Asked each early hire for two quality referrals to test repeatability.",
          "Allowed the first hires to act as trusted recruiters, ensuring quality control.",
        ],
      },
      {
        heading: "Scaling Acquisition Channels",
        items: [
          "Introduced multiple recruitment channels, including:",
          "Meta Ads (Social Media Targeting)",
          "Job Boards",
          "University Ambassadors",
          "Recruitment Consultants",
          "Print Ads & Local Newspapers",
          "Referral Programs",
        ],
      },
      {
        heading: "Building Retention & Quality Standards",
        items: [
          "Created a localized onboarding & training process to ensure teachers met the expected teaching quality.",
          "Adjusted incentive structures to match local motivators and job expectations.",
        ],
      },
    ],
    context: {
      heading: "Key Product Manager Skill Sets Applied",
      skills: [
        "Market Expansion & Localization: Developed a country-specific hiring model while respecting cultural nuances.",
        "Scalable Growth Strategy: Designed a repeatable system with multiple acquisition channels.",
        "Process Optimization: Established a structured pipeline to ensure quality at scale.",
      ],
    },
  },
  {
    id: 3,
    title: "Scaling RoboChamp Kit Shipments Across Countries",
    result:
      "Successfully expanded RoboChamp kit shipments to three key international markets while reducing logistical costs by 25% through optimized vendor partnerships and localized distribution.",
    actions: [
      {
        heading: "Market & Demand Analysis",
        items: [
          "Analyzed customer purchase data & shipping costs to identify the top three viable expansion markets.",
          "Validated demand with pre-order interest and existing customer inquiries.",
        ],
      },
      {
        heading: "Supply Chain Optimization",
        items: [
          "Established local warehousing solutions in high-volume regions to reduce last-mile delivery costs.",
          "Partnered with regional vendors to minimize international shipping loss and delays.",
        ],
      },
      {
        heading: "Branding & Packaging Optimization",
        items: [
          "Negotiated cost-effective branded packaging with local suppliers to maintain brand consistency while lowering costs.",
        ],
      },
      {
        heading: "Strategic Shipping Partnerships for Scale",
        items: [
          "Partnered with bulk shippers handling similar routes to negotiate better shipping rates.",
          "Introduced batch shipping models to optimize costs for international fulfillment.",
        ],
      },
      {
        heading: "Automated Logistics & Tracking",
        items: [
          "Integrated a shipment tracking system with customer dashboards to increase transparency & reduce support requests.",
          "Set up real-time inventory tracking for accurate order fulfillment.",
        ],
      },
    ],
    context: {
      heading: "Key Product Manager Skill Sets Applied",
      skills: [
        "Supply Chain & Logistics Strategy: Built a scalable shipping model with cost-efficient fulfillment.",
        "Vendor & Partnership Management: Negotiated optimized contracts with shippers and local vendors.",
        "Technology & Customer Experience: Implemented automated tracking for better user experience and operational efficiency.",
      ],
    },
  },
];

// Component for displaying a single case study
function CaseStudy({ data }: { data: CaseStudyData }) {
  return (
    <Card className="mb-16 overflow-hidden border-0 shadow-lg">
      <div className="bg-card p-6">
        <h2 className="mb-3 text-2xl font-bold text-card-foreground lg:text-3xl">
          {data.title}
        </h2>
      </div>

      <CardContent className="p-6 lg:p-8">
        {/* Result section */}
        <div className="mb-8">
          <h3 className="mb-3 text-xl font-semibold text-primary">Result</h3>
          <p className="text-lg">{data.result}</p>
        </div>

        <Separator className="my-8" />

        {/* Actions section */}
        <div className="mb-8">
          <h3 className="mb-6 text-xl font-semibold text-primary">Action</h3>
          <div className="space-y-8">
            {data.actions.map((action, index) => (
              <div key={index} className="rounded-lg bg-muted/40 p-6">
                <h4 className="mb-3 font-semibold">{action.heading}</h4>
                <ul className="ml-5 list-disc space-y-2">
                  {action.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Context section */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-primary">
            Context ({data.context.heading})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.context.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1 text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-12 lg:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Case Studies</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          In-depth looks at complex problems I've solved and the approaches I
          took to deliver meaningful results.
        </p>
      </div>

      {caseStudiesData.map((study) => (
        <div key={study.id}>
          <CaseStudy data={study} />
        </div>
      ))}
    </div>
  );
}
