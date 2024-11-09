import { cn } from '@/utils';
import { Button } from '../Button';
import { OAuthButtonProps } from './types';

export const GithubOAuthButton = (props: OAuthButtonProps) => {
  return (
    <Button
      type="button"
      onClick={() => props.onClick(props.provider)}
      disabled={props.disabled}
      className={cn(
        'bg-white hover:bg-gray-100 font-bold !text-gray-800 hover:text-gray-900',
        props.className
      )}
    >
      {props.children}
    </Button>
  );
};
