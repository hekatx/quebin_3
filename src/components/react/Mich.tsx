import { Center, Instance, Instances, PerspectiveCamera, Scroll, ScrollControls, SoftShadows, useScroll } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { AnimatePresence, motion, useAnimate, type AnimationOptions } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import './Mich.css';
import { Leaves } from './falling-leaves';
import { Flowers } from './flowers';

const presenceVariants = {
	hidden: {
		opacity: 0,
		y: 10,
		filter: 'blur(4px)',
	},
	visible: { opacity: 1, y: 0, filter: 'blur(0)' },
};

const previewVariants = {
	hidden: {
		opacity: 0,
		filter: 'blur(4px)',
	},
	visible: { opacity: 1, filter: 'blur(0)' },
};

const width = 16;
const aspect_ratio = 175 / 148;
const height = width * aspect_ratio;

const spring: AnimationOptions = { type: 'spring', mass: 1, stiffness: 170, damping: 20 };

export function Mich() {
	const [state, set] = useState<number>(0);
	return (
		<main className='text-base w-full '>
			<Canvas dpr={0.5} shadows>
				<ambientLight intensity={Math.PI / 2} />
				<directionalLight castShadow position={[5, 5, 30]} intensity={1} shadow-mapSize={2048}>
					<orthographicCamera attach='shadow-camera' args={[-15, 15, 15, -15, 1, 50]} />
				</directionalLight>
				<ScrollControls prepend pages={1} damping={0.25}>
					<Scroll>
						<Cam />
					</Scroll>
					<Scroll html>
						<div className='absolute w-[100vw] h-[100vh] flex items-center'>
							<div
								style={{
									position: 'absolute',
									top: '5%',
									right: '5%',
									fontSize: '15px',
									textAlign: 'right',
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								—
								<br />
								14/02/25
							</div>
							<AnimatePresence>
								{state == 0 && (
									<motion.div
										className='absolute w-full h-full'
										initial='hidden'
										animate='visible'
										exit='hidden'
										variants={presenceVariants}
									>
										<h2 className='absolute top-[31%] left-1/2 -translate-x-1/2 text-zinc-700 !text-lg'>Feliz</h2>
										<h1 className='absolute top-1/3 left-1/2 -translate-x-1/2 text-zinc-700 font-semibold !text-3xl w-max'>
											San Valentín
										</h1>
										<span className='block absolute top-[38%] left-1/2 -translate-x-1/2 text-zinc-700'>
											<svg width={width} height={height} viewBox='0 0 148 175' id='svg2' version='1.1'>
												<defs id='defs4' />
												<g id='layer1' transform='translate(0,-877.36216)'>
													<path
														fill='currentColor'
														stroke='none'
														d='M 72.527478,1027.3356 C 67.735381,1012.5493 60.313567,1000.5864 34.362543,965.81962 18.536177,944.6169 12.638368,934.36254 10.707991,924.69211 c -2.34401,-11.74257 1.196833,-22.934 9.664894,-30.54751 5.693913,-5.11932 11.608399,-7.31434 19.708529,-7.31434 13.35413,0 24.173768,7.64475 30.646178,21.65344 1.853077,4.01074 3.699135,6.9191 4.10235,6.46303 0.403216,-0.45608 1.467487,-2.76806 2.365047,-5.13774 3.890151,-10.27052 12.753803,-19.15322 21.999836,-22.0471 6.268975,-1.96211 17.496565,-0.79433 23.434335,2.43742 16.5279,8.9956 20.13184,28.66056 9.23263,50.37797 -4.28341,8.53497 -8.26314,14.35165 -21.47246,31.38367 -18.465777,23.80963 -29.595326,41.93515 -34.001621,55.37465 -0.906412,2.7646 -1.779228,5.0266 -1.939592,5.0266 -0.160363,0 -1.024651,-2.262 -1.920639,-5.0266 z'
														id='path5865'
														inkscape:connector-curvature='0'
													/>
												</g>
											</svg>
										</span>
									</motion.div>
								)}
							</AnimatePresence>
							<div className='mx-auto max-w-[90%] '>
								<Letter state={state} set={set} />
							</div>
						</div>
					</Scroll>
					<Center rotation={[0, 0.5, 0]} position={[-10, 0, 20]}>
						<Blinds />
					</Center>
				</ScrollControls>
				<Leaves position={[0, -8, 10]} scale={40} />
				<Flowers position={[9, -7.5, 8]} rotation={[0, 0, 0.6]} scale={1.3} />
				<mesh receiveShadow scale={100} position={[0, 0, -0]} rotation={[0, 0.1, 0]}>
					<planeGeometry />
					<shadowMaterial transparent opacity={0.3} />
				</mesh>
				<SoftShadows size={15} focus={0} samples={32} />
			</Canvas>
		</main>
	);
}

function Cam({ children }) {
	const ref = useRef();
	useFrame((state, delta) => {
		easing.damp3(ref.current.position, [state.pointer.x / 2, state.pointer.y / 2, 5], 0.5, delta); // Move camera
		ref.current.lookAt(0, 0, -100);
		ref.current.updateProjectionMatrix();
	});
	return (
		<PerspectiveCamera makeDefault ref={ref} position={[0, 0, 5]} fov={75}>
			{children}
		</PerspectiveCamera>
	);
}

function Blinds({ howmany = 50, ...props }) {
	const ref = useRef();
	const scroll = useScroll();
	useFrame((state) => {
		ref.current.children.forEach((child) => {
			child.rotation.x = 0.5 + scroll.offset / 1.5;
			child.rotation.z = -0.2;
			child.rotation.y = scroll.offset / 10;
		});
	});
	return (
		<Instances castShadow {...props}>
			<boxGeometry />
			<meshBasicMaterial />
			<group ref={ref}>
				{Array.from({ length: howmany }, (_, i) => (
					<Instance key={i} position={[0, i, 0]} scale={[100, 0.9, 0.01]} rotation={[0.5, 0, 0]} />
				))}
			</group>
			<Instance position={[18, howmany / 2, 0]} scale={[0.2, howmany, 0.01]} />
		</Instances>
	);
}

const steps = ['closed', 'preview', 'open', 'love', 'mich', 'share', 'preend', 'end'];

export function Letter({ state, set }: { state: number; set: React.Dispatch<React.SetStateAction<number>> }) {
	const [scope, animate] = useAnimate();
	const [dirty, setDirty] = useState(false);

	function toggle() {
		const n = (state + 1) % steps.length;
		set(n);

		switch (n) {
			case 0:
				animate(
					'.card',
					{ y: '0%' },
					{
						...spring,
						onUpdate: (value) => {
							if (parseFloat(value) < 10 && dirty) {
								animate('.card', { zIndex: 0 });
								setDirty(false);
							}
						},
					},
				);
				break;
			case 1:
				animate(
					'.envelope-front',
					{ y: '25%' },
					{
						...spring,
						onUpdate: (value) => {
							if (Math.abs(parseFloat(value)) > 23 && !dirty) {
								animate('.envelope-front', { y: '0' }, spring);
							}
						},
					},
				);
				animate(
					'.envelope-back',
					{ y: '15%' },
					{
						...spring,
						onUpdate: (value) => {
							if (Math.abs(parseFloat(value)) > 13 && !dirty) {
								animate('.envelope-back', { y: '0' }, spring);
							}
						},
					},
				);
				animate(
					'.card',
					{ y: '-80%' },
					{
						...spring,
						onUpdate: (value) => {
							if (Math.abs(parseFloat(value)) > 48 && !dirty) {
								animate('.card', { zIndex: 5, y: 0 });
								setDirty(true);
							}
						},
					},
				);

				break;
			case 2:
				break;
		}
	}

	const step = steps[state] as string;

	return (
		<>
			<button ref={scope} type='button' className='graph' onClick={toggle}>
				<motion.div className='envelope envelope-front backdrop' />
				<motion.div className='envelope envelope-back backdrop' />
				<CardOne className='card' step={step} />
			</button>
		</>
	);
}

function CardOne({ className, step }: { className: string; step: string }) {
	return (
		<div className={`${className} relative`}>
			<AnimatePresence mode='wait'>
				{step == 'preview' && (
					<motion.div
						key='preview'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={previewVariants}
						className='flex flex-col justify-between h-full'
					>
						<motion.p className='card-content !text-2xs sm:!text-sm !text-stone-400 !font-normal'>
							Para: Mich, mi morrita, mi amor, mi todo
						</motion.p>
						<motion.p className='card-content'>
							Hola! Recientemente me di cuenta que podrían pasar mil San Valentines, pero ninguno sería especial si no fuera
							contigo.
						</motion.p>
						<motion.p className='card-content !text-2xs sm:!text-base pt-0 !text-stone-400'>
							(Presiona sobre la carta de nuevo para leer más)
						</motion.p>
					</motion.div>
				)}
				{step == 'open' && (
					<motion.p
						key='open'
						className='card-content !opacity-100'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={presenceVariants}
					>
						Siento que esta carta debería ser muy fácil de escribir por lo mucho que te amo pero es difícil escoger las palabras
						correctas para decirte que te amo aún cuando tenemos muchas formas de decirlo incluso sin hablar, sin vernos, sin
						siquiera tocarnos, sé que siempre nos decimos te amo
					</motion.p>
				)}

				{step == 'love' && (
					<motion.p
						key='love'
						className='card-content'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={presenceVariants}
					>
						Y es raro que no logre encontrar las palabras porque siempre quiero decírtelo todo y que luego me escuches y me
						mires con esos ojos que me llenan de vida cuando los veo. No quiero sonar como que soy dependiente pero no me pienso
						en otro lugar que no sea a tu lado.
					</motion.p>
				)}

				{step == 'mich' && (
					<motion.p
						key='mich'
						className='card-content'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={presenceVariants}
					>
						Realmente no recuerdo, desde hace años, algun día en el que no haya pensado en ti, en que no me haya reído y pensado
						"Michelle tiene que ver esto". Esta de más decir que me encanta compartir todo contigo, las risas, el llanto, la
						anticipación, el tacto,
					</motion.p>
				)}

				{step == 'share' && (
					<motion.p
						key='share'
						className='card-content'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={presenceVariants}
					>
						la emoción de vernos después de un tiempo, las miradas llenas de deseo. Te amo muchísimo y no veo forma en que mi
						amor por ti se termine, lo veo crecer todos los días. Cuidamos muy bien de nuestra relación y lo aprecio muchísimo.
						Te amo
					</motion.p>
				)}

				{step == 'preend' && (
					<motion.div
						key='preend'
						className='flex h-full items-center'
						initial='hidden'
						animate='visible'
						exit='hidden'
						variants={presenceVariants}
					>
						<motion.p className='card-content min-w-full'>Es muy lindo poder compartir la vida contigo.</motion.p>
					</motion.div>
				)}
				{step == 'end' && (
					<>
						<motion.div
							key='end'
							className='polaroid-container'
							initial='hidden'
							animate='visible'
							exit='hidden'
							variants={{
								hidden: {
									opacity: 0,
									y: 10,
									x: '-50%',
									filter: 'blur(4px)',
								},
								visible: {
									opacity: 1,
									y: 0,
									x: '-50%',
									filter: 'blur(0)',
								},
							}}
						>
							<Polaroid img='/adam.jpg' i={1} />
							<Polaroid img='/minho.jpg' i={2} />
							<Polaroid img='/love.jpeg' i={3} />
							<Polaroid img='/ross.jpg' i={4} />
							<Polaroid img='/edward.jpg' i={5} />
						</motion.div>
						<motion.div
							className='flex h-full items-center'
							initial='hidden'
							animate='visible'
							exit='hidden'
							variants={presenceVariants}
						>
							<motion.p className='card-content !max-w-[70%] sm:!max-w-[50%] text-center'>
								Feliz San Valentin de parte de todos tus novios
							</motion.p>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

function Polaroid({ img, i }: { img: string; i: number }) {
	return (
		<motion.div className='polaroid shadow-lg shadow-black' style={{ '--i': i }}>
			<img src={img} className='rounded-none' />
		</motion.div>
	);
}
