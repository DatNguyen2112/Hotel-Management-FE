import { useEffect, useState, useRef } from 'react';

function useOpenModal(initialIsVisible: boolean) {
	const [isOpen, setIsOpen] = useState(initialIsVisible);
	const element = useRef<HTMLDivElement>(null);
	const elementFather = useRef<HTMLDivElement>(null);

	const handleClickOutside = (e: any) => {
		if (element.current && !element.current.contains(e.target) && !elementFather.current?.contains(e.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	return { element, isOpen, setIsOpen, elementFather };
}

export default useOpenModal;
