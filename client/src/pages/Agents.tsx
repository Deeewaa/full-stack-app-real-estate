import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent/AgentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Agent } from "@shared/schema";

export default function Agents() {
  const { data: agents, isLoading } = useQuery({
    queryKey: ["/api/agents"],
  });

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Meet Our Elite Agents
          </h1>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Our network of experienced real estate professionals ensures you receive the highest level of service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array(8)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            agents?.map((agent: Agent) => <AgentCard key={agent.id} agent={agent} />)
          )}
        </div>
      </div>
    </div>
  );
}
