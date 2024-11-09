import { cn } from '@/utils';

import { Button } from '../Button';
import { OAuthButtonProps } from './types';

export const GoogleOAuthButton = (props: OAuthButtonProps) => {
  return (
    <Button
      type="button"
      onClick={() => props.onClick(props.provider)}
      disabled={props.disabled}
      className={cn('bg-red-500 hover:bg-red-400 font-bold', props.className)}
    >
      {props.children}
    </Button>
  );
};
