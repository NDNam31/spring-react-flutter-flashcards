"use client";

import * as React from "react";
import { Sparkles, Loader2, Check, X, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/axios";
import { AiGenerateRequest, AiCard, AiCardWithState } from "@/types/ai";

interface AiGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: number;
  onCardsCreated: () => void;
}

/**
 * AI Magic Dialog Component
 * Generates flashcards using AI and allows preview/edit before saving
 * 
 * Flow:
 * 1. Input topic and quantity
 * 2. Call AI API to generate cards
 * 3. Preview/edit generated cards
 * 4. Select which cards to save
 * 5. Bulk create cards in deck
 */
export function AiGenerateDialog({
  open,
  onOpenChange,
  deckId,
  onCardsCreated,
}: AiGenerateDialogProps) {
  // Step 1: Input form
  const [topic, setTopic] = React.useState("");
  const [quantity, setQuantity] = React.useState(10);
  const [language] = React.useState("Vietnamese");
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Step 2: Preview cards
  const [generatedCards, setGeneratedCards] = React.useState<AiCardWithState[]>([]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  
  // Reset dialog when closed
  React.useEffect(() => {
    if (!open) {
      setTopic("");
      setQuantity(10);
      setGeneratedCards([]);
      setShowPreview(false);
      setEditingIndex(null);
    }
  }, [open]);
  
  // Generate cards using AI
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Vui lòng nhập chủ đề");
      return;
    }
    
    if (quantity < 1 || quantity > 20) {
      toast.error("Số lượng phải từ 1-20 thẻ");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const request: AiGenerateRequest = {
        topic: topic.trim(),
        quantity,
        language,
      };
      
      const response = await api.post<AiCard[]>("/ai/generate", request);
      
      // Add UI state to cards
      const cardsWithState: AiCardWithState[] = response.data.map((card) => ({
        ...card,
        selected: true, // Select all by default
        editing: false,
      }));
      
      setGeneratedCards(cardsWithState);
      setShowPreview(true);
      toast.success(`Đã tạo ${cardsWithState.length} thẻ bằng AI!`);
      
    } catch (error: any) {
      console.error("AI generation error:", error);
      const message = error.response?.data?.message || "AI đang bận, vui lòng thử lại sau";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Toggle card selection
  const toggleCardSelection = (index: number) => {
    setGeneratedCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, selected: !card.selected } : card
      )
    );
  };
  
  // Select/Deselect all
  const toggleSelectAll = () => {
    const allSelected = generatedCards.every((card) => card.selected);
    setGeneratedCards((prev) =>
      prev.map((card) => ({ ...card, selected: !allSelected }))
    );
  };
  
  // Edit card
  const handleEditCard = (index: number, field: keyof AiCard, value: string) => {
    setGeneratedCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      )
    );
  };
  
  // Save selected cards to deck
  const handleSaveCards = async () => {
    const selectedCards = generatedCards.filter((card) => card.selected);
    
    if (selectedCards.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 thẻ để lưu");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Bulk create cards
      const createPromises = selectedCards.map((card, index) =>
        api.post(`/decks/${deckId}/cards`, {
          deckId: deckId,  // Backend yêu cầu deckId trong body
          term: card.term,
          definition: card.definition,
          example: card.example,
          position: index,
        })
      );
      
      await Promise.all(createPromises);
      
      toast.success(`Đã lưu ${selectedCards.length} thẻ vào bộ thẻ!`);
      onCardsCreated();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Save cards error:", error);
      const message = error.response?.data?.message || "Không thể lưu thẻ";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const selectedCount = generatedCards.filter((card) => card.selected).length;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Magic - Tạo thẻ tự động
          </DialogTitle>
          <DialogDescription>
            Để AI tạo flashcards cho bạn chỉ trong vài giây!
          </DialogDescription>
        </DialogHeader>
        
        {!showPreview ? (
          // Step 1: Input Form
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Chủ đề bạn muốn học</Label>
              <Input
                id="topic"
                placeholder="Ví dụ: IELTS Vocabulary - Environment, Các món ăn Việt Nam..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={200}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Càng cụ thể càng tốt để AI tạo chính xác hơn
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng thẻ</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={20}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Tối đa 20 thẻ mỗi lần
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Tạo ngay
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          // Step 2: Preview & Edit
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={generatedCards.every((card) => card.selected)}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">
                  Đã chọn {selectedCount}/{generatedCards.length} thẻ
                </span>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                ← Tạo lại
              </Button>
            </div>
            
            {/* Cards List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto border rounded-lg p-4">
              {generatedCards.map((card, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 space-y-3 transition-colors ${
                    card.selected ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={card.selected}
                      onCheckedChange={() => toggleCardSelection(index)}
                    />
                    
                    <div className="flex-1 space-y-2">
                      {editingIndex === index ? (
                        // Edit mode
                        <>
                          <Input
                            value={card.term}
                            onChange={(e) => handleEditCard(index, "term", e.target.value)}
                            placeholder="Term"
                            className="font-medium"
                          />
                          <Input
                            value={card.definition}
                            onChange={(e) => handleEditCard(index, "definition", e.target.value)}
                            placeholder="Definition"
                          />
                          <Input
                            value={card.example}
                            onChange={(e) => handleEditCard(index, "example", e.target.value)}
                            placeholder="Example (optional)"
                          />
                        </>
                      ) : (
                        // View mode
                        <>
                          <div className="font-medium text-lg">{card.term}</div>
                          <div className="text-sm text-muted-foreground">{card.definition}</div>
                          {card.example && (
                            <div className="text-sm italic text-blue-600">
                              Ví dụ: {card.example}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    >
                      {editingIndex === index ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveCards}
                disabled={isSaving || selectedCount === 0}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Lưu {selectedCount} thẻ vào bộ thẻ
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Hủy
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
