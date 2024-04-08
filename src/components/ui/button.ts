import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center gap-2 justify-center rounded-md text-sm w-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:shadow-md',
	{
		variants: {
			variant: {
				default: 'bg-slate-800 text-slate-100 shadow hover:bg-slate-900'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);
