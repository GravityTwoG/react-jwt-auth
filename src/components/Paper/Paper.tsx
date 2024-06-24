import clsx from 'clsx';

import classes from './paper.module.css';

export type PaperProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Paper = (props: PaperProps) => {
  return (
    <div className={clsx(classes.Paper, props.className)}>{props.children}</div>
  );
};
