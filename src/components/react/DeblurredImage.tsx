import { useState } from 'react';

const ANIMATION_CONFIG = {
	'--blur': '42px',
	'--scale': '1.2',
	'--duration': '1.2s',
};

const merge = (...args: string[]) => args.join(' ');

const common = 'absolute block max-w-full w-full h-full inset-0 ';

interface Props extends HTMLImageElement {
	placeholder: React.CSSProperties;
}

export function DeblurredImage({ src, alt, height, width, placeholder }: Props) {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div
			className='block overflow-hidden relative pb-[var(--aspect-ratio)] translate-z-0'
			style={{
				['--aspect-ratio' as keyof React.CSSProperties]: `${(height / width) * 100}%`,
			}}
		>
			<div
				className={merge(
					common,
					'blur-[var(--blur)]',
					isLoaded ? 'opacity-0 scale-100' : 'opacity-100 scale-[var(--scale)]',
					'duration-[var(--duration)] ease-[ease] transition-[filter,opacity,transform] will-change-[filter,transform]',
				)}
				style={{ ...placeholder, ...ANIMATION_CONFIG }}
			/>
			<div
				className={merge(common, 'blur-[var(--blur)] opacity-50 absolute -z-10')}
				style={{ ...placeholder, ...ANIMATION_CONFIG }}
			/>
			<img
				className={merge(common, 'text-[0] transition-all ease-[ease] duration-[1.4s]', isLoaded ? 'opacity-100' : 'opacity-0')}
				style={ANIMATION_CONFIG}
				alt={alt}
				src={src}
				height={1338}
				width={2373}
				onLoad={() => setIsLoaded(true)}
			/>
		</div>
	);
}
