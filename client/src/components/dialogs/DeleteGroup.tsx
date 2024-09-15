import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import type { TFormGroupSchema } from '@/utils/groupQueryOptions';
import { formGroupSchema, useDeleteGroup } from '@/utils/groupQueryOptions';
import { useState } from 'react';
import type { z } from 'zod';
import type { GroupBaseDataSchema } from '@/api/schemas/groups';
import { TrashSvg } from '../svgs/TrashSvg';
import { useRouter } from '@tanstack/react-router';

type EditGroupDialogProps = {
  group: z.infer<typeof GroupBaseDataSchema>;
};

function DeleteGroupDialog({ group }: EditGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const deleteGroup = useDeleteGroup();
  const form = useForm<TFormGroupSchema>({
    resolver: zodResolver(formGroupSchema),
    defaultValues: {
      name: group.attributes.name,
      description: group.attributes.description,
      privacy_setting: group.attributes.privacySetting,
    },
  });

  function onSubmit() {
    deleteGroup.mutate(group.id, {
      onSuccess: () => {
        form.reset();
        void router.navigate({ to: '/groups' });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive'>
          <TrashSvg className='mr-2' />
          Delete Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Group</DialogTitle>
          <DialogDescription>Are you sure you want to delete this group?</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Button type='submit' variant='destructive'>
                Delete
              </Button>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteGroupDialog };
