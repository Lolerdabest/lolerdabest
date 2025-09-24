
'use client';

import { confirmBetAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { useTransition } from 'react';

export function ConfirmBetButton({ betId }: { betId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await confirmBetAction(betId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <Button
      onClick={handleConfirm}
      disabled={isPending}
      size="sm"
    >
      <Check className="mr-2 h-4 w-4" />
      {isPending ? 'Confirming...' : 'Confirm'}
    </Button>
  );
}
