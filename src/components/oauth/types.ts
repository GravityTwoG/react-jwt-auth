export type OAuthButtonProps = {
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  provider: string;
  onClick: (provider: string) => void;
};