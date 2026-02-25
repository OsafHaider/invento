import { Button } from "@/components/ui/button";

interface Props {
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const ProductsPagination = ({
  pages,
  currentPage,
  onPageChange,
}: Props) => {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(pages, currentPage + 1))}
        disabled={currentPage === pages}
      >
        Next
      </Button>
    </div>
  );
};