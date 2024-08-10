import { cn } from '@/utils';
import { ComponentProps } from 'react';

export type H1Props = ComponentProps<'h1'>;

export const H1 = (props: H1Props) => {
  return (
    <h1
      {...props}
      className={cn('text-5xl leading-snug font-bold', props.className)}
    />
  );
};

export type H2Props = ComponentProps<'h2'>;

export const H2 = (props: H2Props) => {
  return (
    <h2
      {...props}
      className={cn('text-3xl leading-snug font-bold', props.className)}
    />
  );
};
