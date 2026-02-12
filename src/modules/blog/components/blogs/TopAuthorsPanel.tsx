import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface AuthorStat {
  id: string;
  name: string;
  avatar?: string | null;
  posts: number;
  views: number;
  likes: number;
  online?: boolean;
  role?: string | null;
}

export default function TopAuthorsPanel({ authors, variant = "default" }: { authors: AuthorStat[]; variant?: "default" | "sidebar" }) {
  if (!authors?.length) return null;

  const isSidebar = variant === "sidebar";

  return (
    <Card className={isSidebar ? "p-3 bg-sidebar-accent/35 border-sidebar-border" : "p-4"}>
      <div className={isSidebar ? "font-semibold mb-2 text-sm" : "font-semibold mb-3"}>Top Authors</div>
      <ul className={isSidebar ? "space-y-2" : "space-y-3"}>
        {authors.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3">
            <Link to={`/profile/${a.id}`} className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
              <div className="relative">
                <Avatar className={isSidebar ? "h-8 w-8" : "h-9 w-9"}>
                  <AvatarImage src={a.avatar || undefined} alt={a.name} />
                  <AvatarFallback>{a.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {a.online && (
                  <span
                    className="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"
                    aria-label="Online"
                  />
                )}
              </div>
              <div>
                <div className="text-sm font-medium group-hover:underline">{a.name}</div>
                <div className="text-xs text-muted-foreground">
                  {isSidebar
                    ? `${a.posts} posts · ${a.likes} likes`
                    : `${a.role || "Author"} · ${a.posts} posts · ${a.views} views · ${a.likes} likes`}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
