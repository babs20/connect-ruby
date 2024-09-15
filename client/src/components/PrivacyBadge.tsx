import type { TGroupSchema } from '@/api/schemas/groups';
import { Badge } from './ui/badge';
import { GlobeSvg } from './svgs/GlobeSvg';
import { InviteSvg } from './svgs/InviteSvg';
import { LockSvg } from './svgs/LockSvg';
import { humanize } from '@/utils/utils';

type PrivacyBadgeProps = {
  text: TGroupSchema['privacySetting'];
};

function PrivacyBadge({ text }: PrivacyBadgeProps) {
  return (
    <Badge variant={'outline'} className='items-center gap-2'>
      {text === 'public' && <GlobeSvg className='w-4 h-4' />}
      {text === 'private' && <LockSvg className='w-4 h-4' />}
      {text === 'invitation_only' && <InviteSvg className='w-4 h-4' />}
      <span>{humanize(text)}</span>
    </Badge>
  );
}

export { PrivacyBadge };
