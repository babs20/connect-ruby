import type { TGroupSchema } from '@/api/schemas/groups';
import type { BadgeProps } from './ui/badge';
import { Badge } from './ui/badge';
import { GlobeSvg } from './svgs/GlobeSvg';
import { InviteSvg } from './svgs/InviteSvg';
import { LockSvg } from './svgs/LockSvg';
import { cn, humanize } from '@/utils/utils';

interface PrivacyBadgeProps extends BadgeProps {
  text: TGroupSchema['privacySetting'];
}

function PrivacyBadge({ text, className, ...props }: PrivacyBadgeProps) {
  return (
    <Badge variant={'outline'} className={cn('items-center gap-2', className)} {...props}>
      {text === 'public' && <GlobeSvg className='w-4 h-4' />}
      {text === 'private' && <LockSvg className='w-4 h-4' />}
      {text === 'invitation_only' && <InviteSvg className='w-4 h-4' />}
      <span>{humanize(text)}</span>
    </Badge>
  );
}

export { PrivacyBadge };
