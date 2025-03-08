"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

type Role =
  | "tech-leader"
  | "people-manager"
  | "individual-contributor"
  | "strategy-contributor";

type HighlightsProps = {
  role: Role;
};

// Updated interface to support both images and videos
type MediaContent = {
  type: 'image' | 'video';
  url: string;
  posterUrl?: string; // Optional poster image for videos
};

const highlightsData: Record<Role, {
  media: MediaContent;
  points: string[];
}> = {
  "tech-leader": {
    media: {
      type: 'image',
      url: "https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Expertise/Description/Climate+Business.jpeg",
    },
    points: [
      "Led initiatives to stabilize conversion rates during rapid scaling, refining engagement models and optimizing processes for sustained learner success.",
      "Introduced scalable product structures in climate education, enhancing content delivery and facilitating successfully large group learner engagements in the DACH region.",
      "Developed scalable workflows for partner acquisition and lesson delivery, increasing operational efficiency and managing millions of tutoring minutes.",
      "Founded an online educational platform where 100% of students came through referrals, achieving 15% YoY growth and extended student engagement.",
      "Designed an Energy Audit & Solutions Recommendation Engine, achieving significant energy savings and lighting up hundreds of homes annually.",
    ],
  },
  "people-manager": {
    media: {
      type: 'image',
      url: "https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Expertise/Description/Sales+done+slack+text.jpg",
    },
    points: [
      "Developed and implemented robust operational strategies that streamlined company workflows, significantly increasing efficiency and reducing costs by over 20%.",
      "Fostered a team-oriented environment that encouraged innovation and collaborative problem-solving, leading to a 25% increase in project delivery efficiency.",
      "Spearheaded the adoption of advanced digital tools and project management systems, enhancing team productivity and enabling real-time tracking of key performance indicators.",
      "Initiated and led a company-wide change management program that successfully integrated agile methodologies, improving responsiveness and flexibility in operations.",
      "Championed employee well-being and professional growth, resulting in a 15% improvement in employee retention rates and a highly engaged workforce.",
    ],
  },
  "individual-contributor": {
    media: {
      type: 'video',
      url: "https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Expertise/Description/Edoflip+Reena+Video.mp4",
    },
    points: [
      "Architected and implemented scalable backend systems handling millions of user interactions daily",
      "Created innovative AI-powered algorithms for personalized learning experiences with 98% accuracy",
      "Engineered robust data pipelines that processed terabytes of educational data for actionable insights",
      "Developed high-performance frontend components that reduced load times by 45%",
      "Built cross-platform solutions ensuring seamless user experience across web and mobile interfaces",
    ],
  },
  "strategy-contributor": {
    media: {
      type:'video',
      url: "https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Expertise/Description/BC+Video.mp4",
    },
    points: [
      "Guided BrightChamps' strategic vision and operational transformation, significantly impacting overall growth and market positioning",
      "Implemented data-driven decision making that resulted in 25% improvement in conversion rates and learner retention",
      "Created innovative educational products that expanded our reach to over 30 countries",
      "Led cross-functional teams to solve complex business challenges during rapid scaling phases",
      "Established scalable operational frameworks that supported 3x annual growth",
    ],
  },
};

export function Highlights({ role }: HighlightsProps) {
  const { media, points } = highlightsData[role];
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to handle video play/pause
  const handleVideoClick = (videoEl: HTMLVideoElement) => {
    if (videoEl.paused) {
      videoEl.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
          // Show a message to the user that autoplay might be blocked
        });
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };
  
  // Listen for video end event to reset play state
  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center" style={{ color: '#222222' }}>Key Highlights</h2>
      <Card className="border-none shadow-md">
        <div className="grid gap-8 p-6 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`${role} highlights`}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Image+Not+Found";
                }}
              />
            ) : (
              <div className="relative h-full w-full">
                <video
                  src={media.url}
                  poster={media.posterUrl}
                  className="absolute inset-0 h-full w-full object-cover cursor-pointer"
                  onClick={(e) => handleVideoClick(e.target as HTMLVideoElement)}
                  onEnded={() => handleVideoEnded()}
                  playsInline
                  muted
                  controls
                  preload="auto"
                  onError={(e) => {
                    const videoEl = e.target as HTMLVideoElement;
                    console.error("Video error:", videoEl.error);
                    videoEl.style.display = 'none';
                    const parent = videoEl.parentElement;
                    if (parent) {
                      const errorImg = document.createElement('img');
                      errorImg.src = "https://via.placeholder.com/400?text=Video+Not+Found";
                      errorImg.className = "absolute inset-0 h-full w-full object-cover";
                      parent.appendChild(errorImg);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-4">
              {points.map((point, index) => (
                <li key={index} className="text-lg">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 