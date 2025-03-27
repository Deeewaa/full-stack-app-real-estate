import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Agent } from "@shared/schema";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative overflow-hidden h-64">
        <img
          src={agent.imageUrl}
          alt={agent.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-1">{agent.name}</h3>
        <p className="text-[#E0A458] mb-4">{agent.title}</p>
        <p className="text-neutral-600 mb-5">{agent.bio}</p>
        <div className="flex space-x-3">
          {agent.instagram && (
            <a
              href={`https://instagram.com/${agent.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#D8553A]"
              aria-label={`${agent.name}'s Instagram`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          )}
          {agent.linkedin && (
            <a
              href={`https://linkedin.com/in/${agent.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#D8553A]"
              aria-label={`${agent.name}'s LinkedIn`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          )}
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              className="text-neutral-400 hover:text-[#D8553A]"
              aria-label={`Email ${agent.name}`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
