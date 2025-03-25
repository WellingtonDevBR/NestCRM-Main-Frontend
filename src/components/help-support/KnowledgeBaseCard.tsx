
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeBaseArticle } from "@/domain/models/helpAndSupport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeBaseCardProps {
  article: KnowledgeBaseArticle;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({ article }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-purple-500 mt-1" />
          <div>
            <CardTitle className="text-lg font-medium">{article.title}</CardTitle>
            <Badge variant="outline" className="mt-2">
              {article.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {article.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}
          </div>
          <Button variant="ghost" size="sm">
            Read More <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseCard;
