import { cn } from '@/utils';

import classes from './container.module.css';

export type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Container = (props: ContainerProps) => {
  return (
    <div
      className={cn(classes.Container, props.className)}
      style={props.style}
    >
      {props.children}
    </div>
  );
};
