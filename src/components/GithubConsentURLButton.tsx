import { cn } from '@/utils';
import { useConsentURL } from '@/hooks/useConsentURL';
import { Button } from './Button';

export type GithubConsentURLButtonProps = {
  disabled?: boolean;
  redirectPath: string;
  children?: React.ReactNode;
  className?: string;
};

export const GithubConsentURLButton = (props: GithubConsentURLButtonProps) => {
  const onClick = useConsentURL({
    redirectPath: props.redirectPath,
    provider: 'github',
  });

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={props.disabled}
      className={cn("bg-white hover:bg-gray-100 font-bold !text-gray-800 hover:text-gray-900", props.className)}
    >
      {props.children}
    </Button>
  );
};
