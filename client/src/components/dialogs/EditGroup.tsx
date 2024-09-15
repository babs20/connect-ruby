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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TFormGroupSchema } from '@/utils/groupQueryOptions';
import { formGroupSchema, useEditGroup } from '@/utils/groupQueryOptions';
import { useState } from 'react';
import { EditSvg } from '../svgs/EditSvg';
import type { z } from 'zod';
import type { GroupBaseDataSchema } from '@/api/schemas/groups';

type EditGroupDialogProps = {
  group: z.infer<typeof GroupBaseDataSchema>;
};

function EditGroupDialog({ group }: EditGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const editGroup = useEditGroup(group.id);
  const form = useForm<TFormGroupSchema>({
    resolver: zodResolver(formGroupSchema),
    defaultValues: {
      name: group.attributes.name,
      description: group.attributes.description,
      privacy_setting: group.attributes.privacySetting,
    },
  });

  function onSubmit(values: TFormGroupSchema) {
    editGroup.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <EditSvg className='mr-2' />
          Edit Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>Make changes to your group here. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Group Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder='Group Description' className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='privacy_setting'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Setting</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='public'>Public</SelectItem>
                      <SelectItem value='private'>Private</SelectItem>
                      <SelectItem value='invitation_only'>Invitation Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { EditGroupDialog };
