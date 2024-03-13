import { useState } from 'react';

export function Command() {
	const [state, set] = useState(0);

	return (
		<div>
			<p>hola from react</p>
			<button onClick={() => set(state + 1)}>+</button>
			<p>{state}</p>
		</div>
	);
}
