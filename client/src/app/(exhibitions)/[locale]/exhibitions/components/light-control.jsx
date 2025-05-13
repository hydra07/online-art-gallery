import * as THREE from 'three';
import { useControls } from 'leva';
import { useRef } from 'react';

function LightControl() {
	const ambientRef = useRef();
	const directionalRef = useRef();
	const pointRef = useRef();
	const spotRef = useRef();

	useControls('Ambient Light', {
		visible: {
			value: true,
			onChange: (v) => {
				ambientRef.current.visible = v;
			}
		},
		color: {
			value: 'white',
			onChange: (v) => {
				ambientRef.current.color = new THREE.Color(v);
			}
		},
		intensity: {
			value: 0.4,
			min: 0,
			max: 1,
			step: 0.05,
			onChange: (v) => {
			  ambientRef.current.intensity = v;
			}
		}
	});

	useControls('Directional Light', {
		visible: {
			value: false,
			onChange: (v) => {
				directionalRef.current.visible = v;
			}
		},
		position: {
			x: 0,
			y: 3,
			z: 0,
			onChange: (v) => {
				directionalRef.current.position.copy(v);
			}
		},
		color: {
			value: 'white',
			onChange: (v) => {
				directionalRef.current.color = new THREE.Color(v);
			}
		},
		intensity: {
			value: 0.8,
			min: 0,
			max: 1,
			step: 0.05,
			onChange: (v) => {
			  directionalRef.current.intensity = v;
			}
		}
	});

	useControls('Point Light', {
		visible: {
			value: false,
			onChange: (v) => {
				pointRef.current.visible = v;
			}
		},
		position: {
			x: 2,
			y: 0,
			z: 0,
			onChange: (v) => {
				pointRef.current.position.copy(v);
			}
		},
		color: {
			value: 'white',
			onChange: (v) => {
				pointRef.current.color = new THREE.Color(v);
			}
		}
	});

	useControls('Spot Light', {
		visible: {
			value: false,
			onChange: (v) => {
				spotRef.current.visible = v;
			}
		},
		position: {
			x: 3,
			y: 2.5,
			z: 1,
			onChange: (v) => {
				spotRef.current.position.copy(v);
			}
		},
		color: {
			value: 'white',
			onChange: (v) => {
				spotRef.current.color = new THREE.Color(v);
			}
		}
	});

	return (
		<>
			<ambientLight ref={ambientRef} />
			<directionalLight ref={directionalRef} />
			<pointLight ref={pointRef} />
			<spotLight ref={spotRef} />
		</>
	);
}

export default LightControl;
