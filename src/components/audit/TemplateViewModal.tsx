import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hierarchy, Warning2 } from "iconsax-react";
import { useGetTemplateQuery } from "@/redux/api/endpoints/templateEndpoints";

interface TemplateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string | null;
}

export function TemplateViewModal({ isOpen, onClose, templateId }: TemplateViewModalProps) {
  const { data: templateData, isLoading: loading, error: templateError } = useGetTemplateQuery(templateId!, {
    skip: !isOpen || !templateId,
  });

  const template = templateData?.template;
  const error = templateError ? "Failed to load template details" : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl max-h-[85vh]"
      title={template ? template.name : "Loading Template..."}
      description={template ? `Regulatory Base: ${template.regulatoryBase?.toUpperCase()} | Location: ${template.locationType?.toUpperCase()}` : ""}
      footer={
        <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
          Close
        </Button>
      }
    >
      <div className="space-y-6 pb-2">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive flex flex-col items-center gap-3">
            <Warning2 size={48} variant="Bulk" className="opacity-50" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : template ? (
          <div className="space-y-8">
            {template.categories?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm border rounded-lg bg-muted/20">
                No categories or questions found for this template.
              </div>
            ) : (
              template.categories?.map((cat: { id: string; name: string; questions: { id: string; query: string; manualRef?: string | null }[] }, index: number) => (
                <div key={cat.id} className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-muted/30 border-b border-border/50 px-4 py-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                    <h3 className="font-bold tracking-wider text-sm uppercase flex-1">{cat.name}</h3>
                  </div>
                  
                  <div className="bg-background">
                    <Table>
                      <TableHeader className="bg-muted/10 opacity-70 border-b-border/30">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-16 text-center text-[10px] uppercase font-bold tracking-widest h-9">No.</TableHead>
                          <TableHead className="text-[10px] uppercase font-bold tracking-widest h-9">Checklist Item / Query</TableHead>
                          <TableHead className="text-[10px] uppercase font-bold tracking-widest h-9">Manual Ref</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cat.questions?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-6">
                              No questions in this category
                            </TableCell>
                          </TableRow>
                        ) : (
                          cat.questions?.map((q: { id: string; query: string; manualRef?: string | null }, qIndex: number) => (
                            <TableRow key={q.id} className="border-border/30 hover:bg-muted/20">
                              <TableCell className="text-center text-xs font-medium text-muted-foreground/60 w-16 align-top pt-4">
                                {index + 1}.{qIndex + 1}
                              </TableCell>
                              <TableCell className="text-sm font-medium leading-relaxed align-top pt-4">
                                {q.query}
                              </TableCell>
                              <TableCell className="align-top pt-4 w-40">
                                {q.manualRef ? (
                                  <span className="font-mono text-[10px] font-bold bg-muted px-2 py-1 rounded text-muted-foreground leading-relaxed whitespace-nowrap">
                                    {q.manualRef}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground/40 italic">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
              <span className="flex items-center gap-2"><Hierarchy size={14} /> Structural Overview</span>
              <span>{template.categories?.length || 0} Categories • {template.categories?.reduce((acc: number, c: { questions?: unknown[] }) => acc + (c.questions?.length || 0), 0) || 0} Total Questions</span>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
