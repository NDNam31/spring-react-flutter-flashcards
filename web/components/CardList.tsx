"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Card } from "@/types/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditCardDialog } from "@/components/EditCardDialog";
import { BookOpen, MoreHorizontal, Pencil, Trash, Trash2, Star } from "lucide-react";

interface CardListProps {
  cards: Card[];
  isLoading: boolean;
  onCardDeleted?: () => void;
  onCardUpdated?: () => void;
}

const getLearningStateBadge = (state: Card["learningState"]) => {
  const variants = {
    NEW: { variant: "secondary" as const, label: "Mới" },
    LEARNING_MCQ: { variant: "info" as const, label: "Đang học (MCQ)" },
    LEARNING_TYPING: { variant: "info" as const, label: "Đang học (Gõ)" },
    REVIEWING: { variant: "success" as const, label: "Ôn tập" },
    RELEARNING: { variant: "warning" as const, label: "Học lại" },
  };

  const config = variants[state] || variants.NEW;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function CardList({
  cards,
  isLoading,
  onCardDeleted,
  onCardUpdated,
}: CardListProps) {
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [deletingCard, setDeletingCard] = useState<Card | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false);

  const handleDelete = async () => {
    if (!deletingCard) return;

    setIsDeleting(true);
    try {
      await api.delete(`/cards/${deletingCard.id}`);
      toast.success("Đã xóa thẻ thành công!");
      setDeletingCard(null);
      onCardDeleted?.();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Không thể xóa thẻ. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCards.size === 0) return;

    setIsDeleting(true);
    try {
      await api.delete('/cards/bulk-delete', {
        data: Array.from(selectedCards)
      });
      toast.success(`Đã xóa ${selectedCards.size} thẻ thành công!`);
      setSelectedCards(new Set());
      setShowBulkDeleteAlert(false);
      onCardDeleted?.();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Không thể xóa các thẻ. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleCardSelection = (cardId: number) => {
    const newSelection = new Set(selectedCards);
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else {
      newSelection.add(cardId);
    }
    setSelectedCards(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCards.size === cards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(cards.map(card => card.id)));
    }
  };

  const handleToggleStar = async (card: Card, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStarredState = !card.isStarred;
    
    try {
      const response = await api.put(`/cards/${card.id}`, {
        term: card.term,
        definition: card.definition,
        example: card.example || "",
        isStarred: newStarredState
      });
      
      console.log("⭐ Star toggle response - isStarred:", response.data.isStarred, "Full data:", response.data);
      toast.success(newStarredState ? "Đã đánh dấu sao ⭐" : "Đã bỏ dấu sao");
      
      // Trigger re-fetch to get latest data
      await onCardUpdated?.();
    } catch (error: any) {
      console.error("Toggle star error:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật thẻ");
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No.</TableHead>
              <TableHead>Thuật ngữ</TableHead>
              <TableHead>Định nghĩa</TableHead>
              <TableHead>Ví dụ</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="border rounded-lg p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Chưa có thẻ nào</h3>
          <p className="text-sm text-muted-foreground">
            Bắt đầu thêm thẻ học tập cho bộ thẻ này
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedCards.size > 0 && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedCards.size === cards.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="font-medium text-blue-900">
              Đã chọn {selectedCards.size} thẻ
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowBulkDeleteAlert(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa {selectedCards.size} thẻ đã chọn
          </Button>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCards.size === cards.length && cards.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">No.</TableHead>
              <TableHead className="w-12">⭐</TableHead>
              <TableHead>Thuật ngữ</TableHead>
              <TableHead>Định nghĩa</TableHead>
              <TableHead>Ví dụ</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card, index) => (
              <TableRow key={card.id} className={selectedCards.has(card.id) ? "bg-blue-50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={selectedCards.has(card.id)}
                    onCheckedChange={() => toggleCardSelection(card.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleToggleStar(card, e)}
                  >
                    <Star
                      className={`h-4 w-4 ${card.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: card.term }}
                  />
                </TableCell>
                <TableCell>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: card.definition }}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {card.example ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: card.example }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {getLearningStateBadge(card.learningState)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCard(card)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setDeletingCard(card)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingCard && (
        <EditCardDialog
          open={!!editingCard}
          onOpenChange={(open) => !open && setEditingCard(null)}
          card={editingCard}
          onUpdated={() => {
            setEditingCard(null);
            onCardUpdated?.();
          }}
        />
      )}

      <AlertDialog
        open={!!deletingCard}
        onOpenChange={(open) => !open && setDeletingCard(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thẻ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thẻ{" "}
              <strong>&quot;{deletingCard?.term}&quot;</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteAlert} onOpenChange={setShowBulkDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhiều thẻ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{selectedCards.size} thẻ</strong> đã chọn?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : `Xóa ${selectedCards.size} thẻ`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
