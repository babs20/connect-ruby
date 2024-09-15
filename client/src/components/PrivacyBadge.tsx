import type { TGroupSchema } from '@/api/schemas/groups';
import { Badge } from './ui/badge';
import { GlobeSvg } from './svgs/GlobeSvg';
import { InviteSvg } from './svgs/InviteSvg';

type PrivacyBadgeProps = {
  text: TGroupSchema['privacySetting'];
};

function PrivacyBadge({ text }: PrivacyBadgeProps) {
  return (
    <Badge variant={'outline'} className='items-center gap-2'>
      {text === 'Public' && <GlobeSvg />}
      {text === 'Private' && <GlobeSvg />}
      {text === 'Invitation Only' && <InviteSvg />}
      <span>{text}</span>
    </Badge>
  );
}

export { PrivacyBadge };
