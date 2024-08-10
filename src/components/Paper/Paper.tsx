import { cn } from '@/utils';

import classes from './paper.module.css';

export type PaperProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Paper = (props: PaperProps) => {
  return (
    <div className={cn(classes.Paper, props.className)}>{props.children}</div>
  );
};
