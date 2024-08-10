import { cn } from '@/utils';
import { useConsentURL } from '../hooks/useConsentURL';

import { Button } from './Button';

export type GoogleConsentURLButtonProps = {
  disabled?: boolean;
  redirectPath: string;
  children?: React.ReactNode;
  className?: string;
};

export const GoogleConsentURLButton = (props: GoogleConsentURLButtonProps) => {
  const onClick = useConsentURL({
    redirectPath: props.redirectPath,
    provider: 'google',
  });

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={props.disabled}
      className={cn("bg-red-500 hover:bg-red-400", props.className)}
    >
      {props.children}
    </Button>
  );
};
