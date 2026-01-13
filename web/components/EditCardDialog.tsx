'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { Card } from '@/types/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const editCardSchema = z.object({
  term: z.string().min(1, 'Thuật ngữ không được để trống'),
  definition: z.string().min(1, 'Định nghĩa không được để trống'),
  example: z.string().optional(),
});

type EditCardFormData = z.infer<typeof editCardSchema>;

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card;
  onUpdated: () => void;
}

export function EditCardDialog({ open, onOpenChange, card, onUpdated }: EditCardDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCardFormData>({
    resolver: zodResolver(editCardSchema),
    defaultValues: {
      term: card.term,
      definition: card.definition,
      example: card.example || '',
    },
  });

  const onSubmit = async (data: EditCardFormData) => {
    setIsLoading(true);
    try {
      await api.put(`/cards/${card.id}`, {
        term: data.term,
        definition: data.definition,
        example: data.example || undefined,
      });

      toast.success('Cập nhật thẻ thành công!');
      onOpenChange(false);
      onUpdated();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Không thể cập nhật thẻ. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thẻ</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung cho thẻ học tập của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-term">
                Thuật ngữ (Mặt trước) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-term"
                {...register('term')}
                className={errors.term ? 'border-red-500' : ''}
              />
              {errors.term && (
                <p className="text-sm text-red-500">{errors.term.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-definition">
                Định nghĩa (Mặt sau) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-definition"
                rows={3}
                {...register('definition')}
                className={errors.definition ? 'border-red-500' : ''}
              />
              {errors.definition && (
                <p className="text-sm text-red-500">
                  {errors.definition.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-example">Ví dụ (Tùy chọn)</Label>
              <Input
                id="edit-example"
                {...register('example')}
                className={errors.example ? 'border-red-500' : ''}
              />
              {errors.example && (
                <p className="text-sm text-red-500">{errors.example.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
