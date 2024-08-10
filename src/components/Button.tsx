import { cn } from '@/utils';
import { ComponentProps } from 'react';

export type ButtonProps = ComponentProps<'button'>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        `w-full bg-blue-500 hover:bg-blue-700 transition-colors text-white font-bold py-2 px-4 rounded`,
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
